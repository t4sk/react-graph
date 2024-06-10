import React, { useRef, useEffect } from "react"
import { draw } from "./canvas"
import { getLayout } from "./canvas/layout"
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
  bgColor: string
  borderRadius?: number
  animate?: boolean
  range: Range
  xAxis: Partial<XAxis>
  yAxis: Partial<YAxis>
  // graphs
  graphs: GraphType[]
  texts: Partial<Text>[]
  xLabels: Partial<XLabel>[]
  yLabels: Partial<YLabel>[]
  crosshair?: Partial<Crosshair>
  onMouseMove?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout,
    xRange: XRange | null
  ) => void
  onMouseOut?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) => void
  onMouseDown?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) => void
  onMouseUp?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) => void
  onWheel?: (
    e: React.WheelEvent<HTMLCanvasElement>,
    mouse: Point | null,
    layout: Layout,
    xRange: XRange | null
  ) => void
}

interface GraphParams extends Props {
  xAxis: XAxis
  yAxis: YAxis
}

const DEFAULT_PARAMS: GraphParams = {
  width: 500,
  height: 300,
  padding: 10,
  bgColor: "",
  borderRadius: 0,
  animate: false,
  range: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
  xAxis: {
    xAxisAlign: "bottom" as XAxisAlign,
    xAxisHeight: 30,
    xAxisLineColor: "black",
    xTicks: [],
    xTickInterval: 0,
    xTickLength: 10,
    renderXTick: (x: number) => x.toString(),
    xAxisFont: "",
    xAxisTextColor: "black",
    showXLine: true,
    xLineColor: "lightgrey",
  },
  yAxis: {
    yAxisAlign: "left" as YAxisAlign,
    yAxisWidth: 50,
    yAxisLineColor: "black",
    yTicks: [],
    yTickInterval: 0,
    yTickLength: 10,
    renderYTick: (y: number) => y.toString(),
    yAxisFont: "",
    yAxisTextColor: "black",
    showYLine: true,
    yLineColor: "lightgrey",
  },
  // graphs
  graphs: [],
  texts: [],
  xLabels: [],
  yLabels: [],
}

function withDefaultParams(props: Partial<Props>): GraphParams {
  return {
    ...DEFAULT_PARAMS,
    ...props,
    xAxis: {
      ...DEFAULT_PARAMS.xAxis,
      ...props?.xAxis,
    },
    yAxis: {
      ...DEFAULT_PARAMS.yAxis,
      ...props?.yAxis,
    },
  }
}

function getMouse(
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
  const params = withDefaultParams(props)
  const {
    width,
    height,
    bgColor = "",
    borderRadius = 0,
    onMouseMove,
    onMouseOut,
    onMouseDown,
    onMouseUp,
    onWheel,
  } = params
  const layout = getLayout(params)

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

  function _onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (onMouseMove) {
      onMouseMove(e, getMouse(ctx.current, e), getLayout(params), null)
    }
  }

  function _onWheelOut(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (onMouseOut) {
      onMouseOut(e, getMouse(ctx.current, e), getLayout(params))
    }
  }

  function _onMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (onMouseDown) {
      onMouseDown(e, getMouse(ctx.current, e), getLayout(params))
    }
  }

  function _onMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (onMouseUp) {
      onMouseUp(e, getMouse(ctx.current, e), getLayout(params))
    }
  }

  function _onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (onWheel) {
      onWheel(e, getMouse(ctx.current, e), getLayout(params), null)
    }
  }

  return (
    <div
      style={{
        position: "relative",
        cursor: "crosshair",
        width,
        height,
        backgroundColor: bgColor,
        borderRadius: borderRadius,
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
        onMouseMove={_onMouseMove}
        onMouseOut={_onWheelOut}
        onMouseDown={_onMouseDown}
        onMouseUp={_onMouseUp}
        onWheel={_onWheel}
      ></canvas>
    </div>
  )
}

export default Graph
