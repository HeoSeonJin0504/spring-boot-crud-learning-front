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
    name: '',
    password: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    password?: string;
    gender?: string;
    phone?: string;
    email?: string;
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
        name: response.data.name,
        password: '',
        gender: response.data.gender,
        phone: response.data.phone,
        email: response.data.email,
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

    // 이름 검증
    if (!formData.name.trim()) {
      errors.name = '이름은 필수입니다';
    } else if (formData.name.length > 50) {
      errors.name = '이름은 50자를 초과할 수 없습니다';
    }

    // 비밀번호 검증 (생성 시에만)
    if (!isEditMode) {
      if (!formData.password.trim()) {
        errors.password = '비밀번호는 필수입니다';
      } else if (formData.password.length < 6 || formData.password.length > 100) {
        errors.password = '비밀번호는 6자 이상 100자 이하여야 합니다';
      }
    }

    // 성별 검증
    if (!formData.gender) {
      errors.gender = '성별은 필수입니다';
    } else if (formData.gender !== '남성' && formData.gender !== '여성') {
      errors.gender = "성별은 '남성' 또는 '여성'이어야 합니다";
    }

    // 전화번호 검증
    if (!formData.phone.trim()) {
      errors.phone = '전화번호는 필수입니다';
    } else if (!/^01[0-9]-\d{3,4}-\d{4}$/.test(formData.phone)) {
      errors.phone = '전화번호 형식이 올바르지 않습니다 (예: 010-1234-5678)';
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      errors.email = '이메일은 필수입니다';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다';
    } else if (formData.email.length > 100) {
      errors.email = '이메일은 100자를 초과할 수 없습니다';
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
        await userService.updateUser(Number(id), {
          name: formData.name,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
        });
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
              label="이름 *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.name)}
              helperText={validationErrors.name || '사용자의 이름을 입력하세요 (최대 50자)'}
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
                  validationErrors.password || '6자 이상 100자 이하로 입력하세요'
                }
              />
            )}
            <TextField
              fullWidth
              select
              label="성별 *"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.gender)}
              helperText={validationErrors.gender || '성별을 선택하세요'}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">선택하세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </TextField>
            <TextField
              fullWidth
              label="전화번호 *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.phone)}
              helperText={
                validationErrors.phone || '예: 010-1234-5678'
              }
              placeholder="010-1234-5678"
            />
            <TextField
              fullWidth
              label="이메일 *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.email)}
              helperText={
                validationErrors.email || '예: user@example.com (최대 100자)'
              }
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
