import React, { useState, useRef } from "react"
import Graph, { Props as GraphProps } from "./Graph"
import { Point, Layout, Box } from "./Graph/canvas/types"
import * as math from "./Graph/canvas/math"

const t0 = Math.floor(new Date().getTime() / 1000)

const DATA: { x: number; y: number }[][] = []
for (let i = 0; i < 3; i++) {
  DATA.push([])
  for (let j = 0; j < 150; j++) {
    const t = t0 + j * 1000
    // const date = new Date(t * 1000)
    const score = (DATA[i][j - 1]?.y || 0) + 100
    DATA[i].push({
      x: t,
      y: score,
      //   date,
      //   t,
      //   score,
    })
  }
}

const XS = DATA[0].map(({ x }) => x)

const Y_MIN = DATA[0][0].y
const Y_MAX = DATA[0][149].y
const X_MIN = DATA[0][0].x
const X_MAX = DATA[0][149].x

const X_LABEL_WIDTH = 80
const X_LABEL_HEIGHT = 20

const Y_LABEL_WIDTH = 50
const Y_LABEL_HEIGHT = 20

const WIDTH = 600
const HEIGHT = 400

interface Drag {
  dragging: boolean
  startMouseX: number | null
  startXMin: number | null
  startXMax: number | null
  xMin: number
  xMax: number
}

function getXRange(
  drag: Drag,
  mouse: Point,
  graph: Box
): { xMin: number; xMax: number } {
  if (
    !mouse.x ||
    !mouse.y ||
    !drag.dragging ||
    !drag.startMouseX ||
    !drag.startXMax ||
    !drag.startXMin ||
    !math.isInside(graph, mouse)
  ) {
    return {
      xMin: drag.xMin,
      xMax: drag.xMax,
    }
  }

  const diff = mouse.x - drag.startMouseX

  const xMin = math.getX(
    graph.width,
    graph.left,
    drag.startXMax,
    drag.startXMin,
    graph.left - diff
  )

  const xMax = math.getX(
    graph.width,
    graph.left,
    drag.startXMax,
    drag.startXMin,
    graph.width + graph.left - diff
  )

  return {
    xMin,
    xMax,
  }
}

interface DragProps {
  xMin: number
  xMax: number
}

export function draggable(
  Component: React.ComponentType<Partial<GraphProps>>
): React.FC<Partial<GraphProps> & DragProps> {
  return ({ xMin, xMax, ...props }: Partial<GraphProps> & DragProps) => {
    const ref = useRef<Drag>({
      dragging: false,
      startMouseX: null,
      startXMin: null,
      startXMax: null,
      xMin,
      xMax,
    })

    ref.current.xMin = xMin
    ref.current.xMax = xMax

    function reset() {
      ref.current.dragging = false
      ref.current.startMouseX = null
      ref.current.startXMin = null
      ref.current.startXMax = null
    }

    function onMouseDown(
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
      mouse: Point | null,
      layout: Layout
    ) {
      if (mouse && math.isInside(layout.graph, mouse)) {
        ref.current.dragging = true
        ref.current.startMouseX = mouse.x
        ref.current.startXMin = ref.current.xMin
        ref.current.startXMax = ref.current.xMax
      }

      if (props.onMouseDown) {
        onMouseDown(e, mouse, layout)
      }
    }

    function onMouseUp(
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
      mouse: Point | null,
      layout: Layout
    ) {
      reset()
      if (onMouseUp) {
        onMouseUp(e, mouse, layout)
      }
    }

    function onMouseMove(e: any, mouse: Point | null, layout: Layout) {
      if (mouse) {
        const xRange = getXRange(ref.current, mouse, layout.graph)

        // setState({
        //   xMin: xRange.xMin,
        //   xMax: xRange.xMax,
        // })
      }
      if (onMouseMove) {
        onMouseMove(e, mouse, layout)
      }
    }

    function onMouseOut(e: any, mouse: Point | null, layout: Layout) {
      reset()
      if (onMouseOut) {
        onMouseOut(e, mouse, layout)
      }
    }

    return (
      <Component
        {...props}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
      />
    )
  }
}

