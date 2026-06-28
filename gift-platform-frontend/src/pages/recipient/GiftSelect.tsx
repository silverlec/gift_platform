import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, type GiftEvent } from '../../context/AppContext';
import { Sparkles, Calendar, ShoppingBag, Heart, CheckCircle2, ChevronRight, Award, Loader2 } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const GiftSelect: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { fetchInviteEvent, selectGift } = useApp();

  const [event, setEvent] = useState<GiftEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      setError('');
      fetchInviteEvent(eventId)
        .then(res => {
          setEvent(res);
          // If already selected, redirect to completed page
          if (res.status === 'SELECTED' || res.status === 'COMPLETED') {
            navigate(`/events/${res.id}/selected`);
          }
        })
        .catch(err => setError(err.message || '이벤트를 불러올 수 없습니다.'))
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const handleSelectOption = (optId: string) => {
    setSelectedOptId(optId);
  };

  const handleConfirmClick = () => {
    if (selectedOptId) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleFinalConfirm = async () => {
    if (selectedOptId && eventId && event) {
      try {
        await selectGift(eventId, selectedOptId);
        setIsConfirmModalOpen(false);
        navigate(`/events/${event.id}/selected`);
      } catch (err) {
        alert(err instanceof Error ? err.message : '선물 선택에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', gap: '16px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary-color)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>선물 상자를 열고 있습니다...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-danger)', fontSize: '1.1rem', marginBottom: '16px' }}>{error || '이벤트를 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const activeOption = event.options.find(o => o.id === selectedOptId);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      {/* Event Top Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 95, 126, 0.03) 100%)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600 }}>
          <Sparkles size={16} /> 특별히 큐레이션된 선물 상자입니다!
        </div>
        <h2 style={{ fontSize: '1.8rem' }}>{event.name}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{event.description}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--divider-color)', paddingTop: '12px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>선택 가능 기간: {event.startDate} ~ <strong>{event.endDate}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={14} style={{ color: 'var(--primary-color)' }} />
            <span>보낸이: 한지민</span>
          </div>
        </div>
      </div>

      {/* Point Bar Indicator */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
            <Award size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem' }}>부여된 포인트</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>아래의 후보 중에서 하나의 선물을 선택하실 수 있습니다.</p>
          </div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'var(--font-heading)' }}>
          100 / 100 Points
        </div>
      </div>

      {/* Gift Options Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} /> 선물 리스트에서 하나를 선택하세요
        </h3>

        {event.options.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            선물 옵션이 등록되지 않았습니다. 관리자에게 문의하세요.
          </div>
        ) : (
          <div className="grid-cols-3">
            {event.options.map((option) => {
              const isSelected = option.id === selectedOptId;
              return (
                <div
                  key={option.id}
                  className="card card-hover"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    boxShadow: isSelected ? 'var(--shadow-premium)' : 'var(--shadow-sm)',
                    transform: isSelected ? 'scale(1.02)' : 'none',
                    transition: 'all var(--transition-normal)'
                  }}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    />
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{option.name}</h4>
                      <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
                        {option.points}P
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>{option.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Action Bar when an option is selected */}
      {selectedOptId && activeOption && (
        <div className="glass-panel fade-in" style={{ position: 'sticky', bottom: '24px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', zIndex: 10, boxShadow: '0 10px 30px rgba(255, 95, 126, 0.15)', border: '1px solid rgba(255, 95, 126, 0.2)' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>선택한 선물</span>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>{activeOption.name}</h4>
          </div>
          <button onClick={handleConfirmClick} className="btn btn-primary btn-lg">
            선물 선택 완료하기 <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="선물 선택 최종 확인"
        actions={
          <>
            <button onClick={() => setIsConfirmModalOpen(false)} className="btn btn-secondary">다시 생각할래요</button>
            <button onClick={handleFinalConfirm} className="btn btn-primary">네, 이 선물로 결정할게요</button>
          </>
        }
      >
        <p style={{ marginBottom: '16px' }}>선물 선택을 완료하시겠습니까?</p>
        <strong style={{ fontSize: '1.15rem', color: 'var(--primary-color)' }}>{activeOption?.name}</strong>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>선택 완료 후에는 결제를 진행하는 선물 관리자에게 즉시 결과가 전달되며, 다시 변경하실 수 없습니다.</p>
      </Modal>
    </div>
  );
};
