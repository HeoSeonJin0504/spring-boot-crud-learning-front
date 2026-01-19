import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
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
} from '@mui/icons-material';
import { userService } from '../services/api';
import { authService } from '../services/authService';
import { type UserResponseDto } from '../types/User';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnAccount, setIsOwnAccount] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser(Number(id));
    }
  }, [id]);

  const loadUser = async (userIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserById(userIndex);
      setUser(response.data);
      // 본인 계정인지 확인
      setIsOwnAccount(authService.isOwnAccount(response.data.userId));
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('사용자를 찾을 수 없습니다.');
      } else {
        setError(
          error.response?.data?.message ||
            '사용자 정보를 불러오는데 실패했습니다.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (window.confirm(`"${user.name}" 사용자를 정말 삭제하시겠습니까?`)) {
      try {
        await userService.deleteUser(user.userIndex);
        navigate('/users');
      } catch (error: any) {
        if (error.response?.status === 403) {
          alert('본인의 계정만 삭제할 수 있습니다.');
        } else {
          alert(error.response?.data?.message || '삭제에 실패했습니다.');
        }
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          데이터를 불러오는 중...
        </Typography>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="sm">
          <Alert severity="error">
            {error || '사용자를 찾을 수 없습니다.'}
          </Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/users')}
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            목록으로
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              사용자 상세 정보
            </Typography>
            <Typography
              variant="h6"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              번호: {user.userIndex}
            </Typography>
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
                    <WcOutlined
                      sx={{
                        mr: 1,
                        color:
                          user.gender === '남성'
                            ? 'primary.main'
                            : 'secondary.main',
                      }}
                    />
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
                      생성일
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
                      수정일
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
            {isOwnAccount && (
              <>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/users/${id}/edit`)}
                  size="large"
                  sx={{ flex: 1, minWidth: 150 }}
                >
                  수정
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  size="large"
                  sx={{ flex: 1, minWidth: 150 }}
                >
                  삭제
                </Button>
              </>
            )}
            {!isOwnAccount && (
              <Alert severity="info" sx={{ flex: 1 }}>
                본인의 정보만 수정/삭제할 수 있습니다.
              </Alert>
            )}
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/users')}
              size="large"
              fullWidth
            >
              목록으로 돌아가기
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default UserDetail;
