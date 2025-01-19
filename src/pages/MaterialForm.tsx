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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MaterialForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['table'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'table'
  ];

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          로그인이 필요한 서비스입니다.
        </Alert>
      </Container>
    );
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
    
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      let fileUrl = '';
      let fileName = '';

      if (file) {
        const fileRef = ref(storage, `materials/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
        fileName = file.name;
      }

      const docRef = await addDoc(collection(db, 'materials'), {
        title,
        content,
        author: {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.email?.split('@')[0] || '익명'
        },
        createdAt: serverTimestamp(),
        views: 0,
        fileUrl,
        fileName
      });

      navigate('/materials');
    } catch (error) {
      console.error('게시글 작성 중 오류:', error);
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
            임용자료 등록
          </Typography>

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

            <Box sx={{ mt: 3, mb: 3, '& .ql-container': { height: '400px' } }}>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="내용을 입력하세요..."
              />
            </Box>

            <Box sx={{ mt: 3, mb: 2 }}>
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
                disabled={isSubmitting}
              >
                파일 첨부
              </Button>
              {file && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setFile(null)}
                    disabled={isSubmitting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/materials')}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
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