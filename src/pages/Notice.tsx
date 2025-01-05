import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

interface Notice {
  id: number;
  title: string;
  date: string;
  author: string;
}

const Notice = () => {
  const notices: Notice[] = [
    {
      id: 1,
      title: '2024년 정기 총회 개최 안내',
      date: '2024-02-15',
      author: '관리자'
    },
    {
      id: 2,
      title: '2024년 연구회 활동 계획 공지',
      date: '2024-02-01',
      author: '관리자'
    },
    {
      id: 3,
      title: '동계 워크샵 참가자 모집',
      date: '2024-01-15',
      author: '관리자'
    }
  ];

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          공지사항
        </Typography>
        <List>
          {notices.map((notice, index) => (
            <ListItem key={notice.id} divider={index < notices.length - 1}>
              <ListItemText
                primary={notice.title}
                secondary={`${notice.date} | ${notice.author}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Notice;
