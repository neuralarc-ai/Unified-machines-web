/**
 * Snake's simulation: pure, fixed-step (60/s), no canvas or React. The snake
 * moves one cell every `interval` steps, and `progress` (0..1) says how far it
 * is toward the next move, so rendering can glide between cells.
 */

export const CELL = 18
export const COLS = 30
export const ROWS = 12
export const W = CELL * COLS
export const H = CELL * ROWS
export const STEP_MS = 1000 / 60
export const LOCKOUT = 36 // steps after dying before a turn can retry

const START_INTERVAL = 8 // steps per move: 7.5 cells/s
const MIN_INTERVAL = 4.2 // ~14 cells/s at the top end
const QUEUE = 3 // turns remembered ahead, so a quick up-then-left U-turn lands
const BONUS_EVERY = 5 // hearts between bonus pickups
const BONUS_LIFE = 300 // 5s on the board

export type Status = "ready" | "run" | "paused" | "over"
export type Point = [number, number]
export type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: "ink" | "pink" | "lime"; size: number }
export type Popup = { x: number; y: number; text: string; life: number }

const START_BODY: Point[] = [
  [6, 5],
  [5, 5],
  [4, 5],
]

export function createWorld(best = 0) {
  return {
    status: "ready" as Status,
    best,
    newBest: false,
    score: 0,
    t: 0,
    body: START_BODY.map((p) => [...p] as Point),
    /** Where each segment was before the last move, to interpolate from. */
    prev: START_BODY.map((p) => [...p] as Point),
    dir: [1, 0] as Point,
    queue: [] as Point[],
    timer: 0,
    interval: START_INTERVAL,
    food: [18, 5] as Point,
    bonus: null as { at: Point; life: number } | null,
    eaten: 0,
    /** Segment indices of swallowed food travelling down the body. */
    bulges: [] as number[],
    particles: [] as Particle[],
    popups: [] as Popup[],
    shake: 0,
    flash: 0,
    deadFor: 0,
  }
}
export type World = ReturnType<typeof createWorld>

type Rand = () => number

const same = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1]
const opposite = (a: Point, b: Point) => a[0] === -b[0] && a[1] === -b[1]
export const progress = (w: World) => (w.status === "run" ? Math.min(1, w.timer / w.interval) : 1)

function freeCell(w: World, rand: Rand): Point {
  const taken = (p: Point) => w.body.some((b) => same(b, p)) || same(p, w.food) || (w.bonus && same(p, w.bonus.at))
  for (let i = 0; i < 200; i++) {
    const p: Point = [Math.floor(rand() * COLS), Math.floor(rand() * ROWS)]
    if (!taken(p)) return p
  }
  // a nearly full board: scan for any gap
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (!taken([x, y])) return [x, y]
  return w.food
}

function burst(w: World, cell: Point, n: number, color: Particle["color"], force: number, rand: Rand) {
  const cx = cell[0] * CELL + CELL / 2
  const cy = cell[1] * CELL + CELL / 2
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2
    const v = force * (0.4 + rand() * 0.6)
    const max = 16 + rand() * 14
    w.particles.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: max, max, color, size: rand() < 0.3 ? 3 : 2 })
  }
}

/** Steer. Outside a run, any direction starts, resumes or (after the lockout) retries. */
export function turn(w: World, d: Point): "turn" | "start" | "resume" | "ignored" {
  if (w.status === "paused") {
    w.status = "run"
    return "resume"
  }
  if (w.status === "over" && w.deadFor < LOCKOUT) return "ignored"
  if (w.status !== "run") {
    Object.assign(w, createWorld(w.best), { status: "run" })
    // only a real change of heading is queued; "keep going" must not eat a move
    if (!same(d, w.dir) && !opposite(d, w.dir)) w.queue.push(d)
    return "start"
  }
  // validate against the last queued direction, not the current one, so chained turns work
  const last = w.queue.at(-1) ?? w.dir
  if (same(d, last) || opposite(d, last) || w.queue.length >= QUEUE) return "ignored"
  w.queue.push(d)
  return "turn"
}

export function pause(w: World) {
  if (w.status !== "run") return false
  w.status = "paused"
  return true
}

export const isLive = (w: World) =>
  w.status === "run" ||
  w.particles.length > 0 ||
  w.popups.length > 0 ||
  w.shake > 0 ||
  (w.status === "over" && w.deadFor <= LOCKOUT + w.body.length)

function move(w: World, rand: Rand, calm: boolean) {
  w.dir = w.queue.shift() ?? w.dir
  const head: Point = [(w.body[0][0] + w.dir[0] + COLS) % COLS, (w.body[0][1] + w.dir[1] + ROWS) % ROWS]
  const ateFood = same(head, w.food)
  const ateBonus = !!w.bonus && same(head, w.bonus.at)
  const grows = ateFood || ateBonus

  // the tail vacates its cell this move unless we grow, so chasing it is legal
  const solid = grows ? w.body : w.body.slice(0, -1)
  if (solid.some((p) => same(p, head))) {
    w.status = "over"
    w.deadFor = 0
    w.newBest = w.score > w.best
    w.best = Math.max(w.best, w.score)
    w.shake = calm ? 0 : 12
    burst(w, w.body[0], calm ? 6 : 20, "ink", 3, rand)
    return true
  }

  w.prev = w.body.map((p) => [...p] as Point)
  w.body.unshift(head)
  if (!grows) w.body.pop()
  else w.prev.push([...w.prev[w.prev.length - 1]] as Point) // the new tail segment appears in place
  w.bulges = w.bulges.map((i) => i + 1).filter((i) => i < w.body.length)

  if (ateFood) {
    w.score++
    w.eaten++
    w.bulges.push(0)
    w.popups.push({ x: head[0] * CELL + CELL / 2, y: head[1] * CELL, text: "+1", life: 36 })
    burst(w, head, calm ? 4 : 10, "pink", 2.2, rand)
    w.food = freeCell(w, rand)
    if (w.eaten % BONUS_EVERY === 0 && !w.bonus) w.bonus = { at: freeCell(w, rand), life: BONUS_LIFE }
  }
  if (ateBonus) {
    w.score += 5
    w.bulges.push(0)
    w.popups.push({ x: head[0] * CELL + CELL / 2, y: head[1] * CELL, text: "+5", life: 44 })
    burst(w, head, calm ? 6 : 16, "lime", 2.8, rand)
    w.bonus = null
    w.flash = 24
  }
  // a little faster with every point, down to the floor
  w.interval = Math.max(MIN_INTERVAL, START_INTERVAL - w.score * 0.12)
  return false
}

/** Advance one fixed step. `calm` (reduced motion) drops shake and thins particles. */
export function step(w: World, rand: Rand = Math.random, calm = false) {
  const events = { over: false }

  for (const p of w.particles) {
    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.94
    p.vy *= 0.94
    p.life--
  }
  w.particles = w.particles.filter((p) => p.life > 0)
  for (const p of w.popups) {
    p.y -= 0.5
    p.life--
  }
  w.popups = w.popups.filter((p) => p.life > 0)
  w.shake = Math.max(0, w.shake - 1)
  w.flash = Math.max(0, w.flash - 1)

  if (w.status === "over") w.deadFor++
  if (w.status !== "run") return events

  w.t++
  if (w.bonus && --w.bonus.life <= 0) w.bonus = null
  w.timer++
  if (w.timer >= w.interval) {
    w.timer -= w.interval
    events.over = move(w, rand, calm)
  }
  return events
}
