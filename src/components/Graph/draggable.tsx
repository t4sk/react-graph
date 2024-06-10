import React, { useRef } from "react"
import { Props as GraphProps } from "./index"
import { Point, Layout, Box, XRange } from "./canvas/types"
import * as math from "./canvas/math"

export interface Drag {
  dragging: boolean
  startMouseX: number | null
  startXMin: number | null
  startXMax: number | null
  xMin: number
  xMax: number
}

function getXRange(drag: Drag, mouse: Point, graph: Box): XRange {
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

export interface DragProps {
  range: {
    xMin: number
    xMax: number
  }
}

export default function draggable<T>(
  Component: React.ComponentType<Partial<GraphProps> & T>
): React.FC<Partial<GraphProps> & DragProps & T> {
  return ({ ...props }: Partial<GraphProps> & DragProps & T) => {
    const {
      range: { xMin, xMax },
    } = props

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
        props.onMouseDown(e, mouse, layout)
      }
    }

    function onMouseUp(
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
      mouse: Point | null,
      layout: Layout
    ) {
      reset()
      if (props.onMouseUp) {
        props.onMouseUp(e, mouse, layout)
      }
    }

    function onMouseMove(
      e: any,
      mouse: Point | null,
      layout: Layout,
      _: XRange | null
    ) {
      let xRange: XRange | null = null
      if (mouse && ref.current?.dragging) {
        xRange = getXRange(ref.current, mouse, layout.graph)
      }
      if (props.onMouseMove) {
        props.onMouseMove(e, mouse, layout, xRange)
      }
    }

    function onMouseOut(e: any, mouse: Point | null, layout: Layout) {
      reset()
      if (props.onMouseOut) {
        props.onMouseOut(e, mouse, layout)
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
