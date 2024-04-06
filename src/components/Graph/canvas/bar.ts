import { CanvasContext, Layout, Range, BarGraph } from "./types"
import { get_canvas_x, get_canvas_y } from "./math"

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  graph: Partial<BarGraph>
) {
  const {
    graph: { top, left, width, height },
  } = layout
  const { x_min, x_max, y_min, y_max } = range

  const {
    data = [],
    step = 1,
    get_bar_color = () => "",
    bar_width = 1,
    y0 = y_min,
  } = graph

  const canvas_y0 = get_canvas_y(height, top, y_max, y_min, y0)

  if (step > 0) {
    for (let i = 0; i < data.length; i += step) {
      const d = data[i]
      const { x, y } = d

      if (x_min <= x && x <= x_max) {
        const canvas_x = get_canvas_x(width, left, x_max, x_min, x)
        const canvas_y = get_canvas_y(height, top, y_max, y_min, y)

        const bar_height = canvas_y0 - canvas_y

        ctx.fillStyle = get_bar_color(d)
        ctx.fillRect(canvas_x - bar_width / 2, canvas_y, bar_width, bar_height)
      }
    }
  }
}
