import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, type GiftEvent } from '../../context/AppContext';
import { Gift, Mail, ArrowRight, Heart, Loader2 } from 'lucide-react';

export const InviteLanding: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { login, fetchInviteEvent } = useApp();
  const [event, setEvent] = useState<GiftEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      setError('');
      fetchInviteEvent(eventId)
        .then(res => setEvent(res))
        .catch(err => setError(err.message || '이벤트 초대장을 찾을 수 없습니다.'))
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const handleAccept = async () => {
    if (!event) return;
    // Auto login as Recipient for seamless mockup demo
    const success = await login('minsu@example.com', 'RECIPIENT', 'password');
    if (success) {
      navigate(`/events/${event.id}/select`);
    } else {
      setError('데모 계정(김민수) 로그인에 실패했습니다. 백엔드가 실행 중인지 확인하세요.');
    }
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', gap: '16px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary-color)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>초대장을 불러오고 있습니다...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-danger)', fontSize: '1.1rem', marginBottom: '16px' }}>{error || '이벤트 초대장을 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (declined) {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <div className="card" style={{ maxWidth: '440px', padding: '40px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>초대가 거절되었습니다.</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            보내주신 분께는 정중하게 알림이 갈 예정입니다. 따뜻한 마음에 감사드립니다.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ width: '100%' }}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, var(--primary-light) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, var(--secondary-light) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
            <Gift size={36} />
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--divider-color)', padding: '6px 12px', borderRadius: '30px' }}>
              <Mail size={14} /> 생일 선물 초대장이 도착했습니다!
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '12px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
              {event.recipientName}님을 위한 특별한 하루
            </h2>
          </div>

          <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '24px', textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              "{event.description}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Heart size={14} /> 보내는 사람: 한지민
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '0 16px' }}>
            선택 기간: <strong>{event.endDate}</strong> 까지 마음에 드는 상품을 하나 골라 주시면 구매자에게 바로 전달됩니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <button onClick={handleAccept} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              초대 수락하고 선물 고르기 <ArrowRight size={18} />
            </button>
            <button onClick={handleDecline} className="btn btn-secondary" style={{ width: '100%' }}>
              거절하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
