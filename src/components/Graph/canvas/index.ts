import {
  CanvasContext,
  Context,
  XAxis,
  YAxis,
  Layout,
  Range,
  Crosshair,
  Text,
  XLabel,
  YLabel,
  Graph as GraphType,
} from "./types"

import * as x_axis from "../canvas/x-axis"
import * as y_axis from "../canvas/y-axis"
import * as bar from "../canvas/bar"
import * as line from "../canvas/line"
import * as point from "../canvas/point"
import * as crosshair from "../canvas/crosshair"
import * as text from "../canvas/text"
import * as x_label from "../canvas/x-label"
import * as y_label from "../canvas/y-label"

export interface Params {
  width: number
  height: number
  padding: number
  bg_color: string
  animate?: boolean
  range: Range
  // x axis
  x_axis: XAxis
  y_axis: YAxis
  // graphs
  graphs: GraphType[]
  texts: Partial<Text>[]
  x_labels: Partial<XLabel>[]
  y_labels: Partial<YLabel>[]
  crosshair?: Partial<Crosshair>
}

function _draw_graph(
  ctx: CanvasContext,
  layout: Layout,
  range: Range,
  graph: GraphType
) {
  switch (graph.type) {
    case "bar":
      bar.draw(ctx, layout, range, graph)
      return
    case "line":
      line.draw(ctx, layout, range, graph)
      return
    case "point":
      point.draw(ctx, layout, range, graph)
      return
    default:
      return
  }
}

export function draw(ctx: Context, layout: Layout, params: Params) {
  const { width, height, range } = params

  ctx.axes?.clearRect(0, 0, width, height)
  ctx.graph?.clearRect(0, 0, width, height)
  ctx.ui?.clearRect(0, 0, width, height)

  if (ctx.axes) {
    x_axis.draw(ctx.axes, layout, range, params.x_axis)
    y_axis.draw(ctx.axes, layout, range, params.y_axis)
  }

  if (ctx.graph) {
    const len = params.graphs.length
    for (let i = 0; i < len; i++) {
      _draw_graph(ctx.graph, layout, range, params.graphs[i])
    }
  }

  if (ctx.ui) {
    if (params.crosshair) {
      crosshair.draw(ctx.ui, layout, params.crosshair)
    }

    // cache array length
    let len = 0

    const { texts } = params
    len = texts.length
    for (let i = 0; i < len; i++) {
      text.draw(ctx.ui, texts[i])
    }

    const { x_labels } = params
    len = x_labels.length
    for (let i = 0; i < len; i++) {
      x_label.draw(ctx.ui, layout, range, x_labels[i], params.x_axis)
    }

    const { y_labels } = params
    len = y_labels.length
    for (let i = 0; i < len; i++) {
      y_label.draw(ctx.ui, layout, range, y_labels[i], params.y_axis)
    }
  }
}
