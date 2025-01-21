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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import RichTextEditor from '../components/RichTextEditor';
import type { Editor } from '@tinymce/tinymce-react';

interface FileInfo {
  file: File;
  name: string;
  url?: string;
}

const MaterialForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          로그인이 필요한 서비스입니다.
        </Alert>
      </Container>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map(file => ({
        file,
        name: file.name
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
    // 파일 선택 후 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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

      // 파일 업로드 및 URL 가져오기
      const uploadPromises = files.map(async (fileInfo) => {
        const fileRef = ref(storage, `materials/${Date.now()}_${fileInfo.name}`);
        await uploadBytes(fileRef, fileInfo.file);
        const url = await getDownloadURL(fileRef);
        return {
          name: fileInfo.name,
          url: url
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Firestore에 문서 추가
      const docRef = await addDoc(collection(db, 'teaching_materials'), {
        title,
        content,
        author: {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.email?.split('@')[0] || '익명'
        },
        createdAt: Timestamp.now(),
        views: 0,
        files: uploadedFiles
      });

      navigate(`/materials/${docRef.id}`);
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

            <Box sx={{ mt: 3, mb: 3 }}>
              <RichTextEditor
                ref={editorRef}
                value={content}
                onChange={setContent}
                placeholder="내용을 입력하세요..."
              />
            </Box>

            <Box sx={{ mt: 3, mb: 2 }}>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                파일 첨부
              </Button>
            </Box>

            {files.length > 0 && (
              <List>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFile(index)}
                        disabled={isSubmitting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}

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