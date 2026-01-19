import { useEffect, useState } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, Logout, People, Person } from '@mui/icons-material';
import { userService } from '../services/api';
import { authService } from '../services/authService';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadUserInfo = async () => {
    try {
      // 먼저 localStorage에서 확인
      const storedUser = authService.getStoredUser();
      if (storedUser?.name) {
        setUserName(storedUser.name);
      }
      
      // 서버에서 최신 정보 조회
      const response = await userService.getMyInfo();
      setUserName(response.data.name);
    } catch {
      // 에러 시 localStorage 정보 사용
      const storedUser = authService.getStoredUser();
      setUserName(storedUser?.name || null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      const userId = authService.getCurrentUserId();
      if (userId) {
        try {
          await userService.logout(userId);
        } catch (error: any) {
          if (error.response?.status === 403) {
            console.error('본인만 로그아웃할 수 있습니다.');
          }
        }
      }
      authService.clearTokens();
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <People sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            CRUD System
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Person sx={{ mr: 0.5, fontSize: 20 }} />
            {loading ? (
              <Skeleton variant="text" width={60} />
            ) : (
              <Typography variant="body2">
                {userName || '사용자'}님
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/')}
            >
              홈
            </Button>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
