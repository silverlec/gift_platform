import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, Shield, Clock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = (role: 'GIVER' | 'RECIPIENT') => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '64px', padding: '40px 0' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', margin: '0 auto', fontWeight: 600, fontSize: '0.9rem' }}>
          <Gift size={16} /> 특별한 날을 위한 새로운 선물 방식
        </div>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 800, lineHeight: 1.15 }}>
          받는 사람이 직접 고르는 <br />
          <span className="gradient-text">가장 완벽한 생일 선물</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          선물 선택의 실패 확률은 줄이고, 수혜자의 기쁨은 극대화하세요. 원하는 옵션 후보군을 등록하면, 주인공이 직접 마음에 드는 선물을 골라 가집니다.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
          <button onClick={() => handleStart('GIVER')} className="btn btn-lg btn-primary">
            선물 준비하기 (관리자)
          </button>
          <button onClick={() => handleStart('RECIPIENT')} className="btn btn-lg btn-secondary">
            초대 링크 확인 (수혜자)
          </button>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem' }}>왜 GiftPick 인가요?</h2>
        <div className="grid-cols-3">
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <Heart size={24} />
            </div>
            <h3>실패 없는 선물 선택</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              선물 관리자가 지정해둔 프리미엄 후보 중 수혜자가 좋아하는 품목을 고르므로 만족도가 100% 보장됩니다.
            </p>
          </div>
          
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-color)' }}>
              <Clock size={24} />
            </div>
            <h3>간편한 관리 & 시간 절약</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              후보군 생성, 카카오톡/문자 초대장 발송, 결과 실시간 확인 및 최종 결제 완료까지 한 화면에서 관리합니다.
            </p>
          </div>

          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
              <Shield size={24} />
            </div>
            <h3>합리적인 포인트 제공</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              가상의 포인트를 할당하여, 수혜자가 부여된 조건 범위 내에서 부담 없이 직접 선택하는 주도권을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Banner / Social Proof */}
      <section className="glass-panel" style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', gap: '24px' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>이미 많은 분들이 감동적인 선물을 보냈습니다!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>소중한 동료, 가족, 친구에게 최고의 선물을 제안해보세요.</p>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>12,400+</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>생성된 이벤트</span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', height: '40px' }} />
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '2rem', color: 'var(--secondary-color)' }}>99.2%</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>수혜자 만족 지수</span>
          </div>
        </div>
      </section>
    </div>
  );
};
