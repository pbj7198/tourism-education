import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import RichTextEditor from '../components/RichTextEditor';
import type { Editor } from '@tinymce/tinymce-react';

interface BoardPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string;
    name: string;
  };
  files?: {
    name: string;
    url: string;
  }[];
}

interface FileInfo {
  file?: File;
  name: string;
  url?: string;
}

const BoardEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'board_posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as BoardPost;
          setTitle(data.title);
          setContent(data.content);
          if (data.files && Array.isArray(data.files)) {
            setFiles(data.files.map(file => ({
              name: file.name,
              url: file.url
            })));
          }

          // 작성자나 관리자만 수정 가능
          if (currentUser?.id !== data.author.id && currentUser?.role !== 'admin') {
            navigate('/board');
            return;
          }
        } else {
          setError('게시글을 찾을 수 없습니다.');
          navigate('/board');
        }
      } catch (error) {
        console.error('게시글 조회 중 오류:', error);
        setError('게시글 조회에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, currentUser]);

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

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = files[index];
    
    // 기존 파일인 경우 Storage에서도 삭제
    if (fileToRemove.url) {
      try {
        const fileRef = ref(storage, fileToRemove.url);
        await deleteObject(fileRef);
      } catch (error) {
        console.error('파일 삭제 중 오류:', error);
      }
    }
    
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!id) return;

    try {
      setIsSubmitting(true);
      setError('');

      // 새로 업로드할 파일들 처리
      const uploadPromises = files
        .filter(file => file.file) // 새로 추가된 파일만 필터링
        .map(async (fileInfo) => {
          const fileRef = ref(storage, `board_posts/${Date.now()}_${fileInfo.name}`);
          await uploadBytes(fileRef, fileInfo.file!);
          const url = await getDownloadURL(fileRef);
          return {
            name: fileInfo.name,
            url: url
          };
        });

      const uploadedFiles = await Promise.all(uploadPromises);

      // 기존 파일과 새로 업로드된 파일 합치기
      const updatedFiles = [
        ...files.filter(file => file.url), // 기존 파일
        ...uploadedFiles // 새로 업로드된 파일
      ];

      const docRef = doc(db, 'board_posts', id);
      await updateDoc(docRef, {
        title,
        content,
        files: updatedFiles,
      });

      navigate(`/board/${id}`);
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
      setError('게시글 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
            게시글 수정
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
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                파일 첨부
              </Button>

              {files.length > 0 && (
                <List>
                  {files.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={file.name}
                        secondary={file.file ? '새 파일' : '기존 파일'}
                      />
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
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/board/${id}`)}
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
                ) : '수정'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default BoardEdit; 