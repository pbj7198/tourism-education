import React from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';

const Board = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 폼 제출 처리
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          문의하기
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이름"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="연락처"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="제목"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="문의내용"
              multiline
              rows={4}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              fullWidth
            >
              문의하기
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Board;