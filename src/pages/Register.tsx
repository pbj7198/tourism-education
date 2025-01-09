import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: any;
  }
}

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    const isValidLength = numbers.length === 10 || numbers.length === 11;
    const startsWithValidPrefix = numbers.startsWith('01');
    return isValidLength && startsWithValidPrefix;
  };

  const setupInvisibleRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      const container = document.getElementById('invisible-recaptcha');
      if (container) {
        container.innerHTML = '';
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'invisible-recaptcha', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        },
      });

      return window.recaptchaVerifier;
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      throw error;
    }
  };

  const handleSendVerification = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)');
      return;
    }

    try {
      setIsSendingCode(true);
      setError('');

      const verifier = setupInvisibleRecaptcha();

      // 한국 전화번호 형식으로 변환 (+82)
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      const formattedPhoneNumber = cleanPhoneNumber.startsWith('0') 
        ? `+82${cleanPhoneNumber.slice(1)}` 
        : `+82${cleanPhoneNumber}`;

      console.log('Sending verification to:', formattedPhoneNumber);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        verifier
      );
      
      window.confirmationResult = confirmationResult;
      setIsVerificationSent(true);
      setError('');
    } catch (error: any) {
      console.error('Phone verification error:', error);
      let errorMessage = '인증번호 발송에 실패했습니다.';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = '올바르지 않은 전화번호 형식입니다. 다시 확인해주세요.';
          break;
        case 'auth/too-many-requests':
          errorMessage = '너무 많은 인증 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 'auth/quota-exceeded':
          errorMessage = '일일 SMS 할당량을 초과했습니다. 나중에 다시 시도해주세요.';
          break;
        default:
          errorMessage = '인증번호 발송에 실패했습니다. 다시 시도해주세요.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    try {
      if (!window.confirmationResult) {
        setError('인증 세션이 만료되었습니다. 다시 시도해주세요.');
        return;
      }

      const result = await window.confirmationResult.confirm(verificationCode);
      if (result.user) {
        setIsVerified(true);
        setError('');
      }
    } catch (error: any) {
      console.error('Code verification error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('잘못된 인증번호입니다.');
      } else if (error.code === 'auth/code-expired') {
        setError('인증번호가 만료되었습니다. 다시 시도해주세요.');
      } else {
        setError('인증에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 입력값 검증
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('올바른 핸드폰 번호 형식이 아닙니다.');
      return;
    }

    if (!isVerified) {
      setError('핸드폰 인증을 완료해주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ email, password, name, phoneNumber });
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            회원가입
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoComplete="name"
            />
            <TextField
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoComplete="email"
              error={email !== '' && !validateEmail(email)}
              helperText={email !== '' && !validateEmail(email) ? "올바른 이메일 형식을 입력해주세요" : ""}
            />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="핸드폰 번호"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                margin="normal"
                required
                placeholder="01012345678"
                disabled={isVerified}
                helperText={isVerified ? "인증완료" : "'-' 없이 숫자만 입력해주세요"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={handleSendVerification}
                        disabled={isVerified || !phoneNumber || isSendingCode}
                        size="small"
                      >
                        {isSendingCode ? (
                          <CircularProgress size={20} />
                        ) : (
                          isVerificationSent ? '재전송' : '인증하기'
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Invisible reCAPTCHA container */}
            <div id="invisible-recaptcha"></div>

            {isVerificationSent && !isVerified && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="인증번호"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  placeholder="인증번호 6자리 입력"
                />
                <Button
                  onClick={handleVerifyCode}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  확인
                </Button>
              </Box>
            )}
            <TextField
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoComplete="new-password"
            />
            <TextField
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoComplete="new-password"
            />
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting || !isVerified}
                size="large"
              >
                {isSubmitting ? '처리 중...' : '회원가입'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{ textDecoration: 'underline' }}
            >
              이미 계정이 있으신가요? 로그인
            </Button>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default Register; 