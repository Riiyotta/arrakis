/* Cookie notice — spec §5.1 (+ §2.6 radius, §2.7 "no shadow", §3.7 button).
   `shadow-layer` is referenced in the original markup but undefined in the shipped
   CSS, so box-shadow computes to `none` — deliberately no shadow here. */

import { useState } from 'react'
import Button from './Button'

const STORAGE_KEY = 'arrakis-cookie-notice-dismissed'

function readDismissed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export default function CookieNotice() {
  const [dismissed, setDismissed] = useState(readDismissed)

  if (dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* storage blocked (private mode / disabled) — dismiss for this session only */
    }
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="border-dusk bg-midnight text-day fixed right-4 bottom-4 left-4 z-50 rounded-md border p-5 sm:left-auto sm:max-w-sm"
    >
      <p className="text-mono-s mb-3 uppercase opacity-60">Cookies</p>
      {/* 14px / 22.75px (§2.4) */}
      <p className="mb-4 text-sm leading-relaxed">
        We use only strictly necessary cookies to make this site work. We don&apos;t use
        advertising or cross-site tracking cookies.{' '}
        <a className="underline underline-offset-2 hover:opacity-80" href="/cookie-policy">
          Read our Cookie Policy
        </a>
        .
      </p>
      <Button as="button" type="button" variant="light" aria-label="Dismiss cookie notice" onClick={dismiss}>
        Got it
      </Button>
    </div>
  )
}
