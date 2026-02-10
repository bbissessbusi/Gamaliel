import React from 'react';

const Logo = ({ height = 28, opacity = 1, showLabel = true, onClick }) => (
  <div
    onClick={onClick}
    style={{
      height: `${height}px`,
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: onClick ? 'pointer' : 'default',
      minHeight: '44px',
    }}
  >
    <img
      src="/Applogo.png"
      alt="Gamaliel"
      style={{ height: `${height}px`, objectFit: 'contain' }}
    />
    {showLabel && (
      <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)' }}>
        GAMALIEL
      </span>
    )}
  </div>
);

export default Logo;
