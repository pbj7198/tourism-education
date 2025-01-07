import { Container, Typography, Box, useTheme, useMediaQuery, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Pagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

// 임시 데이터
const notices = [
  {
    id: 1,
    title: '2024학년도 관광교사 임용시험 대비 스터디 모집',
    author: '관리자',
    date: '2024-03-20',
    views: 45
  },
  {
    id: 2,
    title: '2024년 1학기 관광교육 연구회 정기 모임 안내',
    author: '관리자',
    date: '2024-03-15',
    views: 38
  },
  {
    id: 3,
    title: '관광교사 임용시험 기출문제 자료집 공유',
    author: '관리자',
    date: '2024-03-10',
    views: 92
  },
  {
    id: 4,
    title: '2024년 관광교육 교과연구회 지원사업 안내',
    author: '관리자',
    date: '2024-03-05',
    views: 67
  },
  {
    id: 5,
    title: '특성화고 관광과 교육과정 개편 연구 참여자 모집',
    author: '관리자',
    date: '2024-03-01',
    views: 73
  }
];

const Notice = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mt: 2, mb: 6 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            mb: 5,
          }}
        >
          연구회 공지사항
        </Typography>

        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>번호</TableCell>
                  <TableCell width="50%" sx={{ fontWeight: 'bold' }}>제목</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>작성자</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>작성일</TableCell>
                  <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>조회</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow 
                    key={notice.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell align="center">{notice.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {notice.title}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{notice.author}</TableCell>
                    <TableCell align="center">{notice.date}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <VisibilityIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                        {notice.views}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={Math.ceil(notices.length / itemsPerPage)} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Notice;
