import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, type GiftEvent } from '../../context/AppContext';
import { CheckCircle, Home, Loader2 } from 'lucide-react';

export const GiftSelected: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { fetchInviteEvent } = useApp();

  const [event, setEvent] = useState<GiftEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      setError('');
      fetchInviteEvent(eventId)
        .then(res => setEvent(res))
        .catch(err => setError(err.message || '이벤트를 불러올 수 없습니다.'))
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', gap: '16px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary-color)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>이벤트 결과를 확인하고 있습니다...</p>
      </div>
    );
  }

  if (error || !event || !event.selection) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-danger)', fontSize: '1.1rem', marginBottom: '16px' }}>{error || '이벤트 또는 선택 완료 정보를 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const selectedOption = event.options.find(
    o => o.id === event.selection?.selectedOptionId
  );

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '50%', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', marginBottom: '24px' }}>
          <CheckCircle size={40} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>선물 선택 완료!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          선택하신 선물이 한지민님에게 성공적으로 전달되었습니다.
        </p>

        {selectedOption && (
          <div className="card" style={{ padding: '0', overflow: 'hidden', textAlign: 'left', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
            <img
              src={selectedOption.imageUrl}
              alt={selectedOption.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem' }}>{selectedOption.name}</h4>
                <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
                  선택 완료
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedOption.description}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>선택일: {event.selection.selectionDate}</span>
                <span>ID: {event.selection.id.substring(0, 10)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ backgroundColor: 'var(--divider-color)', border: 'none', padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
          <p>
            선물 관리자가 수혜자님의 최종 결정을 확인하고, 실제 커머스몰(쿠팡, 네이버 쇼핑 등)을 통해 직접 구매하여 발송할 예정입니다. 기쁜 생일날을 만끽하며 편안히 기다려 주세요!
          </p>
        </div>

        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ width: '100%' }}>
          <Home size={16} /> 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};
