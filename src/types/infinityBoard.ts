import React from 'react'

/**
 * Типы блоков
 */
export interface BaseBlock {
  id: string
  size: {
    height: number
    width: number
  }
  position: PositionT
  styles?: React.CSSProperties
}

export type PositionT = {
  x: number
  y: number
}

export type Block = EmptyBlock | InOutBlock

export type BaseBlockAction = Omit<Block, 'id'>

export interface EmptyBlock extends BaseBlock {
  type: 'empty_block'
}

export interface InOutBlock extends BaseBlock {
  type: 'in_out_block'
  connections: [InputConnection, OutputConnection]
}

/**
 * Типы соединений
 */

export type Connection = InputConnection | OutputConnection

export type InputConnection = {
  type: 'input'
  connectedBlockId: string
}

export type OutputConnection = {
  type: 'output'
  connectedBlockId: string
}

/**
 * Функции хука useBoard
 */
export type ChangePositionT = (x: number, y: number) => void

export type ChangeActiveBlockT = (
  blockId: string,
  diff?: { xDiff: number; yDiff: number }
) => void

export type ChangeActiveConnectionT = (
  blockId: string,
  connectionIndex: number,
  x: number,
  y: number
) => void

export type CalcNextPositionT = (
  prev: Block[],
  blockId: string,
  x: number,
  y: number
) => PositionT

export type CreateBlockT = (action: BaseBlockAction[]) => void

export type DrawBoardT = (ctx: CanvasRenderingContext2D) => void
