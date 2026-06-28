import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [role, setRole] = useState<'GIVER' | 'RECIPIENT'>('GIVER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'RECIPIENT') {
      setRole('RECIPIENT');
    } else {
      setRole('GIVER');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    setError('');
    const success = await login(email, role, password || 'password');
    if (success) {
      if (role === 'GIVER') {
        navigate('/admin/dashboard');
      } else {
        // Find if we have an event we can redirect to, or just go to landing/invite page
        navigate('/admin/dashboard'); // default fallback
      }
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleDemoLogin = async (selectedRole: 'GIVER' | 'RECIPIENT') => {
    setError('');
    if (selectedRole === 'GIVER') {
      const success = await login('giver@example.com', 'GIVER', 'password');
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('데모 계정 로그인 실패. 백엔드가 구동 중이고 DB 초기화가 되었는지 확인하세요.');
      }
    } else {
      const success = await login('minsu@example.com', 'RECIPIENT', 'password');
      if (success) {
        // Let's redirect to general home or let recipient choose event (they usually enter via invite link)
        navigate('/');
      } else {
        setError('데모 계정 로그인 실패. 백엔드가 구동 중이고 DB 초기화가 되었는지 확인하세요.');
      }
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>로그인</h2>
          <p style={{ color: 'var(--text-secondary)' }}>이벤트를 만들거나 받은 초대장을 확인하세요</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', marginBottom: '20px', fontSize: '0.9rem' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Role Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--divider-color)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setRole('GIVER')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: role === 'GIVER' ? 'var(--card-bg)' : 'transparent',
              color: role === 'GIVER' ? 'var(--primary-color)' : 'var(--text-secondary)',
              boxShadow: role === 'GIVER' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            선물 주는 사람 (Giver)
          </button>
          <button
            type="button"
            onClick={() => setRole('RECIPIENT')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: role === 'RECIPIENT' ? 'var(--card-bg)' : 'transparent',
              color: role === 'RECIPIENT' ? 'var(--primary-color)' : 'var(--text-secondary)',
              boxShadow: role === 'RECIPIENT' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            선물 받는 사람 (Recipient)
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일 주소</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: '8px' }}>
            <LogIn size={18} /> 로그인
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          계정이 없으신가요?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
            회원가입하기
          </Link>
        </div>

        <div style={{ margin: '24px 0', borderTop: '1px solid var(--border-color)', position: 'relative', textAlign: 'center' }}>
          <span style={{ position: 'relative', top: '-10px', backgroundColor: 'var(--card-bg)', padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>또는</span>
        </div>

        {/* Demo Fast Logins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', textAlign: 'center' }}>데모용 계정 원클릭 로그인</h4>
          <button
            type="button"
            onClick={() => handleDemoLogin('GIVER')}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
          >
            관리자(Giver) 데모 로그인
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('RECIPIENT')}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}
          >
            수혜자(Recipient) 데모 로그인
          </button>
        </div>
      </div>
    </div>
  );
};
