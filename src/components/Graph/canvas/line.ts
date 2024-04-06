import { CanvasContext, Layout, LineGraph, Range } from "./types"
import { get_canvas_x, get_canvas_y } from "./math"

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  graph: Partial<LineGraph>
) {
  const {
    graph: { top, left, width, height },
  } = layout
  const { x_min, x_max, y_min, y_max } = range

  const { data = [], step = 0, line_color = "", line_width = 1 } = graph

  ctx.strokeStyle = line_color
  ctx.lineWidth = line_width

  if (step > 0) {
    ctx.beginPath()
    for (let i = 0; i < data.length; i += step) {
      const { x, y } = data[i]

      if (x_min <= x && x <= x_max) {
        ctx.lineTo(
          get_canvas_x(width, left, x_max, x_min, x),
          get_canvas_y(height, top, y_max, y_min, y)
        )
      }
    }
    ctx.stroke()
  }
}
