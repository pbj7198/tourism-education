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
  ListItemSecondaryAction
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import RichTextEditor from '../components/RichTextEditor';
import type { Editor } from '@tinymce/tinymce-react';
import { User } from '@firebase/auth-types';

interface FileInfo {
  file: File;
  name: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const BoardForm = () => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      
      // 전체 파일 크기 제한 (50MB)
      if (totalSize > 50 * 1024 * 1024) {
        setError('전체 파일 크기는 50MB를 초과할 수 없습니다.');
        return;
      }

      const newFiles = selectedFiles.map(file => ({
        file,
        name: file.name
      }));

      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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

      // 여러 파일 업로드 처리
      const uploadedFiles = await Promise.all(
        files.map(async (fileInfo) => {
          const fileRef = ref(storage, `board/${Date.now()}_${fileInfo.name}`);
          await uploadBytes(fileRef, fileInfo.file);
          const url = await getDownloadURL(fileRef);
          return {
            url,
            name: fileInfo.name
          };
        })
      );

      const docRef = await addDoc(collection(db, 'board_posts'), {
        title,
        content,
        author: {
          uid: currentUser?.uid || '',
          email: currentUser?.email || '',
          name: currentUser?.email?.split('@')[0] || '익명'
        },
        createdAt: serverTimestamp(),
        views: 0,
        files: uploadedFiles
      });

      navigate(`/board/${docRef.id}`);
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
            게시글 작성
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            <RichTextEditor
              ref={editorRef}
              value={content}
              onChange={setContent}
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <input
                type="file"
                multiple
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
            </Box>

            {files.length > 0 && (
              <List>
                {files.map((fileInfo, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={fileInfo.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/board')}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? '등록 중...' : '등록하기'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default BoardForm; 