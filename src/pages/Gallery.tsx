import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActions
} from '@mui/material';
import { collection, query, orderBy, getDocs, addDoc, where, limit, startAfter, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/user';
import { Editor } from '@tinymce/tinymce-react';
import AddIcon from '@mui/icons-material/Add';

interface AuthContextType {
  currentUser: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    role: 'admin' | 'user';
    createdAt: string;
    status: 'active' | 'blocked';
  } | null;
  isLoading: boolean;
  register: (credentials: any) => Promise<User>;
  login: (credentials: any) => Promise<User>;
  logout: () => Promise<void>;
}

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  content?: string;
  createdAt: Date;
  views: number;
  author: {
    uid: string;
    email: string | null;
  };
}

interface Notice {
  id: string;
  content: string;
  updatedAt: Date;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 9;
  const { currentUser } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isNoticeEditMode, setIsNoticeEditMode] = useState(false);
  const [editNoticeContent, setEditNoticeContent] = useState('');
  const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;

  useEffect(() => {
    console.log('Current User:', currentUser);
    fetchNotice();
    fetchGalleryItems();
  }, [page, searchTerm, searchType]);

  const fetchNotice = async () => {
    const noticeRef = doc(db, 'notice', 'main');
    const noticeSnap = await getDoc(noticeRef);
    
    if (noticeSnap.exists()) {
      setNotice({
        id: noticeSnap.id,
        content: noticeSnap.data().content,
        updatedAt: noticeSnap.data().updatedAt.toDate(),
      });
      setEditNoticeContent(noticeSnap.data().content);
    }
  };

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'gallery'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      let items: GalleryItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document data:', data); // 디버깅용
        
        const item = {
          id: doc.id,
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt.toDate(),
          views: data.views || 0,
          author: {
            uid: data.author?.uid || 'unknown',
            email: data.author?.email || 'unknown'
          }
        };
        console.log('Processed item:', item); // 디버깅용
        items.push(item as GalleryItem);
      });

      // 검색어가 있는 경우 클라이언트 사이드에서 필터링
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        items = items.filter(item => {
          if (searchType === 'title') {
            return item.title.toLowerCase().includes(searchLower);
          } else if (searchType === 'content') {
            return item.content?.toLowerCase().includes(searchLower);
          }
          return false;
        });
      }

      // 전체 아이템 수 설정
      setTotalItems(items.length);
      
      // 페이지네이션 적용
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setImages(items.slice(startIndex, endIndex));
    } catch (error) {
      console.error('갤러리 아이템 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    let imageUrl: string | undefined;

    try {
      const file = event.target.files[0];
      const title = prompt('사진 제목을 입력해주세요:');
      if (!title) return;

      const content = prompt('사진에 대한 설명을 입력해주세요:');
      if (!content) return;

      setLoading(true);

      // Firebase Storage에 이미지 업로드
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);

      // 작성자 데이터 생성
      const authorData = {
        uid: currentUser.id,  // id를 uid로 사용
        email: currentUser.email
      };

      // Firestore에 문서 추가
      const docRef = await addDoc(collection(db, 'gallery'), {
        title,
        content,
        imageUrl,
        createdAt: new Date(),
        views: 0,  // 초기 조회수 추가
        author: authorData
      });

      console.log('Document written with ID:', docRef.id);
      alert('사진이 성공적으로 업로드되었습니다.');
      fetchGalleryItems();
    } catch (error) {
      console.error('업로드 중 오류:', error);
      if (error instanceof Error) {
        alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
      } else {
        alert('업로드 중 오류가 발생했습니다.');
      }

      // 에러가 발생했을 때 Storage에 업로드된 이미지가 있다면 삭제
      try {
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
      } catch (cleanupError) {
        console.error('이미지 정리 중 오류:', cleanupError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = () => {
    setPage(1);
    fetchGalleryItems();
  };

  const handleImageClick = async (image: GalleryItem) => {
    setSelectedImage(image);
    
    // 조회수 증가
    try {
      const docRef = doc(db, 'gallery', image.id);
      await updateDoc(docRef, {
        views: (image.views || 0) + 1
      });
      
      // 로컬 상태 업데이트
      setImages(prevImages => 
        prevImages.map(item => 
          item.id === image.id 
            ? { ...item, views: (item.views || 0) + 1 }
            : item
        )
      );
    } catch (error) {
      console.error('조회수 업데이트 중 오류:', error);
    }
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!window.confirm('정말로 이 사진을 삭제하시겠습니까?')) return;

    try {
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, 'gallery', imageId));
      
      // Storage에서 이미지 파일 삭제
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      fetchGalleryItems();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewImage(file);
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEdit = async (imageId: string) => {
    if (!editTitle || !editContent) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      let updateData: any = {
        title: editTitle,
        content: editContent,
      };

      // 새 이미지가 있는 경우
      if (newImage) {
        // 기존 이미지 삭제
        if (selectedImage?.imageUrl) {
          const oldImageRef = ref(storage, selectedImage.imageUrl);
          await deleteObject(oldImageRef);
        }

        // 새 이미지 업로드
        const storageRef = ref(storage, `gallery/${Date.now()}_${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        const newImageUrl = await getDownloadURL(storageRef);
        updateData.imageUrl = newImageUrl;
      }

      await updateDoc(doc(db, 'gallery', imageId), updateData);

      setSelectedImage(null);
      setIsEditMode(false);
      setNewImage(null);
      setPreviewUrl('');
      fetchGalleryItems();
      alert('수정이 완료되었습니다.');
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const startEdit = (image: GalleryItem) => {
    setEditTitle(image.title);
    setEditContent(image.content || '');
    setIsEditMode(true);
    setPreviewUrl(''); // 미리보기 초기화
    setNewImage(null); // 새 이미지 초기화
  };

  // 관리자 또는 작성자 여부를 확인하는 함수 추가
  const canEditOrDelete = (authorUid: string) => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.id === authorUid;
  };

  const handleNoticeEdit = async () => {
    if (!editNoticeContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const noticeRef = doc(db, 'notice', 'main');
      await setDoc(noticeRef, {
        content: editNoticeContent,
        updatedAt: new Date()
      });

      setIsNoticeEditMode(false);
      fetchNotice();
      alert('공지사항이 수정되었습니다.');
    } catch (error) {
      console.error('공지사항 수정 중 오류:', error);
      alert('공지사항 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 공지사항 섹션 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            공지사항
          </Typography>
          {currentUser?.role === 'admin' && (
            <IconButton
              size="small"
              onClick={() => setIsNoticeEditMode(true)}
            >
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          {notice ? (
            <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              등록된 공지사항이 없습니다.
            </Typography>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'right' }}>
          {notice?.updatedAt && `최종 수정일: ${notice.updatedAt.toLocaleDateString()}`}
        </Typography>
      </Paper>

      {/* 갤러리 헤더 */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          연구회 활동사진
        </Typography>
        {currentUser && (
          <Button
            variant="contained"
            component="label"
          >
            사진 업로드
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        )}
      </Box>

      {/* 검색 섹션 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>검색 조건</InputLabel>
          <Select
            value={searchType}
            label="검색 조건"
            onChange={(e) => setSearchType(e.target.value)}
          >
            <MenuItem value="title">제목</MenuItem>
            <MenuItem value="content">내용</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <IconButton onClick={handleSearch} color="primary">
          <SearchIcon />
        </IconButton>
      </Box>

      {/* 전체 건수 표시 */}
      <Typography variant="body2" sx={{ mb: 2 }}>
        전체 {totalItems}건 중 {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, totalItems)}
      </Typography>

      {/* 갤러리 그리드 */}
      <Grid container spacing={3}>
        {images.map((item) => {
          console.log('Rendering item:', item);
          console.log('Current user:', currentUser);
          console.log('Item author:', item.author);
          
          const hasPermission = canEditOrDelete(item.author.uid);
          console.log('Has permission?', hasPermission);

          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ position: 'relative', height: '100%' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleImageClick(item)}
                  />
                  {hasPermission && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1,
                        padding: '4px',
                        zIndex: 2
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <IconButton
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedImage(item);
                          setIsEditMode(true);
                          setEditTitle(item.title);
                          setEditContent(item.content || '');
                        }}
                        sx={{ 
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                          zIndex: 3
                        }}
                      >
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDelete(item.id, item.imageUrl);
                        }}
                        sx={{ 
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                          zIndex: 3
                        }}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    noWrap 
                    sx={{ 
                      textAlign: 'center',
                      mb: 1
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1
                  }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {item.createdAt.toLocaleDateString()}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      조회 {item.views || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 페이지네이션 */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(totalItems / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* 이미지 상세 보기 다이얼로그 */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => {
          setSelectedImage(null);
          setIsEditMode(false);
          setNewImage(null);
          setPreviewUrl('');
        }}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle>
              {isEditMode ? '사진 수정' : selectedImage.title}
            </DialogTitle>
            <DialogContent>
              {isEditMode ? (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <img
                      src={previewUrl || selectedImage.imageUrl}
                      alt={selectedImage.title}
                      style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      이미지 변경
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    label="제목"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="설명"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    multiline
                    rows={4}
                  />
                </Box>
              ) : (
                <>
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                  />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {selectedImage.content}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mt: 1
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {selectedImage.createdAt.toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      조회 {selectedImage.views || 0}
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {isEditMode ? (
                <>
                  <Button onClick={() => handleEdit(selectedImage.id)} color="primary">
                    저장
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsEditMode(false);
                      setNewImage(null);
                      setPreviewUrl('');
                    }} 
                    color="inherit"
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  {canEditOrDelete(selectedImage.author.uid) && (
                    <>
                      <Button onClick={() => startEdit(selectedImage)} color="primary">
                        수정
                      </Button>
                      <Button
                        onClick={() => handleDelete(selectedImage.id, selectedImage.imageUrl)}
                        color="error"
                      >
                        삭제
                      </Button>
                    </>
                  )}
                  <Button onClick={() => setSelectedImage(null)}>닫기</Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 공지사항 수정 다이얼로그 */}
      <Dialog
        open={isNoticeEditMode}
        onClose={() => setIsNoticeEditMode(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>공지사항 수정</DialogTitle>
        <DialogContent>
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={editNoticeContent}
            onEditorChange={(content) => setEditNoticeContent(content)}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoticeEdit} color="primary">
            저장
          </Button>
          <Button onClick={() => setIsNoticeEditMode(false)} color="inherit">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Gallery; 