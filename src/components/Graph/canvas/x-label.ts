import { CanvasContext, Layout, Range, Box, XAxisAlign, XLabel } from "./types"
import { get_canvas_x } from "./math"

function get_top(
  graph: Box,
  label_height: number,
  x_axis: { x_axis_align: XAxisAlign; x_tick_length: number }
): number {
  const { x_axis_align, x_tick_length } = x_axis

  if (x_axis_align == "top") {
    return graph.top - label_height - x_tick_length
  }
  if (x_axis_align == "bottom") {
    return graph.top + graph.height + x_tick_length
  }

  return 0
}

function get_line_start(
  graph: Box,
  x_axis: { x_axis_align: XAxisAlign; x_tick_length: number }
): number {
  const { x_axis_align, x_tick_length } = x_axis

  if (x_axis_align == "top") {
    return graph.top - x_tick_length
  }
  if (x_axis_align == "bottom") {
    return graph.top + graph.height + x_tick_length
  }

  return 0
}

function get_line_end(
  graph: Box,
  x_axis: { x_axis_align: XAxisAlign }
): number {
  const { x_axis_align } = x_axis

  if (x_axis_align == "top") {
    return graph.top + graph.height
  }
  if (x_axis_align == "bottom") {
    return graph.top
  }

  return 0
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  label: Partial<XLabel>,
  x_axis: {
    x_axis_align: XAxisAlign
    x_tick_length: number
  }
) {
  const { graph } = layout
  const { x_min, x_max } = range
  const {
    get_x,
    width = 50,
    height = 20,
    bg_color = "white",
    font = "",
    color = "black",
    text_padding = 10,
    render,
    draw_line = true,
    line_width = 1,
    line_color = "black",
  } = label

  if (!get_x) {
    return
  }

  const x = get_x(layout, range)

  if (x != null && x_min <= x && x <= x_max) {
    const canvas_x = get_canvas_x(graph.width, graph.left, x_max, x_min, x)
    const left = canvas_x - Math.round(width / 2)
    const top = get_top(graph, height, x_axis)

    // label box
    ctx.fillStyle = bg_color
    ctx.fillRect(left, top, width, height)

    // text
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (render) {
      ctx.fillText(render(x), left + width / 2, top + text_padding)
    }

    if (draw_line) {
      ctx.lineWidth = line_width
      ctx.strokeStyle = line_color

      const line_start = get_line_start(graph, x_axis)
      const line_end = get_line_end(graph, x_axis)

      ctx.beginPath()
      ctx.moveTo(left + width / 2, line_start)
      ctx.lineTo(left + width / 2, line_end)
      ctx.stroke()
    }
  }
}
