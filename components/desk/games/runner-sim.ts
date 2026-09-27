/**
 * Runner's simulation: pure, fixed-step (60/s), no canvas or React, so it
 * behaves the same at any refresh rate and can be stepped headlessly.
 * Units are CSS px and frames.
 */

export const W = 540
export const H = 200
export const FLOOR = 170 // the ground line
export const HERO_X = 40
export const HERO = 20 // hero glyph: 5 cells × 4px
export const STEP_MS = 1000 / 60

const GRAVITY = 0.42
const HOLD_GRAVITY = 0.32 // floatier while the button is held on the way up
const JUMP_V = 7.4
const CUT_V = 3 // letting go early caps the rise: tap = hop, hold = leap
const COYOTE = 6 // frames you can still jump after running off the ground
const BUFFER = 8 // frames an early press is remembered before landing
const BASE_SPEED = 3.2
const MAX_SPEED = 7.5
export const LOCKOUT = 36 // frames after dying before a press can retry
const AIRTIME = (2 * JUMP_V) / GRAVITY // ≈35 frames for a full jump

export type Status = "ready" | "run" | "paused" | "over"
export type Obstacle = { x: number; y: number; kind: "machine" | "heart" }
export type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: "ink" | "pink" | "lime"; size: number }
export type Popup = { x: number; y: number; text: string; life: number }

export function createWorld(best = 0) {
  return {
    status: "ready" as Status,
    best,
    newBest: false,
    t: 0,
    dist: 0,
    speed: BASE_SPEED,
    score: 0,
    // hero
    y: 0,
    vy: 0,
    grounded: true,
    holding: false,
    coyote: 0,
    buffer: 0,
    squash: 0, // +1 stretched (take-off) … −1 squashed (landing), eases to 0
    // world
    next: 50,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    popups: [] as Popup[],
    shake: 0,
    flash: 0,
    deadFor: 0,
  }
}
export type World = ReturnType<typeof createWorld>

type Rand = () => number
type Box = { x: number; y: number; w: number; h: number }
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

/** Hit boxes are inset a few px: a near miss should feel like a miss. */
export const heroBox = (w: World): Box => ({ x: HERO_X + 3, y: FLOOR - HERO - w.y + 3, w: HERO - 6, h: HERO - 4 })
const obstacleBox = (o: Obstacle): Box =>
  o.kind === "machine" ? { x: o.x + 3, y: o.y + 4, w: HERO - 6, h: HERO - 4 } : { x: o.x - 4, y: o.y - 4, w: 23, h: 23 }

function burst(w: World, x: number, y: number, n: number, color: Particle["color"], force: number, rand: Rand) {
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2
    const v = force * (0.4 + rand() * 0.6)
    const max = 18 + rand() * 16
    w.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - force * 0.4, life: max, max, color, size: rand() < 0.3 ? 3 : 2 })
  }
}

function dust(w: World, n: number, rand: Rand) {
  for (let i = 0; i < n; i++) {
    const max = 12 + rand() * 10
    w.particles.push({ x: HERO_X + 4 + rand() * 12, y: FLOOR - 1, vx: -0.5 - rand() * 1.5, vy: -rand() * 1.2, life: max, max, color: "ink", size: 2 })
  }
}

/** A press: jump while running, otherwise start, resume or retry. */
export function press(w: World): "jump" | "start" | "resume" | "ignored" {
  if (w.status === "run") {
    w.buffer = BUFFER
    w.holding = true
    return "jump"
  }
  if (w.status === "paused") {
    w.status = "run"
    return "resume"
  }
  if (w.status === "over" && w.deadFor < LOCKOUT) return "ignored"
  Object.assign(w, createWorld(w.best), { status: "run" })
  return "start"
}

export function release(w: World) {
  w.holding = false
  if (w.vy > CUT_V) w.vy = CUT_V
}

export function pause(w: World) {
  if (w.status !== "run") return false
  w.status = "paused"
  w.holding = false
  return true
}

