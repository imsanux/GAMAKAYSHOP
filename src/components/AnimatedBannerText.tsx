export default function AnimatedBannerText() {
  return (
    <h2 style={{ 
      fontSize: 'clamp(1.2rem, 4.5vw, 4rem)', 
      fontWeight: 900, 
      color: 'var(--text-primary)',
      textTransform: 'uppercase',
      letterSpacing: '-0.04em',
      lineHeight: 1.15,
      margin: 0,
      whiteSpace: 'nowrap',
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <span style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FACC15', 
        color: '#111111', 
        padding: '0 16px', 
        borderRadius: '0px',
        whiteSpace: 'nowrap'
      }}>
        EVERYTHING
      </span>
      <span>YOU NEED AND MORE</span>
    </h2>
  );
}
