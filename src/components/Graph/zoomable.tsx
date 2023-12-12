import React, { useRef } from "react"
import { Props as GraphProps } from "./index"
import { Point, Layout, Box, XRange } from "./canvas/types"
import * as math from "./canvas/math"

const DEFAULT_ZOOM_RATE = 0.1

export interface Zoom {
  rate: number
  xMin: number
  xMax: number
}

function getXRange(
  zoom: Zoom,
  e: React.WheelEvent<HTMLCanvasElement>,
  mouse: Point,
  graph: Box
) {
  const { xMin, xMax, rate } = zoom

  if (!math.isInside(graph, mouse)) {
    return {
      xMin,
      xMax,
    }
  }

  const { deltaY } = e
  const x = math.getX(graph.width, graph.left, xMax, xMin, mouse.x)

  if (deltaY > 0) {
    // zoom out
    return {
      xMin: x - (x - xMin) * (1 + rate),
      xMax: x + (xMax - x) * (1 + rate),
    }
  } else {
    // zoom in
    return {
      xMin: x - (x - xMin) * (1 - rate),
      xMax: x + (xMax - x) * (1 - rate),
    }
  }
}

export interface ZoomProps {
  zoomRate?: number
  range: {
    xMin: number
    xMax: number
  }
}

export default function zoomable<T>(
  Component: React.ComponentType<Partial<GraphProps> & T>
): React.FC<Partial<GraphProps> & ZoomProps & T> {
  return ({ ...props }: Partial<GraphProps> & ZoomProps & T) => {
    const {
      zoomRate = DEFAULT_ZOOM_RATE,
      range: { xMin, xMax },
    } = props

    const ref = useRef<Zoom>({
      rate: zoomRate,
      xMin,
      xMax,
    })

    ref.current.xMin = xMin
    ref.current.xMax = xMax
    ref.current.rate = zoomRate

    function onWheel(
      e: React.WheelEvent<HTMLCanvasElement>,
      mouse: Point | null,
      layout: Layout,
      _: XRange | null
    ) {
      let xRange: XRange | null = null
      if (mouse) {
        xRange = getXRange(ref.current, e, mouse, layout.graph)
      }
      if (props.onWheel) {
        props.onWheel(e, mouse, layout, xRange)
      }
    }

    return <Component {...props} onWheel={onWheel} />
  }
}
