import React, { useRef, useEffect } from "react"
import { draw } from "./canvas"
import { get_layout } from "./canvas/layout"
import {
  Context,
  Point,
  Layout,
  Range,
  XRange,
  XAxis,
  YAxis,
  XAxisAlign,
  YAxisAlign,
  Crosshair,
  Text,
  XLabel,
  YLabel,
  Graph as GraphType,
} from "./canvas/types"

const STYLE: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
}

export interface Props {
  width: number
  height: number
  padding: number
  bg_color: string
  border_radius?: number
  animate?: boolean
  range: Range
  x_axis: Partial<XAxis>
  y_axis: Partial<YAxis>
  // graphs
  graphs: GraphType[]
  texts: Partial<Text>[]
  x_labels: Partial<XLabel>[]
  y_labels: Partial<YLabel>[]
  crosshair?: Partial<Crosshair>
  on_mouse_move?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout,
    x_range: XRange | null
  ) => void
  on_mouse_out?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) => void
  on_mouse_down?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) => void
  on_mouse_up?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) => void
  on_wheel?: (
    e: React.WheelEvent<HTMLCanvasElement>,
    mouse: Point | null,
    layout: Layout,
    x_range: XRange | null
  ) => void
}

interface GraphParams extends Props {
  x_axis: XAxis
  y_axis: YAxis
}

const DEFAULT_PARAMS: GraphParams = {
  width: 500,
  height: 300,
  padding: 10,
  bg_color: "",
  border_radius: 0,
  animate: false,
  range: {
    x_min: 0,
    x_max: 0,
    y_min: 0,
    y_max: 0,
  },
  x_axis: {
    x_axis_align: "bottom" as XAxisAlign,
    x_axis_height: 30,
    x_axis_line_color: "black",
    x_ticks: [],
    x_tick_interval: 0,
    x_tick_length: 10,
    render_x_tick: (x: number) => x.toString(),
    x_axis_font: "",
    x_axis_text_color: "black",
    show_x_line: true,
    x_line_color: "lightgrey",
  },
  y_axis: {
    y_axis_align: "left" as YAxisAlign,
    y_axis_width: 50,
    y_axis_line_color: "black",
    y_ticks: [],
    y_tick_interval: 0,
    y_tick_length: 10,
    render_y_tick: (y: number) => y.toString(),
    y_axis_font: "",
    y_axis_text_color: "black",
    show_y_line: true,
    y_line_color: "lightgrey",
  },
  // graphs
  graphs: [],
  texts: [],
  x_labels: [],
  y_labels: [],
}

function with_default_params(props: Partial<Props>): GraphParams {
  return {
    ...DEFAULT_PARAMS,
    ...props,
    x_axis: {
      ...DEFAULT_PARAMS.x_axis,
      ...props?.x_axis,
    },
    y_axis: {
      ...DEFAULT_PARAMS.y_axis,
      ...props?.y_axis,
    },
  }
}

function get_mouse(
  ctx: Context,
  e:
    | React.MouseEvent<HTMLCanvasElement, MouseEvent>
    | React.WheelEvent<HTMLCanvasElement>
): Point | null {
  if (!ctx.ui) {
    return null
  }

  const rect = ctx.ui.canvas.getBoundingClientRect()

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

interface Refs {
  axes: HTMLCanvasElement | null
  graph: HTMLCanvasElement | null
  ui: HTMLCanvasElement | null
  // animation frame
  animation: number | null
  // NOTE: store params and layout as ref for animate to draw with latest params
  params: GraphParams
  layout: Layout
}

const Graph: React.FC<Partial<Props>> = (props) => {
  const params = with_default_params(props)
  const {
    width,
    height,
    bg_color = "",
    border_radius = 0,
    on_mouse_move,
    on_mouse_out,
    on_mouse_down,
    on_mouse_up,
    on_wheel,
  } = params
  const layout = get_layout(params)

  const refs = useRef<Refs>({
    axes: null,
    graph: null,
    ui: null,
    animation: null,
    params,
    layout,
  })
  refs.current.params = params
  refs.current.layout = layout

  const ctx = useRef<Context>({ axes: null, graph: null, ui: null })

  useEffect(() => {
    ctx.current.axes = refs.current.axes?.getContext("2d")
    ctx.current.graph = refs.current.graph?.getContext("2d")
    ctx.current.ui = refs.current.ui?.getContext("2d")

    if (ctx.current) {
      if (params.animate) {
        _animate()
      } else {
        draw(ctx.current, layout, params)
      }
    }

    return () => {
      if (refs.current.animation) {
        window.cancelAnimationFrame(refs.current.animation)
      }
    }
  }, [width, height])

  function _animate() {
    refs.current.animation = window.requestAnimationFrame(_animate)
    if (refs.current) {
      draw(ctx.current, refs.current.layout, refs.current.params)
    }
  }

  function _on_mouse_move(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (on_mouse_move) {
      on_mouse_move(e, get_mouse(ctx.current, e), get_layout(params), null)
    }
  }

  function _on_wheel_out(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (on_mouse_out) {
      on_mouse_out(e, get_mouse(ctx.current, e), get_layout(params))
    }
  }

  function _on_mouse_down(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (on_mouse_down) {
      on_mouse_down(e, get_mouse(ctx.current, e), get_layout(params))
    }
  }

  function _on_mouse_up(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (on_mouse_up) {
      on_mouse_up(e, get_mouse(ctx.current, e), get_layout(params))
    }
  }

  function _on_wheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (on_wheel) {
      on_wheel(e, get_mouse(ctx.current, e), get_layout(params), null)
    }
  }

  return (
    <div
      style={{
        position: "relative",
        cursor: "crosshair",
        width,
        height,
        backgroundColor: bg_color,
        borderRadius: border_radius,
      }}
    >
      <canvas
        ref={(ref) => {
          refs.current.axes = ref
        }}
        style={STYLE}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => {
          refs.current.graph = ref
        }}
        style={STYLE}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => {
          refs.current.ui = ref
        }}
        style={STYLE}
        width={width}
        height={height}
        onMouseMove={_on_mouse_move}
        onMouseOut={_on_wheel_out}
        onMouseDown={_on_mouse_down}
        onMouseUp={_on_mouse_up}
        onWheel={_on_wheel}
      ></canvas>
    </div>
  )
}

export default Graph
