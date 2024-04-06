import React, { useRef } from "react"
import { Props as GraphProps } from "./index"
import { Point, Layout, Box, XRange } from "./canvas/types"
import * as math from "./canvas/math"

export interface Drag {
  dragging: boolean
  start_mouse_x: number | null
  start_x_min: number | null
  start_x_max: number | null
  x_min: number
  x_max: number
}

function get_x_range(drag: Drag, mouse: Point, graph: Box): XRange {
  if (
    !mouse.x ||
    !mouse.y ||
    !drag.dragging ||
    !drag.start_mouse_x ||
    !drag.start_x_max ||
    !drag.start_x_min ||
    !math.is_inside(graph, mouse)
  ) {
    return {
      x_min: drag.x_min,
      x_max: drag.x_max,
    }
  }

  const diff = mouse.x - drag.start_mouse_x

  const x_min = math.get_x(
    graph.width,
    graph.left,
    drag.start_x_max,
    drag.start_x_min,
    graph.left - diff
  )

  const x_max = math.get_x(
    graph.width,
    graph.left,
    drag.start_x_max,
    drag.start_x_min,
    graph.width + graph.left - diff
  )

  return {
    x_min,
    x_max,
  }
}

export interface DragProps {
  range: {
    x_min: number
    x_max: number
  }
}

export default function draggable<T>(
  Component: React.ComponentType<Partial<GraphProps> & T>
): React.FC<Partial<GraphProps> & DragProps & T> {
  return ({ ...props }: Partial<GraphProps> & DragProps & T) => {
    const {
      range: { x_min, x_max },
    } = props

    const ref = useRef<Drag>({
      dragging: false,
      start_mouse_x: null,
      start_x_min: null,
      start_x_max: null,
      x_min,
      x_max,
    })

    ref.current.x_min = x_min
    ref.current.x_max = x_max

    function reset() {
      ref.current.dragging = false
      ref.current.start_mouse_x = null
      ref.current.start_x_min = null
      ref.current.start_x_max = null
    }

    function on_mouse_down(
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
      mouse: Point | null,
      layout: Layout
    ) {
      if (mouse && math.is_inside(layout.graph, mouse)) {
        ref.current.dragging = true
        ref.current.start_mouse_x = mouse.x
        ref.current.start_x_min = ref.current.x_min
        ref.current.start_x_max = ref.current.x_max
      }
      if (props.on_mouse_down) {
        props.on_mouse_down(e, mouse, layout)
      }
    }

    function on_mouse_up(
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
      mouse: Point | null,
      layout: Layout
    ) {
      reset()
      if (props.on_mouse_up) {
        props.on_mouse_up(e, mouse, layout)
      }
    }

    function on_mouse_move(
      e: any,
      mouse: Point | null,
      layout: Layout,
      _: XRange | null
    ) {
      let x_range: XRange | null = null
      if (mouse && ref.current?.dragging) {
        x_range = get_x_range(ref.current, mouse, layout.graph)
      }
      if (props.on_mouse_move) {
        props.on_mouse_move(e, mouse, layout, x_range)
      }
    }

    function on_mouse_out(e: any, mouse: Point | null, layout: Layout) {
      reset()
      if (props.on_mouse_out) {
        props.on_mouse_out(e, mouse, layout)
      }
    }

    return (
      <Component
        {...props}
        on_mouse_down={on_mouse_down}
        on_mouse_up={on_mouse_up}
        on_mouse_move={on_mouse_move}
        on_mouse_out={on_mouse_out}
      />
    )
  }
}
