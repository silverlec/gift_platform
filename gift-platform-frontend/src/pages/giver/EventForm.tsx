import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export const EventForm: React.FC = () => {
  const { createEvent, updateEvent, events } = useApp();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEdit = !!eventId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setName(event.name);
        setDescription(event.description);
        setRecipientName(event.recipientName);
        setStartDate(event.startDate);
        setEndDate(event.endDate);
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      // Default dates for new event (start: today, end: today + 14 days)
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + 14);

      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(future.toISOString().split('T')[0]);
    }
  }, [eventId, isEdit, events, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !recipientName || !startDate || !endDate) {
      setError('모든 필드를 입력해 주세요.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    try {
      if (isEdit && eventId) {
        await updateEvent(eventId, { name, description, recipientName, startDate, endDate });
        navigate(`/admin/events/${eventId}`);
      } else {
        const newId = await createEvent({
          name,
          description,
          recipientName,
          startDate,
          endDate,
          recipientId: ''
        });
        // Go directly to detail page to let them add gift options
        navigate(`/admin/events/${newId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '이벤트 저장에 실패했습니다.');
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </button>
        <h2 style={{ fontSize: '1.8rem' }}>{isEdit ? '이벤트 정보 수정' : '새 선물 이벤트 만들기'}</h2>
      </div>

      <div className="card">
        {error && (
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="eventName">이벤트 제목</label>
            <input
              id="eventName"
              type="text"
              className="form-control"
              placeholder="예) 철수의 30번째 생일 축하 선물!"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">설명 및 메시지</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="수혜자에게 보낼 감동적인 메시지나 선물에 대한 안내 사항을 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '120px', resize: 'vertical' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recipientName">선물 주인공 (수혜자 이름)</label>
            <input
              id="recipientName"
              type="text"
              className="form-control"
              placeholder="예) 김철수"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">이벤트 시작일</label>
              <input
                id="startDate"
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="endDate">이벤트 종료일 (선택 기한)</label>
              <input
                id="endDate"
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> {isEdit ? '수정 완료' : '이벤트 생성하고 선물 후보 등록'}
            </button>
          </div>
        </form>
      </div>

      {!isEdit && (
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'left' }}>
          <div style={{ color: 'var(--primary-color)' }}>
            <Sparkles size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>다음 단계 안내:</strong> 이벤트를 생성한 후, 받는 사람이 선택할 수 있는 2개 이상의 선물 옵션(브랜드 상품, 이미지, 가격 등)을 추가할 수 있습니다.
          </div>
        </div>
      )}
    </div>
  );
};
