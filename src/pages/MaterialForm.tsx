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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
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
    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      setError('');

      let fileUrl = '';
      let fileName = '';

      if (file) {
        // 파일명에 타임스탬프 추가
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const storageRef = ref(storage, `job/${timestamp}_${file.name}`);
        
        // 파일 업로드 진행률 모니터링
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error('파일 업로드 중 오류:', error);
              setError('파일 업로드에 실패했습니다.');
              reject(error);
            },
            async () => {
              fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
              fileName = file.name;
              resolve();
            }
          );
        });
      }

      const postData = {
        title,
        content,
        author: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        ...(fileUrl && { fileUrl, fileName })
      };

      await addDoc(collection(db, 'materials'), postData);
      navigate('/materials');
    } catch (err) {
      console.error('게시글 등록 중 오류:', err);
      setError('게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          게시글을 작성하려면 로그인이 필요합니다.
        </Alert>
      </Container>
    );
  }

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
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    업로드 중: {uploadProgress.toFixed(0)}%
                  </Typography>
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