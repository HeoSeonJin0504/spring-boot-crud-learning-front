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
import { Save, Cancel } from '@mui/icons-material';
import { userService } from '../services/api';
import { type UserRequestDto } from '../types/User';

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
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

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

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // 이메일 검증
    if (!formData.email.trim()) {
      errors.email = '이메일은 필수입니다';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 검증 (생성 시에만)
    if (!isEditMode) {
      if (!formData.password.trim()) {
        errors.password = '비밀번호는 필수입니다';
      } else if (formData.password.length < 6) {
        errors.password = '비밀번호는 최소 6자 이상이어야 합니다';
      }
    }

    // 이름 검증
    if (!formData.name.trim()) {
      errors.name = '이름은 필수입니다';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // 입력 시 해당 필드의 에러 제거
    if (validationErrors[e.target.name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await userService.updateUser(Number(id), { name: formData.name });
      } else {
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {isEditMode ? '사용자 수정' : '새 사용자 추가'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEditMode
              ? '사용자 정보를 수정하세요'
              : '새로운 사용자 정보를 입력하세요'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="이메일 *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEditMode}
              margin="normal"
              error={Boolean(validationErrors.email)}
              helperText={
                validationErrors.email ||
                (isEditMode ? '이메일은 수정할 수 없습니다' : '예: user@example.com')
              }
            />
            {!isEditMode && (
              <TextField
                fullWidth
                label="비밀번호 *"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                error={Boolean(validationErrors.password)}
                helperText={
                  validationErrors.password || '최소 6자 이상 입력하세요'
                }
              />
            )}
            <TextField
              fullWidth
              label="이름 *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.name)}
              helperText={validationErrors.name || '사용자의 이름을 입력하세요'}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={<Save />}
                size="large"
              >
                {loading ? '처리중...' : isEditMode ? '수정 완료' : '등록하기'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/users')}
                disabled={loading}
                startIcon={<Cancel />}
                size="large"
              >
                취소
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default UserForm;
