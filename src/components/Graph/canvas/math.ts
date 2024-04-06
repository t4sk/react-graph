import { Box } from "./types"

export function find_nearest_index<A>(
  arr: A[],
  get: (a: A) => number,
  x: number
): number {
  let low = 0
  let high = arr.length - 1

  if (arr.length <= 1) {
    return high
  }

  if (get(arr[low]) > get(arr[high])) {
    throw new Error("data not sorted")
  }

  // Binary search
  while (low < high) {
    let mid = ((low + high) / 2) >> 0

    if (get(arr[mid]) > x) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  return low
}

export function is_inside(
  box: Box,
  point: { x: number | undefined; y: number | undefined }
): boolean {
  const { x, y } = point

  if (!x || x < box.left || x > box.left + box.width) {
    return false
  }
  if (!y || y < box.top || y > box.top + box.height) {
    return false
  }

  return true
}

export function bound(x: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, x))
}

export function step_below(x: number, step: number): number {
  return x - (x % step)
}

export function lerp(p0: number, p1: number, t: number): number {
  // 0 <= t <= 1
  return p0 * (1 - t) + p1 * t
}

export function lin(dy: number, dx: number, x: number, y0: number): number {
  return (dy / dx) * x + y0
}

export function get_canvas_x(
  width: number,
  left: number,
  x_max: number,
  x_min: number,
  x: number
): number {
  const dx = x_max - x_min
  return lin(width, dx, x, left - (width * x_min) / dx)
}

export function get_canvas_y(
  height: number,
  top: number,
  y_max: number,
  y_min: number,
  y: number
): number {
  const dy = y_max - y_min
  return lin(-height, dy, y, top + (height * y_max) / dy)
}

export function get_x(
  width: number,
  left: number,
  x_max: number,
  x_min: number,
  canvas_x: number
): number {
  const dx = x_max - x_min
  return lin(dx, width, canvas_x, x_min - (dx / width) * left)
}

export function get_y(
  height: number,
  top: number,
  y_max: number,
  y_min: number,
  canvas_y: number
): number {
  const dy = y_max - y_min
  return lin(-dy, height, canvas_y, y_max + (dy / height) * top)
}
