import { Container, Typography, Box, useTheme, useMediaQuery, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Pagination } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

// 임시 데이터
const resources = [
  {
    id: 1,
    title: '2024학년도 관광교사 임용시험 기출문제 해설',
    author: '관리자',
    date: '2024-03-20',
    views: 156,
    downloads: 89,
    fileType: 'PDF'
  },
  {
    id: 2,
    title: '관광 교과 지도안 작성 예시자료',
    author: '관리자',
    date: '2024-03-15',
    views: 142,
    downloads: 76,
    fileType: 'DOCX'
  },
  {
    id: 3,
    title: '관광 교과 수업자료 - 관광산업의 이해',
    author: '관리자',
    date: '2024-03-10',
    views: 198,
    downloads: 95,
    fileType: 'PPT'
  },
  {
    id: 4,
    title: '2023학년도 관광교사 임용시험 면접 기출문제',
    author: '관리자',
    date: '2024-03-05',
    views: 167,
    downloads: 82,
    fileType: 'PDF'
  },
  {
    id: 5,
    title: '관광 교과 교육과정 분석 자료',
    author: '관리자',
    date: '2024-03-01',
    views: 145,
    downloads: 68,
    fileType: 'PDF'
  }
];

const Resources = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return '#dc3545';
      case 'DOCX':
        return '#0d6efd';
      case 'PPT':
        return '#fd7e14';
      default:
        return '#6c757d';
    }
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
          관광교사 임용자료
        </Typography>

        <Paper elevation={0} sx={{ backgroundColor: '#f8f9fa' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="8%" align="center" sx={{ fontWeight: 'bold' }}>번호</TableCell>
                  <TableCell width="47%" sx={{ fontWeight: 'bold' }}>제목</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>작성자</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>작성일</TableCell>
                  <TableCell width="15%" align="center" sx={{ fontWeight: 'bold' }}>조회/다운</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow 
                    key={resource.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell align="center">{resource.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: getFileTypeColor(resource.fileType),
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                          }}
                        >
                          {resource.fileType}
                        </Typography>
                        {resource.title}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{resource.author}</TableCell>
                    <TableCell align="center">{resource.date}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                          {resource.views}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DownloadIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                          {resource.downloads}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Pagination 
              count={Math.ceil(resources.length / itemsPerPage)} 
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

export default Resources;
