import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState(`특성화고등학교 표시교과 「관광」 과목의 교사 모임으로
관광 교육에 필요한 정보를 공유하고 관광 교육의 구심점 역할을 수행하고자 하는 연구회`);
  
  const [activities, setActivities] = useState(`한국관광교육연구회는 관광 특성화고 교사들의 원활한 학생 지도와 관광 분야의 취업에 도움을 주기 위한 각종 활동을 운영하고 있습니다.`);
  
  const [activityList, setActivityList] = useState([
    '관광 교사 네트워크 및 연락망 구축',
    '관광 교과서 집필 및 관광 임용 자료 제작',
    '교사 인력풀 형성을 통한 학교 교원 수급 지원',
    '관광 기관 및 기업 협력 학생 취업 역량 강화활동'
  ]);

  const [editContent, setEditContent] = useState(content);
  const [editActivities, setEditActivities] = useState(activities);
  const [editActivityList, setEditActivityList] = useState(activityList.join('\n'));
  const [editSection, setEditSection] = useState<'overview' | 'activities' | null>(null);

  const handleEdit = (section: 'overview' | 'activities') => {
    setEditSection(section);
    if (section === 'overview') {
      setEditContent(content);
    } else {
      setEditActivities(activities);
      setEditActivityList(activityList.join('\n'));
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editSection === 'overview') {
      setContent(editContent);
    } else if (editSection === 'activities') {
      setActivities(editActivities);
      setActivityList(editActivityList.split('\n').filter(item => item.trim()));
    }
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditContent(content);
    setEditActivities(activities);
    setEditActivityList(activityList.join('\n'));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mt: 2, mb: 6 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            mb: 5,
          }}
        >
          한국관광교육연구회 소개
        </Typography>

        <Box
          component="img"
          src="/tourism-education/introduction.png"
          alt="한국관광교육연구회 소개"
          sx={{
            width: '100%',
            maxWidth: '800px',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            mb: 6,
          }}
        />

        <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 3,
              }}
            >
              한국관광교육연구회 개요
            </Typography>
            {user?.role === 'admin' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleEdit('overview')}
              >
                수정
              </Button>
            )}
          </Box>
          <Typography
            variant="body1"
            paragraph
            sx={{
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {content}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 3,
              }}
            >
              한국관광교육연구회 주요활동
            </Typography>
            {user?.role === 'admin' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleEdit('activities')}
              >
                수정
              </Button>
            )}
          </Box>
          <Typography
            variant="body1"
            paragraph
            sx={{
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            {activities}
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {activityList.map((activity, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  mb: 2,
                  lineHeight: 1.8,
                  '&::marker': {
                    color: theme.palette.primary.main,
                  }
                }}
              >
                <Typography variant="body1">
                  {activity}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editSection === 'overview' ? '연구회 개요 수정' : '주요활동 수정'}
        </DialogTitle>
        <DialogContent>
          {editSection === 'overview' ? (
            <TextField
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          ) : (
            <>
              <TextField
                label="활동 소개"
                multiline
                rows={4}
                value={editActivities}
                onChange={(e) => setEditActivities(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <TextField
                label="활동 목록 (줄바꿈으로 구분)"
                multiline
                rows={6}
                value={editActivityList}
                onChange={(e) => setEditActivityList(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>취소</Button>
          <Button onClick={handleSave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default About;
