import React, { useRef } from "react"
import { Props as GraphProps } from "./index"
import { Point, Layout, Box, XRange } from "./canvas/types"
import * as math from "./canvas/math"

const DEFAULT_ZOOM_RATE = 0.1

export interface Zoom {
  rate: number
  x_min: number
  x_max: number
}

function get_x_range(
  zoom: Zoom,
  e: React.WheelEvent<HTMLCanvasElement>,
  mouse: Point,
  graph: Box
) {
  const { x_min, x_max, rate } = zoom

  if (!math.is_inside(graph, mouse)) {
    return {
      x_min,
      x_max,
    }
  }

  const { deltaY } = e
  const x = math.get_x(graph.width, graph.left, x_max, x_min, mouse.x)

  if (deltaY > 0) {
    // zoom out
    return {
      x_min: x - (x - x_min) * (1 + rate),
      x_max: x + (x_max - x) * (1 + rate),
    }
  } else {
    // zoom in
    return {
      x_min: x - (x - x_min) * (1 - rate),
      x_max: x + (x_max - x) * (1 - rate),
    }
  }
}

export interface ZoomProps {
  zoomRate?: number
  range: {
    x_min: number
    x_max: number
  }
}

export default function zoomable<T>(
  Component: React.ComponentType<Partial<GraphProps> & T>
): React.FC<Partial<GraphProps> & ZoomProps & T> {
  return ({ ...props }: Partial<GraphProps> & ZoomProps & T) => {
    const {
      zoomRate = DEFAULT_ZOOM_RATE,
      range: { x_min, x_max },
    } = props

    const ref = useRef<Zoom>({
      rate: zoomRate,
      x_min,
      x_max,
    })

    ref.current.x_min = x_min
    ref.current.x_max = x_max
    ref.current.rate = zoomRate

    function on_wheel(
      e: React.WheelEvent<HTMLCanvasElement>,
      mouse: Point | null,
      layout: Layout,
      _: XRange | null
    ) {
      let x_range: XRange | null = null
      if (mouse) {
        x_range = get_x_range(ref.current, e, mouse, layout.graph)
      }
      if (props.on_wheel) {
        props.on_wheel(e, mouse, layout, x_range)
      }
    }

    return <Component {...props} on_wheel={on_wheel} />
  }
}
