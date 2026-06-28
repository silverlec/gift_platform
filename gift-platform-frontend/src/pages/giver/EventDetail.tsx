import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Copy, Check, Trash2, Plus, Calendar, User, ShoppingBag, Link as LinkIcon, CheckCircle2, Info } from 'lucide-react';
import { Modal } from '../../components/Modal';

// Preset options for quick adding in mockup
const PRESET_OPTIONS = [
  {
    name: '드롱기 가정용 에스프레소 머신',
    description: '홈카페를 즐길 수 있는 이탈리아 감성의 프리미엄 커피 머신',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    points: 100
  },
  {
    name: '조말론 우드세이지 앤 씨솔트 코롱 100ml',
    description: '바람 부는 해안을 걷는 듯한 산뜻하고 세련된 시그니처 향수',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60',
    points: 100
  },
  {
    name: '몽블랑 사토리얼 가죽 카드 홀더',
    description: '고급스러움과 실용성을 겸비한 몽블랑 대표 가죽 지갑',
    imageUrl: 'https://images.unsplash.com/photo-1627124118123-e4d3db139603?w=500&auto=format&fit=crop&q=60',
    points: 100
  },
  {
    name: '애플 에어팟 4세대 ANC',
    description: '더욱 진화된 사운드와 강력한 ANC 기능의 최신형 에어팟',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    points: 100
  },
  {
    name: '이솝 레저렉션 아로마틱 핸드 밤 75ml',
    description: '거친 손을 부드럽게 가꿔주는 감각적인 아로마 시트러스 핸드 크림',
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60',
    points: 100
  }
];

