import { BaseBlockAction, Block, PositionT } from "@type/infinityBoard"
import { useState, useCallback } from "react"
import { v4 as uuidv4 } from 'uuid'

type BlockStateT = {
  [key: string]: Block
}

type ActiveStateT = {
  activeId: string
  xDiff: number
  yDiff: number
}

export const useBoard = (size: { width: number, height: number }) => {
  const [blockState, setBlockState] = useState<BlockStateT>({
    '1block': {
      id: '1block',
      type: 'in_out_block',
      size: {
        height: 100,
        width: 100,
      },
      position: {
        x: 10,
        y: 10,
      },
      styles: {
        border: '1px solid black'
      },
      connections: [
        {
          type: 'input',
          outputBlockId: ''
        },
        {
          type: 'output',
          inputBlockid: '2block'

        }
      ]
    },
    '2block': {
      id: '2block',
      type: 'empty_block',
      size: {
        height: 100,
        width: 100,
      },
      position: {
        x: 100,
        y: 100,
      },
      styles: {
        border: '1px solid black'
      }
    },
  })

  const [activeBlockState, setActiveBlockState] = useState<ActiveStateT>({
    activeId: '',
    xDiff: 0,
    yDiff: 0,
  })

  /**
   * Создание новых блоков
   */
  const createBlocks = (actions: BaseBlockAction[]): void => {
    setBlockState((prev) => ({
      ...prev,
      ...actions.reduce((acc, cur) => {
        const blockId = uuidv4()
        return {
          ...acc,
          [blockId]: {
            id: blockId,
            ...cur
          }
        }
      }, {})
    }))
  }

  /**
   * Изменение Id активного блока
   */
  const changeActiveBlock = useCallback(
    (blockId: string, diff?: { xDiff: number; yDiff: number }): void => {
      setActiveBlockState({
        activeId: blockId,
        xDiff:
          blockId && diff ? diff.xDiff - blockState[blockId].position.x : 0,
        yDiff:
          blockId && diff ? diff.yDiff - blockState[blockId].position.y : 0,
      })
    },
    [Object.keys(blockState).length, activeBlockState]
  )

  /**
   * Изменение позиции активного блока
   */
  const changePosition = useCallback(
    (x: number, y: number): void => {
      if (activeBlockState.activeId) {
        setBlockState((prev) => {
          const nextPosition = calcNextPosition(prev, activeBlockState.activeId, x - activeBlockState.xDiff, y - activeBlockState.yDiff)
          return {
            ...prev,
            [activeBlockState.activeId]: {
              ...prev[activeBlockState.activeId],
              position: {
                ...nextPosition
              },
            },
          }
        })

      }
    },
    [activeBlockState]
  )

  /**
   * Отрисовка соединений и сети доски
   */
  const drawBoard = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size.width, size.height)

    ctx.strokeStyle = '#ff0000'
    ctx.beginPath()
    for (let tempBlockId in blockState) {
      const block = blockState[tempBlockId]
      if ('connections' in block) {
        for (let connection of block.connections) {
          if (connection.type === 'output' && connection.inputBlockid) {
            const startPosition = {
              x: block.position.x + Math.floor(block.size.width / 2),
              y: block.position.y + Math.floor(block.size.height / 2)
            }
            const endPosition = {
              x: blockState[connection.inputBlockid].position.x + Math.floor(blockState[connection.inputBlockid].size.width / 2),
              y: blockState[connection.inputBlockid].position.y + Math.floor(blockState[connection.inputBlockid].size.height / 2)
            }
            const points = calcConnectionPoints(startPosition, endPosition)
            for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex++) {
              ctx.moveTo(points[pointIndex].x, points[pointIndex].y)
              ctx.lineTo(points[pointIndex + 1].x, points[pointIndex + 1].y)
            }
          }
        }
      }
    }
    ctx.stroke()
  }

  /**
   * Вычисление точек соединительной линии
   */
  const calcConnectionPoints = (startPosition: PositionT, endPosition: PositionT) => {
    const xMiddle = Math.round((startPosition.x + endPosition.x) / 2)
    const yMiddle = Math.round((startPosition.y + endPosition.y) / 2)
    let points = [startPosition]
    if (Math.abs(startPosition.x - endPosition.x) >= Math.abs(startPosition.y - endPosition.y)) {
      points = [
        ...points,
        {
          x: xMiddle,
          y: startPosition.y
        },
        {
          x: xMiddle,
          y: endPosition.y
        }
      ]
    }
    else {
      points = [
        ...points,
        {
          x: startPosition.x,
          y: yMiddle,
        },
        {
          x: endPosition.x,
          y: yMiddle
        }
      ]
    }
    return [
      ...points,
      endPosition
    ]
  }

  /**
   * Просчитывание следующей позиции, основываясь на новом положении курсора и предыдущей позиции
   */
  const calcNextPosition = (prev: BlockStateT, blockId: string, x: number, y: number): PositionT => {
    let xDone = true
    let yDone = true
    const xRight = x + prev[blockId].size.width - 1
    const yDown = y + prev[blockId].size.height - 1
    const prevX = prev[blockId].position.x
    const prevY = prev[blockId].position.y
    const prevXRight = prevX + prev[blockId].size.width - 1
    const prevYDown = prevY + prev[blockId].size.height - 1
    if (x < 0 || xRight >= size.width) {
      xDone = false
    }
    if (y < 0 || yDown >= size.height) {
      yDone = false
    }
    for (let tempBlockId in prev) {
      if (tempBlockId !== blockId) {
        const tempX = prev[tempBlockId].position.x
        const tempY = prev[tempBlockId].position.y
        const tempXRight = tempX + prev[tempBlockId].size.width - 1
        const tempYDown = tempY + prev[tempBlockId].size.height - 1
        if (prevY <= tempYDown && prevYDown >= tempY && ((xRight >= tempX && x <= tempX) || (x <= tempXRight && xRight >= tempXRight))) {
          xDone = false
        }
        if (prevXRight >= tempX && prevX <= tempXRight && ((y <= tempYDown && yDown >= tempYDown) || (yDown >= tempY && y <= tempY))) {
          yDone = false
        }
      }
    }
    return {
      x: xDone ? x : prev[blockId].position.x,
      y: yDone ? y : prev[blockId].position.y
    }
  }

  return {
    blocks: blockState,
    activeBlock: activeBlockState,
    size,
    changePosition,
    changeActiveBlock,
    createBlocks,
    drawBoard
  }
}