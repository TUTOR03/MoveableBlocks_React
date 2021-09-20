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
  connections: Connection[]
}

export type PositionT = {
  x: number
  y: number
}

export type ActiveStateT = {
  block: {
    activeBlockId: string
    xDiff: number
    yDiff: number
  }
  connection: {
    activeBlockId: string
    activeConnectionIndex: number
  }
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
  | {
      type: 'connection_reset'
    }

export type CalcNextPositionT = (
  prev: Block[],
  blockId: string,
  x: number,
  y: number
) => PositionT

export type CreateBlockT = (action: BaseBlockAction[]) => void

export type DrawBoardT = (ctx: CanvasRenderingContext2D) => void

/**
 * Настройки инициализации
 */
export type initSettings = {
  size: {
    width: number
    height: number
  }
  useGrid: boolean
  theme: ThemeStyle
}

/**
 * Темы стилей
 */

// TODO: Придумать полезные параметры кастомизации
export type ThemeStyle = {
  mainColor: string
  secondColor: string
  backgroundColor: string
  textColor: string
  board: {
    backgroundColor?: string
    borderColor?: string
    shadow?: string
  }
  block: {
    shadow?: string
    borderColor?: string
    backgroundColor?: string
    borderRadius?: string
    header: {
      justifyContent?: string
      iconColor?: string
      borderColor?: string
    }
    content: {}
  }
}
