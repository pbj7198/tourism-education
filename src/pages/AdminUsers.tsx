import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Snackbar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  updateUserProfile,
  cleanupFirestoreUsers,
} from '../services/auth';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editStatus, setEditStatus] = useState<'active' | 'blocked'>('active');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Firestore 실시간 구독 설정
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        // 중복 제거 및 유효한 데이터만 필터링
        const uniqueUsers = new Map();
        snapshot.docs.forEach(doc => {
          const userData = doc.data() as User;
          // id가 있고, email이 있는 유효한 데이터만 포함
          if (doc.id && userData.email) {
            uniqueUsers.set(userData.email, {
              ...userData,
              id: doc.id
            });
          }
        });
        
        const updatedUsers = Array.from(uniqueUsers.values());
        console.log('Filtered users:', updatedUsers); // 디버깅용 로그
        setUsers(updatedUsers);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore 구독 에러:', err);
        setError('사용자 목록을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditClick = () => {
    if (selectedUser) {
      setEditName(selectedUser.name);
      setEditEmail(selectedUser.email);
      setEditRole(selectedUser.role);
      setEditStatus(selectedUser.status);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSave = async () => {
    if (selectedUser) {
      try {
        await updateUserProfile(selectedUser.id, {
          name: editName,
          email: editEmail,
        });
        await updateUserRole(selectedUser.id, editRole);
        await updateUserStatus(selectedUser.id, editStatus);
        
        setIsEditDialogOpen(false);
        showSnackbar('회원정보가 수정되었습니다.');
      } catch (error) {
        console.error('Failed to update user:', error);
        showSnackbar('회원정보 수정에 실패했습니다.');
      }
    }
  };

  const handleToggleAdmin = async () => {
    if (selectedUser) {
      try {
        const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
        await updateUserRole(selectedUser.id, newRole);
        showSnackbar(`${newRole === 'admin' ? '관리자로 지정되었습니다.' : '관리자 권한이 해제되었습니다.'}`);
      } catch (error) {
        console.error('Failed to toggle admin role:', error);
        showSnackbar('권한 변경에 실패했습니다.');
      }
    }
    handleMenuClose();
  };

  const handleToggleBlock = async () => {
    if (selectedUser) {
      try {
        const newStatus = selectedUser.status === 'blocked' ? 'active' : 'blocked';
        await updateUserStatus(selectedUser.id, newStatus);
        showSnackbar(`계정이 ${newStatus === 'active' ? '활성화' : '차단'}되었습니다.`);
      } catch (error) {
        console.error('Failed to toggle user status:', error);
        showSnackbar('상태 변경에 실패했습니다.');
      }
    }
    handleMenuClose();
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setEditRole(event.target.value as 'admin' | 'user');
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setEditStatus(event.target.value as 'active' | 'blocked');
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          관리자만 접근할 수 있는 페이지입니다.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          회원 관리
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={async () => {
            try {
              setLoading(true);
              await cleanupFirestoreUsers();
              showSnackbar('데이터 정리가 완료되었습니다.');
            } catch (error) {
              showSnackbar('데이터 정리 중 오류가 발생했습니다.');
            } finally {
              setLoading(false);
            }
          }}
        >
          데이터 정리
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>권한</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>가입일</TableCell>
                <TableCell align="right">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.role === 'admin' ? '관리자' : '일반회원'}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.status === 'active' ? '활성' : '차단됨'}
                      color={user.status === 'active' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1 }} />
          회원정보 수정
        </MenuItem>
        <MenuItem onClick={handleToggleAdmin}>
          <AdminPanelSettingsIcon sx={{ mr: 1 }} />
          {selectedUser?.role === 'admin' ? '관리자 권한 해제' : '관리자로 지정'}
        </MenuItem>
        <MenuItem onClick={handleToggleBlock}>
          <BlockIcon sx={{ mr: 1 }} />
          {selectedUser?.status === 'blocked' ? '차단 해제' : '사용자 차단'}
        </MenuItem>
      </Menu>

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>회원정보 수정</DialogTitle>
        <DialogContent>
          <TextField
            label="이름"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="이메일"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>권한</InputLabel>
            <Select
              value={editRole}
              label="권한"
              onChange={handleRoleChange}
            >
              <MenuItem value="user">일반회원</MenuItem>
              <MenuItem value="admin">관리자</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>상태</InputLabel>
            <Select
              value={editStatus}
              label="상태"
              onChange={handleStatusChange}
            >
              <MenuItem value="active">활성</MenuItem>
              <MenuItem value="blocked">차단</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleEditSave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AdminUsers; 