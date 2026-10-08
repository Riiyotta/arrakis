/* The original ships one button component with two variants (spec §3.7).
   Inner markup is always an empty hover-effect layer + the label span —
   the empty span is visually inert but kept for structural parity. */

const BASE =
  'group relative inline-flex cursor-pointer appearance-none items-center justify-center ' +
  'overflow-hidden rounded-xs px-3.5 py-[0.5625rem] text-center whitespace-nowrap ' +
  'transition-colors select-none border'

const VARIANTS = {
  dark: 'bg-midnight border-dusk text-white hover:bg-night',
  light: 'bg-dust border-dust text-night hover:bg-sand',
  /* header's scrolled state swaps the variant outright — not a hover state */
  scrolled: 'bg-white border-[rgb(229,223,219)] text-night',
  /* pageBuilder (industry) routes add two variants.
     `heroSolid` carries NO border, which is why it measures 36px tall
     rather than the usual 38px — the border is load-bearing on height. */
  heroSolid: 'bg-black text-day border-0',
  day: 'bg-day border-day text-night hover:bg-sand',
}

export default function Button({
  as = 'a',
  variant = 'dark',
  className = '',
  fullWidth = false,
  children,
  ...props
}) {
  const Tag = as
  return (
    <Tag
      className={`${BASE} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="absolute inset-0 z-1 overflow-hidden rounded-[inherit]" />
      <span className="text-nav-link relative z-10">{children}</span>
    </Tag>
  )
}
