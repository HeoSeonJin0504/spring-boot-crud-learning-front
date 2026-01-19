import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { userService } from '../services/api';
import { authService } from '../services/authService';
import { type UserResponseDto } from '../types/User';

function UserList() {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.'
      );
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userIndex: number, userId: string, name: string) => {
    // 본인 확인
    if (!authService.isOwnAccount(userId)) {
      alert('본인의 계정만 삭제할 수 있습니다.');
      return;
    }
    
    if (window.confirm(`"${name}" 사용자를 정말 삭제하시겠습니까?`)) {
      try {
        await userService.deleteUser(userIndex);
        loadUsers();
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
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          데이터를 불러오는 중...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              사용자 목록
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              총 <Chip label={users.length} size="small" color="primary" />명의
              사용자가 등록되어 있습니다
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadUsers}
            >
              새로고침
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/users/new')}
            >
              사용자 추가
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  번호
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  아이디
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  이름
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  성별
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  전화번호
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  이메일
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  생성일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  액션
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      등록된 사용자가 없습니다
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/users/new')}
                      sx={{ mt: 2 }}
                    >
                      첫 번째 사용자 추가하기
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.userIndex}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/users/${user.userIndex}`)}
                  >
                    <TableCell>
                      <Chip label={user.userIndex} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="500">{user.userId}</Typography>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.gender} 
                        size="small" 
                        color={user.gender === '남성' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString('ko-KR')
                        : '-'}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/users/${user.userIndex}`)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {authService.isOwnAccount(user.userId) && (
                        <>
                          <Tooltip title="수정">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/users/${user.userIndex}/edit`)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="삭제">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(user.userIndex, user.userId, user.name)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default UserList;
