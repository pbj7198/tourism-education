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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';

interface MaterialPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string | null;
    name: string;
  };
  createdAt: string;
  views: number;
  fileUrl?: string;
  fileName?: string;
}

const MaterialEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<MaterialPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'teaching_materials', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() } as MaterialPost;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
        } else {
          setError('게시글을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('게시글 로드 중 오류:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post && (!currentUser || currentUser.id !== post.author.id)) {
      navigate(`/materials/${id}`);
    }
  }, [post, currentUser, id, navigate]);

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
      let fileUrl = post?.fileUrl || '';
      let fileName = post?.fileName || '';

      // 새 파일이 선택된 경우
      if (file) {
        // 기존 파일이 있다면 삭제
        if (post?.fileUrl) {
          const oldFileRef = ref(storage, post.fileUrl);
          await deleteObject(oldFileRef);
        }

        // 새 파일 업로드
        const fileRef = ref(storage, `gs://tourism-education.firebasestorage.app/materials/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
        fileName = file.name;
      }

      // Firestore 문서 업데이트
      await updateDoc(doc(db, 'teaching_materials', id!), {
        title,
        content,
        fileUrl,
        fileName,
      });

      navigate(`/materials/${id}`);
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
      setError('게시글 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
            임용자료 수정
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              margin="normal"
              required
              multiline
              rows={15}
            />

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
                파일 변경
              </Button>
              {(file || post.fileUrl) && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)` : post.fileName}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => file ? setFile(null) : setPost({ ...post, fileUrl: '', fileName: '' })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : '수정'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/materials/${id}`)}
                disabled={isSubmitting}
              >
                취소
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default MaterialEdit; 