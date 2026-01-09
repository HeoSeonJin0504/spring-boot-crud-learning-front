import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { authService } from '../services/authService';

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <PeopleIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Spring Boot CRUD
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Spring Boot + React CRUD 실습 프로젝트
          </Typography>
          
          {isAuthenticated && currentUser && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" color="text.secondary">
                환영합니다, <strong>{currentUser.name}</strong>님!
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ mt: 1 }}
              >
                로그아웃
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {!isAuthenticated ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/login')}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <LoginIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                      로그인
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      기존 계정으로 로그인하세요
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 3 }}
                      fullWidth
                      onClick={() => navigate('/login')}
                    >
                      로그인하기
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/register')}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <PersonAddIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                      회원가입
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      새로운 계정을 만드세요
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 3 }}
                      fullWidth
                      onClick={() => navigate('/register')}
                    >
                      가입하기
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/users')}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <ListAltIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    사용자 목록
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    등록된 모든 사용자를 조회하고 관리할 수 있습니다
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    fullWidth
                    onClick={() => navigate('/users')}
                  >
                    목록 보기
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            📚 CRUD 기능: Create, Read, Update, Delete를 모두 실습할 수 있습니다
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
