import React, { useState } from "react"
import Graph from "./Graph"
import draggable from "./Graph/draggable"
import zoomable from "./Graph/zoomable"
import { Point, Layout, XRange } from "./Graph/canvas/types"

const ZoomDragGraph = zoomable(draggable(Graph))

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

const TestGraph: React.FC<{}> = ({}) => {
  const [{ xMin, xMax }, setState] = useState({
    xMin: X_MIN,
    xMax: X_MAX,
  })
  const [mouse, setMouse] = useState<Point | null>(null)

  const range = {
    xMin,
    xMax,
    yMin: Y_MIN,
    yMax: Y_MAX,
  }

  function onMouseDown(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) {}

  function onMouseUp(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) {}

  function onMouseMove(
    e: any,
    mouse: Point | null,
    layout: Layout,
    xRange: XRange | null
  ) {
    if (mouse) {
      setMouse({
        x: mouse.x,
        y: mouse.y,
      })

      if (xRange) {
        setState({
          xMin: xRange.xMin,
          xMax: xRange.xMax,
        })
      }
    }
  }

  function onWheel(
    e: React.WheelEvent<HTMLCanvasElement>,
    mouse: Point | null,
    layout: Layout,
    xRange: XRange | null
  ) {
    if (xRange) {
      setState({
        xMin: xRange.xMin,
        xMax: xRange.xMax,
      })
    }
  }

  function onMouseOut() {
    setMouse(null)
  }

  return (
    <ZoomDragGraph
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
      onWheel={onWheel}
    />
  )
}

export default TestGraph
