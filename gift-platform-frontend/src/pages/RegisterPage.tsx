import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, Key, Mail, User as UserIcon, ShieldAlert } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<'GIVER' | 'RECIPIENT'>('GIVER');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    setError('');
    const success = await register(username, email, role, password);
    if (success) {
      if (role === 'GIVER') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError('이미 가입된 이메일이거나 회원가입 요청이 실패했습니다.');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>회원가입</h2>
          <p style={{ color: 'var(--text-secondary)' }}>새로운 선물 플랫폼 계정을 만들어보세요</p>
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
            주는 사람 (Giver)
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
            받는 사람 (Recipient)
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">사용자 이름</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="username"
                type="text"
                placeholder="홍길동"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

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
                placeholder="6자 이상 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: '8px' }}>
            <UserPlus size={18} /> 회원가입
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};
