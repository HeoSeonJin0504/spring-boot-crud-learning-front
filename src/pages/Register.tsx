import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { authService } from '../services/authService';
import { type RegisterRequest } from '../types/Auth';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    userId: '',
    password: '',
    name: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    userId?: string;
    password?: string;
    name?: string;
    gender?: string;
    phone?: string;
    email?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // 아이디 검증
    if (!formData.userId.trim()) {
      errors.userId = '아이디는 필수입니다';
    } else if (formData.userId.length < 4 || formData.userId.length > 50) {
      errors.userId = '아이디는 4자 이상 50자 이하여야 합니다';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userId)) {
      errors.userId = '아이디는 영문, 숫자, 언더스코어(_)만 사용 가능합니다';
    }

    if (!formData.name.trim()) {
      errors.name = '이름은 필수입니다';
    } else if (formData.name.length > 50) {
      errors.name = '이름은 50자를 초과할 수 없습니다';
    }

    if (!formData.password.trim()) {
      errors.password = '비밀번호는 필수입니다';
    } else if (formData.password.length < 6 || formData.password.length > 100) {
      errors.password = '비밀번호는 6자 이상 100자 이하여야 합니다';
    }

    if (!formData.gender) {
      errors.gender = '성별은 필수입니다';
    }

    if (!formData.phone.trim()) {
      errors.phone = '전화번호는 필수입니다';
    } else if (!/^01[0-9]-\d{3,4}-\d{4}$/.test(formData.phone)) {
      errors.phone = '전화번호 형식이 올바르지 않습니다 (예: 010-1234-5678)';
    }

    if (formData.email && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다';
      } else if (formData.email.length > 100) {
        errors.email = '이메일은 100자를 초과할 수 없습니다';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      await authService.register(formData);
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || '회원가입에 실패했습니다.');
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PersonAdd sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              회원가입
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              새로운 계정을 만드세요
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="아이디 *"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.userId)}
              helperText={validationErrors.userId || '4-50자, 영문/숫자/언더스코어(_)만 사용'}
            />
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
            <TextField
              fullWidth
              label="비밀번호 *"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.password)}
              helperText={validationErrors.password || '6자 이상 입력하세요'}
            />
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
              InputLabelProps={{
                shrink: true,
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
              helperText={validationErrors.phone || '예: 010-1234-5678'}
              placeholder="010-1234-5678"
            />
            <TextField
              fullWidth
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={Boolean(validationErrors.email)}
              helperText={validationErrors.email || '선택사항'}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={<PersonAdd />}
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? '가입 중...' : '회원가입'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                이미 계정이 있으신가요?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ cursor: 'pointer' }}
                >
                  로그인
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
