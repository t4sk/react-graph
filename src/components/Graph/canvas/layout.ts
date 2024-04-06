import { XAxisAlign, YAxisAlign, Layout } from "./types"

interface Params {
  padding: number
  width: number
  height: number
  x_axis: {
    x_axis_align: XAxisAlign
    x_axis_height: number
  }
  y_axis: {
    y_axis_align: YAxisAlign
    y_axis_width: number
  }
}

export function get_layout(params: Params): Layout {
  const {
    padding,
    width,
    height,
    x_axis: { x_axis_align, x_axis_height },
    y_axis: { y_axis_align, y_axis_width },
  } = params

  return {
    graph: {
      top: x_axis_align == "top" ? padding + x_axis_height : padding,
      left: y_axis_align == "left" ? padding + y_axis_width : padding,
      width: width - 2 * padding - y_axis_width,
      height: height - 2 * padding - x_axis_height,
    },
    x_axis: {
      top: x_axis_align == "top" ? padding : height - padding - x_axis_height,
      left: y_axis_align == "left" ? padding + y_axis_width : padding,
      width: width - 2 * padding - y_axis_width,
      height: x_axis_height,
    },
    y_axis: {
      top: x_axis_align == "top" ? padding + x_axis_height : padding,
      left: y_axis_align == "left" ? padding : width - padding - y_axis_width,
      width: y_axis_width,
      height: height - 2 * padding - x_axis_height,
    },
  }
}
