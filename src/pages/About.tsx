import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import PageTransition from '../components/PageTransition';
import introImage from '../../public/introduction.png';

const About = () => {
  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* 게시글 헤더 */}
          <Box sx={{ mb: 4, borderBottom: '1px solid #e0e0e0', pb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: '#333',
                mb: 2
              }}
            >
              한국관광교육연구회 소개
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                color: '#666',
                fontSize: '0.9rem'
              }}
            >
              <Box>작성자: 관리자</Box>
              <Divider orientation="vertical" flexItem />
              <Box>작성일: 2024-01-07</Box>
            </Box>
          </Box>

          {/* 게시글 본문 */}
          <Box sx={{ 
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0
          }}>
            {/* 소개 이미지 */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60%',
              mb: 0
            }}>
              <img
                src={introImage}
                alt="한국관광교육연구회 소개"
                style={{ 
                  maxWidth: '60%', 
                  height: 'auto',
                }}
              />
            </Box>

            {/* 개요 섹션 */}
            <Box sx={{ width: '100%' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#333',
                  mb: 1,
                  pb: 0.5,
                  borderBottom: '2px solid #f0f0f0'
                }}
              >
                한국관광교육연구회 개요
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.1rem',
                  color: '#444',
                  lineHeight: 2,
                  whiteSpace: 'pre-line'
                }}
              >
                특성화고등학교 「관광」 과목의 교사 모임으로
                관광 교육에 필요한 정보를 공유하고 관광 교육의 구심점 역할을 수행하고자 하는 연구회
              </Typography>
              <br/>
            </Box>

            {/* 주요활동 섹션 */}
            <Box sx={{ width: '100%' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#333',
                  mb: 1,
                  pb: 0.5,
                  borderBottom: '2px solid #f0f0f0'
                }}
              >
                한국관광교육연구회 주요활동
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.1rem',
                  color: '#444',
                  lineHeight: 1.8,
                  mb: 3
                }}
              >
                한국관광교육연구회는 관광 특성화고 교사들의 원활한 학생 지도와 관광 분야의 취업에 도움을 주기 위한 각종 활동을 운영하고 있습니다.
              </Typography>

              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {[
                  '관광 교사 네트워크 및 연락망 구축',
                  '관광 교과서 집필 및 관광 임용 자료 제작',
                  '교사 인력풀 형성을 통한 학교 교원 수급 지원',
                  '관광 기관 및 기업 협력 학생 취업 역량 강화활동'
                ].map((activity, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{
                      mb: 2,
                      fontSize: '1.1rem',
                      color: '#444',
                      lineHeight: 1.8,
                    }}
                  >
                    {activity}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* 게시글 푸터 */}
          <Box sx={{ pt: 4, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary">
              ※ 본 게시글은 한국관광교육연구회의 공식 소개 자료입니다.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default About;
