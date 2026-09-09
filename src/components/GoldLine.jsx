import { decor } from '../data/invitation'

/** The gold filigree rule used to close a section. */
export function GoldLine({ className = '', widthClassName = 'w-[53.7%]' }) {
  return (
    <img
      src={decor.goldLine}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`mx-auto block h-auto max-w-[300px] object-contain ${widthClassName} ${className}`}
    />
  )
}
