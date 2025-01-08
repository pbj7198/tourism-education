import { Container, Box, Typography, Paper } from '@mui/material';
import PageTransition from '../components/PageTransition';
import introImage from '../../public/introduction.png';

const About = () => {
  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: 8,
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mb: 5,
              fontWeight: 600,
              color: '#333',
              letterSpacing: '-0.5px'
            }}
          >
            한국관광교육연구회 소개
          </Typography>
          <Box sx={{ mb: 6, width: '100%', maxWidth: '1000px' }}>
            <img
              src={introImage}
              alt="한국관광교육연구회 소개"
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 5, 
              mb: 5, 
              backgroundColor: '#f8f9fa',
              borderRadius: '12px'
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                mb: 4,
                fontWeight: 600,
                color: '#1a1a1a',
                letterSpacing: '-0.5px'
              }}
            >
              한국관광교육연구회 개요
            </Typography>
            
            <Typography 
              paragraph 
              sx={{ 
                mb: 4, 
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: '#444',
                whiteSpace: 'pre-line'
              }}
            >
              특성화고등학교 표시교과 「관광」 과목의 교사 모임으로
              관광 교육에 필요한 정보를 공유하고 관광 교육의 구심점 역할을 수행하고자 하는 연구회
            </Typography>
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 5, 
              backgroundColor: '#f8f9fa',
              borderRadius: '12px'
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                mb: 4,
                fontWeight: 600,
                color: '#1a1a1a',
                letterSpacing: '-0.5px'
              }}
            >
              한국관광교육연구회 주요활동
            </Typography>

            <Typography 
              paragraph 
              sx={{ 
                mb: 4,
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: '#444'
              }}
            >
              한국관광교육연구회는 관광 특성화고 교사들의 원활한 학생 지도와 관광 분야의 취업에 도움을 주기 위한 각종 활동을 운영하고 있습니다.
            </Typography>

            <Box component="ul" sx={{ pl: 2, m: 0 }}>
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
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    color: '#444',
                    '&::marker': {
                      color: '#2196f3',
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  {activity}
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default About;
