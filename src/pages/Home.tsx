import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <PeopleIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h2" component="h1" gutterBottom>
          User Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Spring Boot + React로 구현한 사용자 CRUD 애플리케이션
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/users')}
          sx={{ mt: 2 }}
        >
          사용자 목록 보기
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
