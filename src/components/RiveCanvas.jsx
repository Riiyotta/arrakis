/* Shared Rive wrapper (spec §0 "Rive limitation").
   The original renders four `.riv` files to WebGL canvases with
   `@rive-app/webgl2@2.40.0`. This is a thin React wrapper over the raw runtime:
   one `Rive` instance per mount, destroyed on unmount, with the drawing surface
   resized to the measured box via ResizeObserver.

   The wasm binary is resolved out of the installed package (Vite `?url`) instead
   of the unpkg URL the original uses, so the clone has no third-party runtime
   request. The runtime's own jsdelivr fallback stays in place. */

import { useEffect, useRef, useState } from 'react'
import { Rive, Layout, Fit, Alignment, RuntimeLoader } from '@rive-app/webgl2'
import riveWasmUrl from '@rive-app/webgl2/rive.wasm?url'

let wasmConfigured = false
function configureWasm() {
  if (wasmConfigured) return
  wasmConfigured = true
  try {
    RuntimeLoader.setWasmUrl(riveWasmUrl)
  } catch {
    /* fall back to the runtime's default (CDN) resolution */
  }
}

/**
 * @param {object}  props
 * @param {string}  props.src            URL of the `.riv` file (e.g. `/assets/rive/<hash>.riv`)
 * @param {string}  [props.className]    classes for the wrapper box
 * @param {string}  [props.aspectRatio]  CSS aspect-ratio for the wrapper, e.g. `"1164 / 663"`
 * @param {string}  [props.fallbackImage] shown instead of the canvas if the runtime/file fails
 * @param {string}  [props.fallbackAlt]  alt text for the fallback image
 * @param {string}  [props.fit]          Rive `Fit` (default `Fit.Contain`)
 * @param {string}  [props.alignment]    Rive `Alignment` (default `Alignment.Center`)
 * @param {boolean} [props.autoplay]     default `true`
 * @param {string}  [props.ariaLabel]    when omitted the canvas is `aria-hidden`
 * @param {Function}[props.onReady]      called once the artboard is loaded and sized
 */
export function RiveCanvas({
  src,
  className = '',
  aspectRatio,
  fallbackImage,
  fallbackAlt = '',
  fit = Fit.Contain,
  alignment = Alignment.Center,
  autoplay = true,
  ariaLabel,
  onReady,
}) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  /* Held in a ref so a caller passing an inline closure cannot force the Rive
     instance to be torn down and rebuilt, while still always calling the
     latest callback. `onReady` is deliberately absent from the effect deps. */
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !src) return

    configureWasm()

    let disposed = false
    let instance = null
    let observer = null

    try {
      instance = new Rive({
        src,
        canvas,
        autoplay,
        layout: new Layout({ fit, alignment }),
        onLoad: () => {
          if (disposed) return
          instance.resizeDrawingSurfaceToCanvas()
          /* Fires only once the artboard is loaded and sized, so callers can
             fade the canvas in rather than flashing an empty box. */
          if (typeof onReadyRef.current === 'function') onReadyRef.current()
        },
        onLoadError: () => {
          if (!disposed) setFailed(true)
        },
      })
    } catch {
      setFailed(true)
      return
    }

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        if (disposed) return
        try {
          instance.resizeDrawingSurfaceToCanvas()
        } catch {
          /* instance not loaded yet — onLoad will size it */
        }
      })
      observer.observe(canvas)
    }

    return () => {
      disposed = true
      if (observer) observer.disconnect()
      try {
        instance.cleanup()
      } catch {
        /* already torn down */
      }
    }
  }, [src, autoplay, fit, alignment])

  const style = aspectRatio ? { aspectRatio } : undefined

  return (
    <div className={`relative ${className}`} style={style}>
      {failed && fallbackImage ? (
        <img
          src={fallbackImage}
          alt={fallbackAlt}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          {...(ariaLabel ? { 'aria-label': ariaLabel, role: 'img' } : { 'aria-hidden': 'true' })}
        />
      )}
    </div>
  )
}

export default RiveCanvas
