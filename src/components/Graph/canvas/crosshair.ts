import { CanvasContext, Layout, Crosshair } from "./types"
import { is_inside } from "./math"

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  crosshair: Partial<Crosshair>
) {
  const {
    graph: { width, height, left, top },
  } = layout

  const {
    point,
    show_x_line = false,
    x_line_color = "",
    x_line_width = 0.5,
    show_y_line = false,
    y_line_color = "",
    y_line_width = 0.5,
  } = crosshair

  if (
    !point ||
    !is_inside({ top, left, width, height }, { x: point.x, y: point.y })
  ) {
    return
  }

  // x line
  if (show_x_line) {
    ctx.strokeStyle = x_line_color
    ctx.lineWidth = x_line_width

    ctx.beginPath()
    ctx.moveTo(point.x, top)
    ctx.lineTo(point.x, top + height)
    ctx.stroke()
  }

  // y line
  if (show_y_line) {
    ctx.strokeStyle = y_line_color
    ctx.lineWidth = y_line_width

    ctx.beginPath()
    ctx.moveTo(left, point.y)
    ctx.lineTo(left + width, point.y)
    ctx.stroke()
  }
}
