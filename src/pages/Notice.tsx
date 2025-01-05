import React from 'react';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';

const Notice = () => {
  const notices = [
    {
      id: 1,
      title: '한국관광교육연구회 리뉴얼 관련 공지',
      date: '2024.3.26',
      author: '관리자',
    },
    // 더미 데이터
    {
      id: 2,
      title: '2024년 연간 활동 계획 안내',
      date: '2024.3.15',
      author: '관리자',
    },
    {
      id: 3,
      title: '2024 관광교육 세미나 개최 안내',
      date: '2024.3.10',
      author: '관리자',
    },
  ];

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          공지사항
        </Typography>
        <Paper elevation={3}>
          <List>
            {notices.map((notice, index) => (
              <React.Fragment key={notice.id}>
                <ListItem>
                  <ListItemText
                    primary={notice.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notice.author}
                        </Typography>
                        {" - " + notice.date}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < notices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Notice; 