export const EventDetail: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, addGiftOption, deleteGiftOption, completePurchase } = useApp();

  const [copied, setCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [optName, setOptName] = useState('');
  const [optDesc, setOptDesc] = useState('');
  const [optImage, setOptImage] = useState('');
  const [optPoints, setOptPoints] = useState(100);

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>이벤트를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  const inviteUrl = `${window.location.origin}/invite/${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddOptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optName || !optDesc) return;

    try {
      await addGiftOption(event.id, {
        name: optName,
        description: optDesc,
        imageUrl: optImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60', // Fallback default gift image
        points: optPoints
      });

      // Reset and close
      setOptName('');
      setOptDesc('');
      setOptImage('');
      setOptPoints(100);
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '선물 옵션 추가에 실패했습니다.');
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (window.confirm('이 선물 옵션을 정말 제거하시겠습니까?')) {
      try {
        await deleteGiftOption(event.id, optionId);
      } catch (err) {
        alert(err instanceof Error ? err.message : '선물 옵션 삭제에 실패했습니다.');
      }
    }
  };

  const handleCompletePurchase = async () => {
    try {
      await completePurchase(event.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '구매 완료 처리에 실패했습니다.');
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_OPTIONS[0]) => {
    setOptName(preset.name);
    setOptDesc(preset.description);
    setOptImage(preset.imageUrl);
    setOptPoints(preset.points);
  };

  const selectedOption = event.selection
    ? event.options.find(o => o.id === event.selection?.selectedOptionId)
    : null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ fontSize: '1.8rem' }}>선물 이벤트 상세</h2>
        </div>
        <button onClick={() => navigate(`/admin/events/${event.id}/edit`)} className="btn btn-secondary">
          이벤트 정보 수정
        </button>
      </div>

      {/* Event Info Card */}
      <div className="grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '1.4rem' }}>{event.name}</h3>
            <span className={`badge badge-${event.status.toLowerCase()}`}>
              {event.status === 'CREATED' && '생성됨'}
              {event.status === 'SENT' && '진행중 (선택 대기)'}
              {event.status === 'SELECTED' && '선택 완료'}
              {event.status === 'COMPLETED' && '구매 및 전달 완료'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>{event.description}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--divider-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} />
              <span>수혜자: <strong>{event.recipientName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} />
              <span>기한: {event.startDate} ~ {event.endDate}</span>
            </div>
          </div>
        </div>

        {/* Invite Link copy */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', textAlign: 'left' }}>
          <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
            <LinkIcon size={16} /> 초대 링크 복사
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            수혜자(주인공)에게 링크를 발송하여 선물을 고를 수 있게 하세요.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              readOnly 
              value={inviteUrl} 
              className="form-control" 
              style={{ fontSize: '0.8rem', textOverflow: 'ellipsis' }} 
            />
            <button onClick={handleCopyLink} className="btn btn-primary" style={{ padding: '10px' }} title="링크 복사">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          {copied && <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>복사되었습니다! 카카오톡 등으로 공유해보세요.</span>}
        </div>
      </div>

      {/* Recipient Selection Status */}
      <section className="card" style={{ textAlign: 'left', border: '1px solid var(--primary-light)' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--primary-color)' }} /> 수혜자 선물 선택 현황
        </h3>

        {event.status === 'COMPLETED' && selectedOption ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <CheckCircle2 size={24} />
              <div>
                <strong>구매가 완료되었습니다!</strong> 수혜자에게 선물이 안전하게 전달될 예정입니다.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <img src={selectedOption.imageUrl} alt={selectedOption.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>{selectedOption.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedOption.description}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>선택 일시: {event.selection?.selectionDate}</span>
              </div>
            </div>
          </div>
        ) : event.status === 'SELECTED' && selectedOption ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--accent-color)' }}>
              주인공 <strong>{event.recipientName}</strong>님이 선물을 최종 선택하였습니다! 선택 상품을 확인하고 배송/구매를 완료해 주세요.
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={selectedOption.imageUrl} alt={selectedOption.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div>
                  <h4 style={{ fontSize: '1.15rem' }}>{selectedOption.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedOption.description}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>선택 일시: {event.selection?.selectionDate}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCompletePurchase} 
                className="btn btn-primary btn-lg"
                style={{ background: 'linear-gradient(135deg, var(--color-success) 0%, #34d399 100%)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
              >
                실제 구매 및 선물 전달 완료
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--divider-color)', color: 'var(--text-secondary)' }}>
            <Info size={20} />
            <div>주인공이 아직 초대장을 열어보지 않았거나 선물을 선택 중입니다. 수혜자가 선택을 완료하면 알림 및 선물 정보가 여기에 표시됩니다.</div>
          </div>
        )}
      </section>

      {/* Gift Options Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} /> 선물 옵션 후보 목록 ({event.options.length})
          </h3>
          {event.status === 'CREATED' || event.status === 'SENT' ? (
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-sm btn-primary">
              <Plus size={16} /> 선물 옵션 추가
            </button>
          ) : null}
        </div>

        {event.options.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>아직 등록된 선물 옵션이 없습니다.</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>초대장을 발송하기 위해 최소 1개 이상의 선물 후보를 등록해 주세요.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-sm btn-primary" style={{ marginTop: '16px' }}>
              선물 등록하기
            </button>
          </div>
        ) : (
          <div className="grid-cols-3">
            {event.options.map((option) => (
              <div key={option.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={option.imageUrl} 
                  alt={option.name} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{option.name}</h4>
                    <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontSize: '0.7rem' }}>
                      {option.points}P
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>{option.description}</p>
                  
                  {(event.status === 'CREATED' || event.status === 'SENT') && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--divider-color)', paddingTop: '12px', marginTop: '8px' }}>
                      <button onClick={() => handleDeleteOption(option.id)} className="btn btn-sm btn-danger" style={{ padding: '6px 10px' }} title="삭제">
                        <Trash2 size={14} /> 제거
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Gift Option Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="선물 옵션 추가"
      >
        <form onSubmit={handleAddOptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {/* Preset Buttons */}
          <div style={{ marginBottom: '8px' }}>
            <span className="form-label" style={{ display: 'block', marginBottom: '8px' }}>추천 선물 카테고리 프리셋</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESET_OPTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  {preset.name.split(' ')[0]}..
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="optName">상품명</label>
            <input
              id="optName"
              type="text"
              className="form-control"
              placeholder="예) 조말론 향수 100ml"
              value={optName}
              onChange={(e) => setOptName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="optDesc">상품 설명</label>
            <textarea
              id="optDesc"
              className="form-control"
              placeholder="받는 사람이 매력을 느낄 수 있도록 간단한 설명이나 매력 포인트를 설명해주세요."
              value={optDesc}
              onChange={(e) => setOptDesc(e.target.value)}
              style={{ minHeight: '60px', resize: 'vertical' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="optImage">상품 이미지 URL</label>
            <input
              id="optImage"
              type="text"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={optImage}
              onChange={(e) => setOptImage(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>* 미입력 시 선물상자 기본 이미지가 사용됩니다.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="optPoints">가상 포인트 가치</label>
            <input
              id="optPoints"
              type="number"
              className="form-control"
              value={optPoints}
              onChange={(e) => setOptPoints(parseInt(e.target.value) || 100)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              추가하기
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
