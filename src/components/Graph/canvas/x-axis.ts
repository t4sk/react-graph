import { CanvasContext, Layout, Range, XAxis } from "./types"
import { get_canvas_x, step_below } from "./math"

const TICK_TEXT_PADDING = 10

function draw_tick(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  x_axis: XAxis,
  x: number
) {
  const {
    x_axis: { top, left, width, height },
  } = layout
  const { x_min, x_max } = range

  const {
    x_axis_align,
    x_axis_font,
    x_axis_line_color,
    x_axis_text_color,
    x_tick_length,
    render_x_tick,
  } = x_axis

  const canvas_x = get_canvas_x(width, left, x_max, x_min, x)

  ctx.font = x_axis_font
  ctx.fillStyle = x_axis_text_color
  ctx.strokeStyle = x_axis_line_color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  if (x_axis_align == "top") {
    ctx.beginPath()
    ctx.moveTo(canvas_x, top + height)
    ctx.lineTo(canvas_x, top + height - x_tick_length)
    ctx.stroke()

    if (render_x_tick) {
      ctx.fillText(
        render_x_tick(x),
        canvas_x,
        top + height - x_tick_length - TICK_TEXT_PADDING
      )
    }
  } else if (x_axis_align == "bottom") {
    ctx.beginPath()
    ctx.moveTo(canvas_x, top)
    ctx.lineTo(canvas_x, top + x_tick_length)
    ctx.stroke()

    if (render_x_tick) {
      ctx.fillText(
        render_x_tick(x),
        canvas_x,
        top + x_tick_length + TICK_TEXT_PADDING
      )
    }
  }
}

function draw_line(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  x_axis: XAxis,
  x: number
) {
  const {
    graph: { left, top, width, height },
  } = layout
  const { x_min, x_max } = range
  const { x_line_color } = x_axis

  const canvas_x = get_canvas_x(width, left, x_max, x_min, x)

  ctx.strokeStyle = x_line_color

  ctx.beginPath()
  ctx.moveTo(canvas_x, top)
  ctx.lineTo(canvas_x, top + height)
  ctx.stroke()
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  x_axis: XAxis
) {
  const {
    x_axis: { top, left, width, height },
  } = layout
  const { x_min, x_max } = range

  const {
    x_axis_align,
    x_axis_line_color,
    x_ticks,
    x_tick_interval,
    show_x_line,
  } = x_axis

  // style x axis line
  ctx.lineWidth = 1
  ctx.strokeStyle = x_axis_line_color

  if (x_axis_align == "top") {
    ctx.beginPath()
    ctx.moveTo(left, top + height)
    ctx.lineTo(left + width, top + height)
    ctx.stroke()
  } else if (x_axis_align == "bottom") {
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(left + width, top)
    ctx.stroke()
  }

  if (x_tick_interval > 0) {
    const x0 = step_below(x_min, x_tick_interval)

    for (let x = x0; x <= x_max; x += x_tick_interval) {
      if (x_min <= x && x <= x_max) {
        draw_tick(ctx, layout, range, x_axis, x)

        if (show_x_line) {
          draw_line(ctx, layout, range, x_axis, x)
        }
      }
    }
  }

  const len = x_ticks.length
  for (let i = 0; i < len; i++) {
    const x = x_ticks[i]
    if (x_min <= x && x <= x_max) {
      draw_tick(ctx, layout, range, x_axis, x)

      if (show_x_line) {
        draw_line(ctx, layout, range, x_axis, x)
      }
    }
  }
}
