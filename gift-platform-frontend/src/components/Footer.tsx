import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="#terms" className="footer-link">이용약관</a>
        <a href="#privacy" className="footer-link">개인정보처리방침</a>
        <a href="#support" className="footer-link">고객센터</a>
      </div>
      <p>© 2026 GiftPick. All rights reserved. 소중한 사람을 위한 가장 완벽한 선물 선택 플랫폼</p>
    </footer>
  );
};