const TestGraph: React.FC<{}> = ({}) => {
  const [{ xMin, xMax }, setState] = useState({
    xMin: X_MIN,
    xMax: X_MAX,
  })
  const [mouse, setMouse] = useState<Point | null>(null)

  const ref = useRef<Drag>({
    dragging: false,
    startMouseX: null,
    startXMin: null,
    startXMax: null,
    xMin,
    xMax,
  })

  ref.current.xMin = xMin
  ref.current.xMax = xMax

  const range = {
    xMin,
    xMax,
    yMin: Y_MIN,
    yMax: Y_MAX,
  }

  function reset() {
    ref.current.dragging = false
    ref.current.startMouseX = null
    ref.current.startXMin = null
    ref.current.startXMax = null
  }

  function onMouseDown(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) {
    if (mouse && math.isInside(layout.graph, mouse)) {
      ref.current.dragging = true
      ref.current.startMouseX = mouse.x
      ref.current.startXMin = ref.current.xMin
      ref.current.startXMax = ref.current.xMax
    }
  }

  function onMouseUp(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) {
    reset()
  }

  function onMouseMove(e: any, point: Point | null, layout: Layout) {
    if (point) {
      const xRange = getXRange(ref.current, point, layout.graph)

      setMouse({
        x: point.x,
        y: point.y,
      })

      setState({
        xMin: xRange.xMin,
        xMax: xRange.xMax,
      })
    }
  }

  function onMouseOut() {
    reset()
    setMouse(null)
  }

  // TODO: zoom, drag

  return (
    <Graph
      width={WIDTH}
      height={HEIGHT}
      backgroundColor="beige"
      animate={true}
      range={range}
      xAxis={{
        xTickInterval: 24 * 3600,
        renderXTick: (x: number) =>
          new Date(x * 1000).toISOString().slice(0, 10),
      }}
      yAxis={{
        yTickInterval: 1000,
      }}
      graphs={[
        {
          type: "line",
          lineColor: "green",
          step: 1,
          data: DATA[0],
        },
        {
          type: "line",
          lineColor: "orange",
          step: 1,
          data: DATA[1],
        },
        {
          type: "point",
          data: DATA[2],
        },
        {
          type: "bar",
          data: DATA[2],
        },
      ]}
      crosshair={{
        point: mouse,
        yLineColor: "red",
        yLineWidth: 0.5,
        xLineColor: "green",
        xLineWidth: 4,
      }}
      texts={[
        {
          text: `x: ${mouse?.x || 0}`,
          color: "black",
          font: "16px Arial",
          left: 10,
          top: 10,
        },
        {
          text: `y: ${mouse?.y || 0}`,
          color: "black",
          font: "16px Arial",
          left: 10,
          top: 10 + 15,
        },
      ]}
      xLabels={[
        {
          // x: (X_MIN + X_MAX) / 2,
          width: X_LABEL_WIDTH,
          height: X_LABEL_HEIGHT,
          render: (x: number) => x.toString(),
          color: "white",
          backgroundColor: "black",
          drawLine: true,
          lineColor: "green",
        },
        {
          // x: X_MIN,
          width: X_LABEL_WIDTH,
          height: X_LABEL_HEIGHT,
          render: (x: number) => x.toString(),
          color: "white",
          backgroundColor: "black",
          drawLine: true,
          lineColor: "green",
        },
      ]}
      yLabels={[
        {
          // y: (Y_MIN + Y_MAX) / 2,
          width: Y_LABEL_WIDTH,
          height: Y_LABEL_HEIGHT,
          render: (y: number) => y.toString(),
          color: "white",
          backgroundColor: "black",
          drawLine: true,
          lineColor: "orange",
        },
        {
          // y: Y_MIN,
          width: Y_LABEL_WIDTH,
          height: Y_LABEL_HEIGHT,
          render: (y: number) => y.toString(),
          color: "white",
          backgroundColor: "black",
          drawLine: true,
          lineColor: "orange",
        },
      ]}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
    />
  )
}

export default TestGraph
