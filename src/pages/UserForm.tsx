import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { userService } from '../services/api';
import { UserRequestDto } from '../types/User';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<UserRequestDto>({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadUser(Number(id));
    }
  }, [id, isEditMode]);

  const loadUser = async (userId: number) => {
    try {
      const response = await userService.getUserById(userId);
      setFormData({
        email: response.data.email,
        password: '',
        name: response.data.name,
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          '사용자 정보를 불러오는데 실패했습니다.'
      );
      console.error('Failed to load user:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        // 수정 시에는 name만 전송
        await userService.updateUser(Number(id), { name: formData.name });
      } else {
        // 생성 시에는 모든 필드 전송
        await userService.createUser(formData);
      }
      navigate('/users');
    } catch (error: any) {
      setError(error.response?.data?.message || '저장에 실패했습니다.');
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? '사용자 수정' : '사용자 추가'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEditMode}
            margin="normal"
            helperText={isEditMode ? '이메일은 수정할 수 없습니다' : ''}
          />
          {!isEditMode && (
            <TextField
              fullWidth
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              helperText="최소 6자 이상 입력하세요"
            />
          )}
          <TextField
            fullWidth
            label="이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? '처리중...' : isEditMode ? '수정' : '생성'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/users')}
              disabled={loading}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default UserForm;
