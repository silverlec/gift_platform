import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Gift, LogOut, LayoutDashboard, PlusCircle, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <Gift size={28} style={{ color: 'var(--primary-color)' }} />
          <span>GiftPick</span>
        </Link>

        <nav className="nav-menu">
          {currentUser ? (
            <>
              {currentUser.role === 'GIVER' ? (
                <>
                  <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard')}`}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <LayoutDashboard size={16} /> 대시보드
                    </span>
                  </Link>
                  <Link to="/admin/events/new" className={`nav-link ${isActive('/admin/events/new')}`}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <PlusCircle size={16} /> 새 이벤트 생성
                    </span>
                  </Link>
                </>
              ) : (
                <span className="profile-tag" style={{ color: 'var(--secondary-color)', backgroundColor: 'var(--secondary-light)' }}>
                  선물 수혜자 모드
                </span>
              )}
              
              <div className="user-profile-menu" style={{ marginLeft: '12px' }}>
                <span className="profile-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <UserIcon size={14} />
                  <strong>{currentUser.username}</strong>님
                </span>
                <button onClick={handleLogout} className="btn btn-sm btn-secondary" title="로그아웃">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              시작하기
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
