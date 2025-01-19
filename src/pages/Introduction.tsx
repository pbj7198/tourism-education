import { Container, Paper, Typography, Box } from '@mui/material';
import PageTransition from '../components/PageTransition';

const Introduction = () => {
  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: '50%', 
              margin: '0 auto',
              marginBottom: '2rem'
            }}>
              <img
                src="/ four_members.jpeg"
                alt="한국관광교육연구회 소개"
                style={{ 
                  width: '100%',
                  height: 'auto'
                }}
              />
            </Box>
          </Box>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            한국관광교육연구회
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            관광교육의 발전을 위한 연구와 교류의 장
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            특성화고등학교 관광과사 연구회
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" paragraph>
              한국관광교육연구회는 관광 교육의 질적 향상과 발전을 위해 설립된 교사 연구 단체입니다.
              우리는 급변하는 관광 산업 환경에 맞춰 학생들에게 실질적이고 효과적인 교육을 제공하기 위해
              노력하고 있습니다.
            </Typography>
            <Typography variant="body1" paragraph>
              주요 활동으로는 교육과정 연구, 교수학습 자료 개발, 현장 실무 연구, 교사 연수 등이
              있으며, 회원들 간의 활발한 교류를 통해 관광 교육의 발전을 도모하고 있습니다.
            </Typography>
            <Typography variant="body1" paragraph>
              또한, 산학 협력을 통해 현장의 요구를 교육에 반영하고, 학생들의 실무 능력 향상을 위한
              다양한 프로그램을 개발하고 있습니다.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default Introduction; 