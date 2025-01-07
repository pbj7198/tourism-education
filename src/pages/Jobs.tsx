import { Container, Typography, Box, useTheme, useMediaQuery, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Pagination } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useState, useMemo } from 'react';

// 임시 데이터
const jobPostings = [
  {
    id: 13,
    title: '한국문화영상고등학교 기간제 교사 모집',
    author: 'kang****',
    date: '2024.10.30',
    isNotice: false
  },
  {
    id: 12,
    title: '송곡관광고등학교 기간제교원 채용 재공고(관광)',
    author: 'zinn****',
    date: '2024.8.12',
    isNotice: false
  },
  {
    id: 11,
    title: '2024년 중문고등학교 관광 기간제 채용공고',
    author: 'non0****',
    date: '2024.2.2',
    isNotice: false
  },
  {
    id: 10,
    title: '2024년 제주고등학교 관광 기간제 교사 채용 공고',
    author: 'non0****',
    date: '2024.2.2',
    isNotice: false
  },
  {
    id: 9,
    title: '2024년 고명외식고등학교 관광(기간제) 교사 채용 공고(~2024.1.22.)',
    author: '관리자',
    date: '2024.1.13',
    isNotice: false
  },
  {
    id: 7,
    title: '2024년 송곡관광고등학교 관광(기간제) 교사 채용 공고(~2024.1.24.)',
    author: '관리자',
    date: '2024.1.13',
    isNotice: false
  },
  {
    id: 2,
    title: '[공지] 관광교사 채용소식 게시글 양식',
    author: '관리자',
    date: '2023.12.17',
    isNotice: true
  },
  {
    id: 1,
    title: '[공지] 특성화고 관광교사 채용 정보 확인 사이트',
    author: '관리자',
    date: '2023.12.17',
    isNotice: true
  }
];

const Jobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // 공지사항을 최상단에 정렬하고, 나머지는 ID 기준 내림차순 정렬
  const sortedJobPostings = useMemo(() => {
    return [...jobPostings].sort((a, b) => {
      if (a.isNotice && !b.isNotice) return -1;
      if (!a.isNotice && b.isNotice) return 1;
      if (a.isNotice === b.isNotice) {
        // 공지사항끼리는 최신순(ID 내림차순)으로 정렬
        return b.id - a.id;
      }
      return 0;
    });
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mt: 2, mb: 6 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 500,
            mb: 3,
            pl: 1,
          }}
        >
          관광교사 채용소식
        </Typography>

        <Paper elevation={0} sx={{ backgroundColor: '#f8f9fa' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>번호</TableCell>
                  <TableCell width="55%" sx={{ fontWeight: 'bold' }}>글제목</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>글쓴이</TableCell>
                  <TableCell width="20%" align="center" sx={{ fontWeight: 'bold' }}>작성일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedJobPostings.map((job) => (
                  <TableRow 
                    key={job.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      },
                      backgroundColor: job.isNotice ? 'rgba(0, 0, 0, 0.02)' : 'inherit'
                    }}
                  >
                    <TableCell align="center">{job.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {job.isNotice && (
                          <VolumeUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        )}
                        {job.title}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{job.author}</TableCell>
                    <TableCell align="center">{job.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Pagination 
              count={Math.ceil(sortedJobPostings.length / itemsPerPage)} 
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

export default Jobs;
