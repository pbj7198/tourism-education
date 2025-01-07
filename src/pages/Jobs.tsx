import { Container, Typography, Box, useTheme, useMediaQuery, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useState } from 'react';

// 임시 데이터
const jobPostings = [
  {
    id: 1,
    title: '2024학년도 ○○고등학교 관광 교과 기간제 교사 채용 공고',
    school: '○○고등학교',
    location: '서울',
    status: '진행중',
    period: '2024-03-01 ~ 2024-08-31',
    postDate: '2024-03-20',
    views: 245
  },
  {
    id: 2,
    title: '2024학년도 △△관광고등학교 관광 교과 정교사 채용 공고',
    school: '△△관광고등학교',
    location: '부산',
    status: '마감',
    period: '정규직',
    postDate: '2024-03-15',
    views: 312
  },
  {
    id: 3,
    title: '□□관광고등학교 관광 교과 시간강사 모집',
    school: '□□관광고등학교',
    location: '인천',
    status: '진행중',
    period: '2024-04-01 ~ 2024-07-31',
    postDate: '2024-03-10',
    views: 178
  },
  {
    id: 4,
    title: '◇◇고등학교 관광 교과 기간제 교사 채용',
    school: '◇◇고등학교',
    location: '대전',
    status: '마감',
    period: '2024-03-15 ~ 2024-12-31',
    postDate: '2024-03-05',
    views: 265
  },
  {
    id: 5,
    title: '2024학년도 ◎◎관광고등학교 관광 교과 정교사 특별 채용',
    school: '◎◎관광고등학교',
    location: '경기',
    status: '진행중',
    period: '정규직',
    postDate: '2024-03-01',
    views: 423
  }
];

const Jobs = () => {
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
                  <TableCell width="8%" align="center" sx={{ fontWeight: 'bold' }}>번호</TableCell>
                  <TableCell width="42%" sx={{ fontWeight: 'bold' }}>채용공고</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>지역</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>게시일</TableCell>
                  <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>상태</TableCell>
                  <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>조회</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow 
                    key={job.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell align="center">{job.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2">{job.title}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {job.school} | {job.period}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{job.location}</TableCell>
                    <TableCell align="center">{job.postDate}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={job.status} 
                        size="small"
                        color={job.status === '진행중' ? 'primary' : 'default'}
                        sx={{ 
                          fontSize: '0.75rem',
                          minWidth: 60
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{job.views}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Pagination 
              count={Math.ceil(jobPostings.length / itemsPerPage)} 
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
