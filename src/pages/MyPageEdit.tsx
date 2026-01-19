import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { authService } from '../services/authService';

function MyPageEdit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [userIndex, setUserIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    gender?: string;
    phone?: string;
    email?: string;
  }>({});

  useEffect(() => {
    loadMyInfo();
  }, []);

  const loadMyInfo = async () => {
    try {
      const response = await userService.getMyInfo();
      setFormData({
        name: response.data.name,
        gender: response.data.gender,
        phone: response.data.phone,
        email: response.data.email || '',
      });
      setUserIndex(response.data.userIndex);
      authService.saveUserIndex(response.data.userIndex);
    } catch (error: any) {
      setError('내 정보를 불러오는데 실패했습니다.');
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.name.trim()) {
      errors.name = '이름은 필수입니다';
    } else if (formData.name.length > 50) {
      errors.name = '이름은 50자를 초과할 수 없습니다';
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

    if (!validateForm() || !userIndex) {
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      await userService.updateUser(userIndex, formData);
      alert('정보가 수정되었습니다.');
      navigate('/mypage');
    } catch (error: any) {
      const status = error.response?.status;
      
      if (status === 400) {
        if (error.validationErrors) {
          setValidationErrors(error.validationErrors);
          setError('입력 정보를 확인해주세요.');
        } else {
          setError(error.friendlyMessage || '수정에 실패했습니다.');
        }
      } else if (status === 403) {
        setError('권한이 없습니다. 본인의 정보만 수정할 수 있습니다.');
        setTimeout(() => navigate('/mypage'), 2000);
      } else if (status === 404) {
        setError('사용자를 찾을 수 없습니다.');
      } else if (status === 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(error.response?.data?.message || '수정에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            내 정보 수정
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            변경할 정보를 입력하세요
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
              helperText={validationErrors.name}
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
              helperText={validationErrors.gender}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
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

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={<Save />}
                size="large"
              >
                {loading ? '저장 중...' : '저장'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/mypage')}
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

export default MyPageEdit;
