import { theme } from '../data/invitation'

export function SectionTitle({ children, className = '' }) {
  return (
    <h2
      className={`text-center text-[20px] font-bold tracking-[0.04em] uppercase md:text-[26px] ${className}`}
      style={{ color: theme.primary, fontFamily: 'var(--f-title)' }}
    >
      {children}
    </h2>
  )
}
