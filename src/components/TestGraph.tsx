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
  const [{ x_min, x_max }, set_state] = useState({
    x_min: X_MIN,
    x_max: X_MAX,
  })
  const [mouse, set_mouse] = useState<Point | null>(null)

  const range = {
    x_min,
    x_max,
    y_min: Y_MIN,
    y_max: Y_MAX,
  }

  function on_mouse_down(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) {}

  function on_mouse_up(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point | null,
    layout: Layout
  ) {}

  function on_mouse_move(
    e: any,
    mouse: Point | null,
    layout: Layout,
    x_range: XRange | null
  ) {
    if (mouse) {
      set_mouse({
        x: mouse.x,
        y: mouse.y,
      })

      if (x_range) {
        set_state({
          x_min: x_range.x_min,
          x_max: x_range.x_max,
        })
      }
    }
  }

  function on_wheel(
    e: React.WheelEvent<HTMLCanvasElement>,
    mouse: Point | null,
    layout: Layout,
    x_range: XRange | null
  ) {
    if (x_range) {
      set_state({
        x_min: x_range.x_min,
        x_max: x_range.x_max,
      })
    }
  }

  function on_mouse_out() {
    set_mouse(null)
  }

  return (
    <ZoomDragGraph
      width={WIDTH}
      height={HEIGHT}
      bg_color="beige"
      animate={true}
      range={range}
      x_axis={{
        x_tick_interval: 24 * 3600,
        render_x_tick: (x: number) =>
          new Date(x * 1000).toISOString().slice(0, 10),
      }}
      y_axis={{
        y_tick_interval: 1000,
      }}
      graphs={[
        {
          type: "line",
          line_color: "green",
          step: 1,
          data: DATA[0],
        },
        {
          type: "line",
          line_color: "orange",
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
        y_line_color: "red",
        y_line_width: 0.5,
        x_line_color: "green",
        x_line_width: 4,
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
      x_labels={[
        {
          // x: (X_MIN + X_MAX) / 2,
          width: X_LABEL_WIDTH,
          height: X_LABEL_HEIGHT,
          render: (x: number) => x.toString(),
          color: "white",
          bg_color: "black",
          draw_line: true,
          line_color: "green",
        },
        {
          // x: X_MIN,
          width: X_LABEL_WIDTH,
          height: X_LABEL_HEIGHT,
          render: (x: number) => x.toString(),
          color: "white",
          bg_color: "black",
          draw_line: true,
          line_color: "green",
        },
      ]}
      y_labels={[
        {
          // y: (Y_MIN + Y_MAX) / 2,
          width: Y_LABEL_WIDTH,
          height: Y_LABEL_HEIGHT,
          render: (y: number) => y.toString(),
          color: "white",
          bg_color: "black",
          draw_line: true,
          line_color: "orange",
        },
        {
          // y: Y_MIN,
          width: Y_LABEL_WIDTH,
          height: Y_LABEL_HEIGHT,
          render: (y: number) => y.toString(),
          color: "white",
          bg_color: "black",
          draw_line: true,
          line_color: "orange",
        },
      ]}
      on_mouse_down={on_mouse_down}
      on_mouse_up={on_mouse_up}
      on_mouse_move={on_mouse_move}
      on_mouse_out={on_mouse_out}
      on_wheel={on_wheel}
    />
  )
}

export default TestGraph
