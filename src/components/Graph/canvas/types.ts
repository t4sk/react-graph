export type CanvasContext = CanvasRenderingContext2D

export interface Context {
  axes: CanvasRenderingContext2D | null | undefined
  graph: CanvasRenderingContext2D | null | undefined
  ui: CanvasRenderingContext2D | null | undefined
}

export interface Point {
  x: number
  y: number
}

export interface Range {
  x_min: number
  x_max: number
  y_min: number
  y_max: number
}

export interface XRange {
  x_min: number
  x_max: number
}

export interface Box {
  top: number
  left: number
  height: number
  width: number
}

export interface Layout {
  graph: Box
  y_axis: Box
  x_axis: Box
}

export type XAxisAlign = "top" | "bottom"
export type YAxisAlign = "left" | "right"
export type TextAlign = "left" | "right"

export interface XAxis {
  x_axis_align: XAxisAlign
  x_axis_height: number
  x_axis_line_color: string
  x_axis_font: string
  x_axis_text_color: string
  show_x_line: boolean
  x_line_color: string
  x_ticks: number[]
  x_tick_interval: number
  x_tick_length: number
  render_x_tick?: (x: number) => string
}

export interface YAxis {
  y_axis_align: YAxisAlign
  y_axis_width: number
  y_axis_line_color: string
  y_axis_font: string
  y_axis_text_color: string
  show_y_line: boolean
  y_line_color: string
  y_ticks: number[]
  y_tick_interval: number
  y_tick_length: number
  render_y_tick?: (y: number) => string
}

export interface Crosshair {
  // canvas x, y
  point: Point | null
  show_x_line: boolean
  x_line_color: string
  x_line_width: number
  show_y_line: boolean
  y_line_color: string
  y_line_width: number
}

export interface Text {
  left: number
  top: number
  text: number | string
  color: string
  font: string
}

export interface XLabel {
  get_x?: (layout: Layout, range: Range) => number | null
  width: number
  height: number
  bg_color: string
  color: string
  font: string
  text_padding: number
  render?: (x: number) => string
  draw_line: boolean
  line_width: number
  line_color: string
}

export interface YLabel {
  get_y?: (layout: Layout, range: Range) => number | null
  width: number
  height: number
  bg_color: string
  color: string
  font: string
  text_padding: number
  render?: (y: number) => string
  draw_line: boolean
  line_width: number
  line_color: string
}

export interface Bar {
  x: number
  y: number
}

export interface BarGraph {
  data: Bar[]
  step: number
  get_bar_color: (bar: Bar) => string
  bar_width: number
  y0: number
}

export interface LineGraph {
  data: Point[]
  step: number
  line_color: string
  line_width: number
}

export interface PointGraph {
  data: Point[]
  color: string
  radius: number
  ambient_color: string
  ambient_radius: number
}

export interface BarGraphType extends Partial<BarGraph> {
  type: "bar"
}

export interface LineGraphType extends Partial<LineGraph> {
  type: "line"
}

export interface PointGraphType extends Partial<PointGraph> {
  type: "point"
}

export type Graph = BarGraphType | LineGraphType | PointGraphType
