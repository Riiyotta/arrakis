/* Wrapper for the site's signature hairline bracket primitive (spec §3.6).
   The bracket CSS itself lives in index.css; colour comes from `currentColor`,
   so callers set `text-stroke-3` on dark backgrounds and `text-stroke-1` on light. */

export function SquareBracket({
  children,
  className = '',
  color = 'text-stroke-1',
  linesLg = false,
  forceLg = false,
  hideTop = false,
  /* The original omits the bottom line element entirely on some instances (e.g. the
     last item of the pinned feature grid, where the grid's own frame draws that rule).
     It must be absent, not just transparent: its 16px box is part of the measured height. */
  hideBottom = false,
  as: Tag = 'div',
}) {
  const mods = [
    linesLg && 'square-bracket--lines-lg',
    forceLg && 'square-bracket--lines-force-lg',
    hideTop && 'square-bracket--hide-line-t',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={`relative flex flex-col justify-between ${mods} ${className}`}>
      <div className={`square-bracket-border-t ${color}`} />
      {children}
      {!hideBottom && <div className={`square-bracket-border-b ${color}`} />}
    </Tag>
  )
}

/* Four 12×12 corner brackets with a single 1px L-shaped border each —
   used around the hero video frame and the pinned Rive frame. */
export function CornerBrackets({ color = 'text-stroke-3', inset = '-0.68px' }) {
  const common = 'pointer-events-none absolute h-3 w-3'
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${color}`} aria-hidden="true">
      <div className={`${common} border-t border-l`} style={{ top: inset, left: 0 }} />
      <div className={`${common} border-t border-r`} style={{ top: inset, right: 0 }} />
      <div className={`${common} border-b border-l`} style={{ bottom: inset, left: 0 }} />
      <div className={`${common} border-b border-r`} style={{ bottom: inset, right: 0 }} />
    </div>
  )
}

export default SquareBracket
