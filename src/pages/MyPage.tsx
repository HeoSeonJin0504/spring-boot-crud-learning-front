import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  EmailOutlined,
  PersonOutline,
  CalendarTodayOutlined,
  UpdateOutlined,
  PhoneOutlined,
  WcOutlined,
  AccountCircle,
} from '@mui/icons-material';
import { userService } from '../services/api';
import { authService } from '../services/authService';
import { type UserResponseDto } from '../types/User';

function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMyInfo();
  }, []);

  const loadMyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getMyInfo();
      setUser(response.data);
      // userIndex 저장 (본인 확인용)
      authService.saveUserIndex(response.data.userIndex);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          '내 정보를 불러오는데 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;
    
    setDeleting(true);
    try {
      await userService.deleteUser(user.userIndex);
      authService.clearTokens();
      alert('계정이 삭제되었습니다.');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('본인의 계정만 삭제할 수 있습니다.');
      } else {
        alert(error.response?.data?.message || '계정 삭제에 실패했습니다.');
      }
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          내 정보를 불러오는 중...
        </Typography>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="sm">
          <Alert severity="error">
            {error || '정보를 불러올 수 없습니다.'}
          </Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            홈으로
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AccountCircle sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                마이페이지
              </Typography>
              <Typography variant="body2" color="text.secondary">
                내 계정 정보
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonOutline sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      아이디
                    </Typography>
                  </Box>
                  <Typography variant="h6">{user.userId}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonOutline sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      이름
                    </Typography>
                  </Box>
                  <Typography variant="h6">{user.name}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WcOutlined sx={{ mr: 1, color: user.gender === '남성' ? 'primary.main' : 'secondary.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      성별
                    </Typography>
                  </Box>
                  <Typography variant="h6">{user.gender}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneOutlined sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      전화번호
                    </Typography>
                  </Box>
                  <Typography variant="h6">{user.phone}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailOutlined sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      이메일
                    </Typography>
                  </Box>
                  <Typography variant="h6">{user.email || '미등록'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayOutlined sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      가입일
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString('ko-KR')
                      : '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <UpdateOutlined sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      최근 수정일
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString('ko-KR')
                      : '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/mypage/edit`)}
              size="large"
              sx={{ flex: 1, minWidth: 150 }}
            >
              내 정보 수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteClick}
              size="large"
              sx={{ flex: 1, minWidth: 150 }}
            >
              계정 삭제
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              size="large"
              fullWidth
            >
              홈으로
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* 계정 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>계정 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 계정을 삭제하시겠습니까?<br />
            이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            취소
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyPage;
