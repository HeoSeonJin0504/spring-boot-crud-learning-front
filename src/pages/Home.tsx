import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <PeopleIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Spring Boot CRUD
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Spring Boot + React CRUD 실습 프로젝트
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
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
              onClick={() => navigate('/users/new')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <AddCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  사용자 추가
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  새로운 사용자를 시스템에 등록할 수 있습니다
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 3 }}
                  fullWidth
                  onClick={() => navigate('/users/new')}
                >
                  추가하기
                </Button>
              </CardContent>
            </Card>
          </Grid>
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
