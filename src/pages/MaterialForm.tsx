import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';

const MaterialForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!currentUser) {
    navigate('/materials');
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // 파일 크기 제한 (50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('파일 크기는 50MB를 초과할 수 없습니다.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      let fileUrl = '';
      let fileName = '';

      // 파일이 있는 경우 업로드
      if (file) {
        try {
          const fileRef = ref(storage, `materials/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          fileUrl = await getDownloadURL(fileRef);
          fileName = file.name;
        } catch (uploadError: any) {
          console.error('파일 업로드 중 오류:', uploadError);
          setError(`파일 업로드 실패: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Firestore에 게시글 저장
      const docRef = await addDoc(collection(db, 'teaching_materials'), {
        title,
        content,
        authorId: currentUser.email,
        createdAt: new Date().toISOString(),
        views: 0,
        fileUrl,
        fileName
      });

      navigate(`/materials/${docRef.id}`);
    } catch (error: any) {
      console.error('게시글 작성 중 오류:', error);
      setError(`게시글 작성 실패: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          임용자료 등록
        </Typography>

        <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={15}
              margin="normal"
              required
            />

            <Box sx={{ mt: 3, mb: 3 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
              >
                파일 첨부
              </Button>
              {file && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </Typography>
                  <IconButton size="small" onClick={() => setFile(null)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/materials')}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    등록 중...
                  </>
                ) : '등록'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default MaterialForm; 