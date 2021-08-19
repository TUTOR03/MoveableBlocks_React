import React from "react"

/**
 * Типы блоков
 */
export interface BaseBlock {
  id: string
  size: {
    height: number
    width: number
  }
  position: {
    x: number
    y: number
  }
  styles?: React.CSSProperties
}

export type Block = EmptyBlock

export type BaseBlockAction = Omit<Block, 'id'>

export interface EmptyBlock extends BaseBlock {
  type: 'block_empty'
}

/**
 * Функции хука useBoard
 */
export type ChangePositionT = (x: number, y: number) => void

export type ChangeActiveBlockT = (blockId: string, diff?: { xDiff: number; yDiff: number }) => void

export type CalcNextPositionT = (prev: Block[], blockId: string, x: number, y: number) => { x: number, y: number }

export type CreateBlockT = (action: BaseBlockAction[]) => void