import { CanvasContext, Layout, Range, YAxis } from "./types"
import { get_canvas_y, step_below } from "./math"

const TICK_TEXT_PADDING = 5

function draw_tick(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  y_axis: YAxis,
  y: number
) {
  const {
    y_axis: { top, left, height, width },
  } = layout
  const { y_min, y_max } = range

  const {
    y_axis_align,
    y_axis_line_color,
    y_axis_font,
    y_axis_text_color,
    y_tick_length,
    render_y_tick,
  } = y_axis

  const canvas_y = get_canvas_y(height, top, y_max, y_min, y)

  ctx.strokeStyle = y_axis_line_color
  ctx.font = y_axis_font
  ctx.fillStyle = y_axis_text_color
  ctx.textAlign = y_axis_align == "left" ? "right" : "left"
  ctx.textBaseline = "middle"

  if (y_axis_align == "left") {
    ctx.beginPath()
    ctx.moveTo(left + width, canvas_y)
    ctx.lineTo(left + width - y_tick_length, canvas_y)
    ctx.stroke()

    if (render_y_tick) {
      ctx.fillText(
        render_y_tick(y),
        left + width - y_tick_length - TICK_TEXT_PADDING,
        canvas_y
      )
    }
  } else if (y_axis_align == "right") {
    ctx.beginPath()
    ctx.moveTo(left, canvas_y)
    ctx.lineTo(left + y_tick_length, canvas_y)
    ctx.stroke()

    if (render_y_tick) {
      ctx.fillText(
        render_y_tick(y),
        left + y_tick_length + TICK_TEXT_PADDING,
        canvas_y
      )
    }
  }
}

function draw_line(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  y_axis: YAxis,
  y: number
) {
  const {
    graph: { top, left, height, width },
  } = layout
  const { y_min, y_max } = range
  const { y_line_color } = y_axis

  const canvas_y = get_canvas_y(height, top, y_max, y_min, y)

  ctx.strokeStyle = y_line_color

  ctx.beginPath()
  ctx.moveTo(left, canvas_y)
  ctx.lineTo(left + width, canvas_y)
  ctx.stroke()
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  y_axis: YAxis
) {
  const {
    y_axis: { top, left, height, width },
  } = layout
  const { y_min, y_max } = range

  const {
    show_y_line,
    y_axis_align,
    y_axis_line_color,
    y_ticks,
    y_tick_interval,
  } = y_axis

  // style y axis line
  ctx.lineWidth = 1
  ctx.strokeStyle = y_axis_line_color

  if (y_axis_align == "left") {
    ctx.beginPath()
    ctx.moveTo(left + width, top)
    ctx.lineTo(left + width, top + height)
    ctx.stroke()
  } else if (y_axis_align == "right") {
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(left, top + height)
    ctx.stroke()
  }

  if (y_tick_interval > 0) {
    const y0 = step_below(y_min, y_tick_interval)

    for (let y = y0; y <= y_max; y += y_tick_interval) {
      if (y_min <= y && y <= y_max) {
        draw_tick(ctx, layout, range, y_axis, y)

        if (show_y_line) {
          draw_line(ctx, layout, range, y_axis, y)
        }
      }
    }
  }

  const len = y_ticks.length
  for (let i = 0; i < len; i++) {
    const y = y_ticks[i]
    if (y_min <= y && y <= y_max) {
      draw_tick(ctx, layout, range, y_axis, y)

      if (show_y_line) {
        draw_line(ctx, layout, range, y_axis, y)
      }
    }
  }
}