/** Whether anything still needs frames: a run, or effects settling after one. */
export const isLive = (w: World) =>
  w.status === "run" ||
  w.particles.length > 0 ||
  w.popups.length > 0 ||
  w.shake > 0 ||
  (w.status === "over" && w.deadFor <= LOCKOUT)

/** Advance one fixed step. `calm` (reduced motion) drops shake and thins particles. */
export function step(w: World, rand: Rand = Math.random, calm = false) {
  const events = { over: false }

  // effects run in every state so they can settle after a crash
  for (const p of w.particles) {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.22
    p.life--
  }
  w.particles = w.particles.filter((p) => p.life > 0 && p.y < FLOOR + 2)
  for (const p of w.popups) {
    p.y -= 0.6
    p.life--
  }
  w.popups = w.popups.filter((p) => p.life > 0)
  w.shake = Math.max(0, w.shake - 1)
  w.flash = Math.max(0, w.flash - 1)
  w.squash *= 0.8
  if (Math.abs(w.squash) < 0.01) w.squash = 0

  if (w.status === "over") w.deadFor++
  if (w.status !== "run") return events

  w.t++
  w.speed = Math.min(MAX_SPEED, BASE_SPEED + w.t / 900)
  w.dist += w.speed

  // jump: buffered presses and a little coyote time forgive near-misses on timing
  w.coyote = w.grounded ? COYOTE : Math.max(0, w.coyote - 1)
  if (w.buffer > 0) {
    w.buffer--
    if (w.coyote > 0) {
      w.vy = JUMP_V
      w.grounded = false
      w.coyote = 0
      w.buffer = 0
      w.squash = 1
      dust(w, calm ? 2 : 4, rand)
      // a press already released before take-off gets a short hop
      if (!w.holding) w.vy = Math.max(CUT_V, JUMP_V * 0.72)
    }
  }
  w.vy -= w.holding && w.vy > 0 ? HOLD_GRAVITY : GRAVITY
  w.y += w.vy
  if (w.y <= 0) {
    if (!w.grounded) {
      w.squash = -1
      dust(w, calm ? 2 : 6, rand)
    }
    w.y = 0
    w.vy = 0
    w.grounded = true
  }

  // obstacles
  const hero = heroBox(w)
  for (const o of w.obstacles) {
    o.x -= w.speed
    if (!overlaps(hero, obstacleBox(o))) continue
    if (o.kind === "heart") {
      w.score += 5
      w.popups.push({ x: o.x + 7, y: o.y - 4, text: "+5", life: 40 })
      burst(w, o.x + 7, o.y + 7, calm ? 4 : 12, "pink", 2.4, rand)
      o.x = -99
    } else {
      w.status = "over"
      w.deadFor = 0
      w.newBest = w.score > w.best
      w.best = Math.max(w.best, w.score)
      w.shake = calm ? 0 : 14
      burst(w, HERO_X + HERO / 2, FLOOR - HERO / 2 - w.y, calm ? 6 : 22, "ink", 3.2, rand)
      events.over = true
      return events
    }
  }
  w.obstacles = w.obstacles.filter((o) => o.x > -48)

  // spawn: gaps never shorter than one jump plus a landing, so every run is clearable
  if (--w.next <= 0) {
    const r = rand()
    if (r < 0.26) {
      w.obstacles.push({ x: W, y: FLOOR - (rand() < 0.5 ? 82 : 60), kind: "heart" })
    } else if (w.t > 600 && r < 0.42) {
      w.obstacles.push({ x: W, y: FLOOR - HERO, kind: "machine" }, { x: W + 22, y: FLOOR - HERO, kind: "machine" })
    } else {
      w.obstacles.push({ x: W, y: FLOOR - HERO, kind: "machine" })
    }
    w.next = Math.max(AIRTIME + 8, 46 + rand() * 60 - Math.min(18, w.t / 200))
  }

  // distance scores a point every 6 frames; every 100 flashes the HUD
  if (w.t % 6 === 0) {
    w.score++
    if (w.score % 100 === 0) w.flash = 48
  }
  return events
}
