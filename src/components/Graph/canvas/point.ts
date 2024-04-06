import { CanvasContext, Layout, PointGraph, Range } from "./types"
import { get_canvas_x, get_canvas_y } from "./math"

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  graph: Partial<PointGraph>
) {
  const {
    graph: { top, left, width, height },
  } = layout
  const { x_min, x_max, y_min, y_max } = range

  const {
    data = [],
    color = "",
    radius = 1,
    ambient_color = "",
    ambient_radius = 0,
  } = graph

  const len = data.length
  for (let i = 0; i < len; i++) {
    const { x, y } = data[i]

    if (x_min <= x && x <= x_max) {
      const canvas_x = get_canvas_x(width, left, x_max, x_min, x)
      const canvas_y = get_canvas_y(height, top, y_max, y_min, y)

      if (ambient_radius > 0) {
        ctx.beginPath()
        ctx.arc(canvas_x, canvas_y, ambient_radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = ambient_color
        ctx.fill()
      }

      if (radius > 0) {
        ctx.beginPath()
        ctx.arc(canvas_x, canvas_y, radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = color
        ctx.fill()
      }
    }
  }
}
