import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PageTransition from '../components/PageTransition';
import emailjs from '@emailjs/browser';

// EmailJS 초기화
emailjs.init('7vJueVQ2aw5G_PQ-2');

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  title: string;
  content: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      // Firestore에 문의 내용 저장
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      // EmailJS를 사용하여 이메일 전송
      const emailResult = await emailjs.send(
        'service_zgr33lt', // EmailJS Service ID
        'template_gukhnjr', // EmailJS Template ID
        {
          to_email: 'msh9618@naver.com',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          title: formData.title,
          message: formData.content
        },
        '7vJueVQ2aw5G_PQ-2' // EmailJS Public Key
      );

      if (emailResult.status === 200) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          title: '',
          content: ''
        });
      } else {
        throw new Error('이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('문의하기 제출 중 오류:', error);
      setError('문의하기 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          문의하기
        </Typography>
        
        <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              문의가 성공적으로 접수되었습니다.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="연락처"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="제목"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="문의내용"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={6}
              margin="normal"
              required
            />
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{ minWidth: 200 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    전송 중...
                  </>
                ) : '문의하기'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default Contact; 