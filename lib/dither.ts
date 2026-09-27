// 4x4 ordered-dither matrix shared by every pixel canvas on the page.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

export const bayerThreshold = (x: number, y: number) => (BAYER[y & 3][x & 3] + 0.5) / 16

export type RGB = [number, number, number]

/** Paints `field(x, y)` (0..1) onto the canvas as 1-bit dither in `color`. */
export function paintDither(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: RGB,
  field: (x: number, y: number) => number,
  { alpha = 255, floor = 0 } = {}
) {
  const img = ctx.createImageData(w, h)
  const d = img.data
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = field(x, y)
      if (v > floor && v > bayerThreshold(x, y)) {
        const i = (y * w + x) * 4
        d[i] = color[0]
        d[i + 1] = color[1]
        d[i + 2] = color[2]
        d[i + 3] = alpha
      }
    }
  }
  ctx.putImageData(img, 0, 0)
}

/** Sizes a canvas's backing store to its CSS box divided by `pixel`. */
export function fitCanvas(canvas: HTMLCanvasElement, pixel: number) {
  const r = canvas.getBoundingClientRect()
  canvas.width = Math.max(40, Math.round(r.width / pixel))
  canvas.height = Math.max(40, Math.round(r.height / pixel))
  return { w: canvas.width, h: canvas.height }
}

export const INK: RGB = [16, 16, 16]
export const LIME: RGB = [178, 218, 74]
