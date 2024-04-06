import {
  CanvasContext,
  Layout,
  Range,
  Box,
  YLabel,
  YAxisAlign,
  TextAlign,
} from "./types"
import { get_canvas_y } from "./math"

function get_left(
  graph: Box,
  label_width: number,
  y_axis: { y_axis_align: YAxisAlign; y_tick_length: number }
): number {
  const { y_axis_align, y_tick_length } = y_axis

  if (y_axis_align == "left") {
    return graph.left - label_width - y_tick_length
  }
  if (y_axis_align == "right") {
    return graph.left + graph.width + y_tick_length
  }

  return 0
}

function get_text_align(y_axis_align: YAxisAlign): TextAlign {
  switch (y_axis_align) {
    case "left":
      return "right"
    case "right":
      return "left"
    default:
      console.error(`invalid y_axis_align ${y_axis_align}`)
      return "right"
  }
}

function get_text_left(
  left: number,
  label: { text_padding: number; width: number },
  y_axis_align: YAxisAlign
): number {
  const { text_padding, width } = label

  switch (y_axis_align) {
    case "left":
      return left + width - text_padding
    case "right":
      return left + text_padding
    default:
      console.error(`invalid y_axis_align ${y_axis_align}`)
      return left + width - text_padding
  }
}

function get_line_start(
  graph: Box,
  y_axis: { y_axis_align: YAxisAlign; y_tick_length: number }
): number {
  const { y_axis_align, y_tick_length } = y_axis

  if (y_axis_align == "left") {
    return graph.left - y_tick_length
  }
  if (y_axis_align == "right") {
    return graph.left + graph.width + y_tick_length
  }

  return 0
}

function get_line_end(
  graph: Box,
  y_axis: { y_axis_align: YAxisAlign }
): number {
  const { y_axis_align } = y_axis

  if (y_axis_align == "left") {
    return graph.left + graph.width
  }
  if (y_axis_align == "right") {
    return graph.left
  }

  return 0
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  label: Partial<YLabel>,
  y_axis: {
    y_axis_align: YAxisAlign
    y_tick_length: number
  }
) {
  const { graph } = layout
  const { y_min, y_max } = range
  const {
    get_y,
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

  if (!get_y) {
    return
  }

  const y = get_y(layout, range)

  if (y != null && y_min <= y && y <= y_max) {
    const canvas_y = get_canvas_y(graph.height, graph.top, y_max, y_min, y)
    const top = canvas_y - Math.round(height / 2)
    const left = get_left(graph, width, y_axis)

    ctx.fillStyle = bg_color

    // label box
    ctx.fillRect(left, top, width, height)

    // text
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = get_text_align(y_axis.y_axis_align)
    ctx.textBaseline = "middle"

    if (render) {
      ctx.fillText(
        render(y),
        get_text_left(left, { text_padding, width }, y_axis.y_axis_align),
        top + text_padding
      )
    }

    if (draw_line) {
      ctx.lineWidth = line_width
      ctx.strokeStyle = line_color

      const line_start = get_line_start(graph, y_axis)
      const line_end = get_line_end(graph, y_axis)

      ctx.beginPath()
      ctx.moveTo(line_start, top + height / 2)
      ctx.lineTo(line_end, top + height / 2)
      ctx.stroke()
    }
  }
}
