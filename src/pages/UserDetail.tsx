import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import { userService } from '../services/api';
import { UserResponseDto } from '../types/User';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadUser(Number(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserById(userId);
      setUser(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다.');
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await userService.deleteUser(Number(id));
        navigate('/users');
      } catch (error: any) {
        alert(error.response?.data?.message || '삭제에 실패했습니다.');
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error || '사용자를 찾을 수 없습니다.'}</Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/users')}
          sx={{ mt: 2 }}
        >
          목록으로
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          사용자 상세 정보
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              ID
            </Typography>
            <Typography variant="h6">{user.id}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              이메일
            </Typography>
            <Typography variant="h6">{user.email}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              이름
            </Typography>
            <Typography variant="h6">{user.name}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              생성일
            </Typography>
            <Typography variant="body1">
              {user.createdAt ? new Date(user.createdAt).toLocaleString('ko-KR') : '-'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              수정일
            </Typography>
            <Typography variant="body1">
              {user.updatedAt ? new Date(user.updatedAt).toLocaleString('ko-KR') : '-'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/users/${id}/edit`)}
              fullWidth
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              fullWidth
            >
              삭제
            </Button>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/users')}
          >
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default UserDetail;
