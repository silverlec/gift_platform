import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, type GiftEvent } from '../../context/AppContext';
import { Plus, Calendar, User, ShoppingBag, Eye, Trash2, Gift, ClipboardCheck } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const Dashboard: React.FC = () => {
  const { events, deleteEvent } = useApp();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Stats calculation
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'SENT').length;
  const selectedEvents = events.filter(e => e.status === 'SELECTED').length;
  const completedEvents = events.filter(e => e.status === 'COMPLETED').length;

  const getStatusBadge = (status: GiftEvent['status']) => {
    switch (status) {
      case 'CREATED':
        return <span className="badge badge-created">옵션 추가 대기</span>;
      case 'SENT':
        return <span className="badge badge-sent">선물 선택 대기</span>;
      case 'SELECTED':
        return <span className="badge badge-selected">선택 완료</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">구매 완료</span>;
      default:
        return null;
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEventId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEventId) {
      try {
        await deleteEvent(selectedEventId);
        setIsDeleteModalOpen(false);
        setSelectedEventId(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : '이벤트 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>선물 관리 대시보드</h2>
          <p style={{ color: 'var(--text-secondary)' }}>소중한 사람들을 위한 선물 이벤트를 관리하세요.</p>
        </div>
        <button onClick={() => navigate('/admin/events/new')} className="btn btn-primary">
          <Plus size={18} /> 새 이벤트 생성
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>총 이벤트</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalEvents}개</span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--secondary-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>선택 대기 중</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary-color)' }}>{activeEvents}개</span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--accent-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>수혜자 선택 완료</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-color)' }}>{selectedEvents}개</span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--color-success)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>구매 완료</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>{completedEvents}개</span>
        </div>
      </div>

      {/* Events List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.4rem' }}>내 선물 이벤트</h3>
        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
            <Gift size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
            <p>아직 생성된 선물 이벤트가 없습니다.</p>
            <button onClick={() => navigate('/admin/events/new')} className="btn btn-primary" style={{ marginTop: '16px' }}>
              첫 이벤트 만들기
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((event) => {
              const selectedOption = event.selection
                ? event.options.find(o => o.id === event.selection?.selectedOptionId)
                : null;

              return (
                <div 
                  key={event.id} 
                  className="card card-hover" 
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/events/${event.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{event.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{event.description}</p>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--divider-color)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      <span>수혜자: <strong>{event.recipientName}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>기간: {event.startDate} ~ {event.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShoppingBag size={14} />
                      <span>선물 옵션 수: {event.options.length}개</span>
                    </div>
                  </div>

                  {/* Choosen Gift display */}
                  {selectedOption && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', border: '1px solid rgba(245, 158, 11, 0.2)', textAlign: 'left' }}>
                      <ClipboardCheck size={20} style={{ color: 'var(--accent-color)' }} />
                      <div style={{ fontSize: '0.9rem' }}>
                        수혜자의 선택 선물: <strong>{selectedOption.name}</strong> 
                        <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({event.selection?.selectionDate})</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--divider-color)', paddingTop: '12px' }}>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/events/${event.id}`); }} className="btn btn-sm btn-secondary">
                      <Eye size={14} /> 상세 보기
                    </button>
                    <button onClick={(e) => handleDeleteClick(event.id, e)} className="btn btn-sm btn-danger">
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="이벤트 삭제 확인"
        actions={
          <>
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">취소</button>
            <button onClick={confirmDelete} className="btn btn-danger" style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}>삭제</button>
          </>
        }
      >
        <p>이 이벤트를 정말 삭제하시겠습니까? 삭제 후에는 복구할 수 없으며 관련된 선물 옵션 및 선택 내역도 함께 영구 삭제됩니다.</p>
      </Modal>
    </div>
  );
};
