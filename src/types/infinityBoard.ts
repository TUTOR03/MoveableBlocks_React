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
}

export type Block = EmptyBlock

export enum BlockType {
  block_empty,
}

export interface EmptyBlock extends BaseBlock {
  type: 'block_empty'
}
