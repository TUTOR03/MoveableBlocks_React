import React from 'react'

/**
 * Типы блоков
 */
export type Block = {
  id: string
  size: {
    height: number
    width: number
  }
  position: PositionT
  styles?: React.CSSProperties
  connections: Connection[]
}

export type PositionT = {
  x: number
  y: number
}

export type BaseBlockAction = Omit<Block, 'id'>

/**
 * Типы соединений
 */

export type Connection = {
  type: 'input' | 'output'
  connectedBlockId: string
}

/**
 * Функции хука useBoard
 */
export type ChangePositionT = (x: number, y: number) => void

export type ChangeActiveStateT = (action: ChangeActiveStateProps) => void

export type ChangeActiveStateProps =
  | {
    type: 'block'
    blockId: string
    diff?: { xDiff: number; yDiff: number }
  }
  | {
    type: 'connection'
    blockId: string
    connectionIndex: number
  }

export type CalcNextPositionT = (
  prev: Block[],
  blockId: string,
  x: number,
  y: number
) => PositionT

export type CreateBlockT = (action: BaseBlockAction[]) => void

export type DrawBoardT = (ctx: CanvasRenderingContext2D) => void
