import {
  BaseBlockAction,
  Block,
  ChangeActiveStateProps,
  PositionT,
} from '@type/infinityBoard'
import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

type BlockStateT = {
  [key: string]: Block
}

type ActiveStateT = {
  block: {
    activeBlockId: string
    xDiff: number
    yDiff: number
  }
  connection: {
    activeBlockId: string
    activeConnectionIndex: number
    x: number
    y: number
  }
}

export const useBoard = (size: { width: number; height: number }) => {
  const [blockState, setBlockState] = useState<BlockStateT>({
    '1block': {
      id: '1block',
      size: {
        height: 100,
        width: 100,
      },
      position: {
        x: 10,
        y: 10,
      },
      styles: {
        border: '1px solid black',
      },
      connections: [
        {
          type: 'input',
          connectedBlockId: '',
        },
        {
          type: 'output',
          connectedBlockId: '',
        },
      ],
    },
    '2block': {
      id: '2block',
      size: {
        height: 100,
        width: 100,
      },
      position: {
        x: 150,
        y: 150,
      },
      styles: {
        border: '1px solid black',
      },
      connections: [
        {
          type: 'input',
          connectedBlockId: '',
        },
        {
          type: 'output',
          connectedBlockId: '',
        },
      ],
    },
    '3block': {
      id: '3block',
      size: {
        height: 100,
        width: 100,
      },
      position: {
        x: 300,
        y: 300,
      },
      styles: {
        border: '1px solid black',
      },
      connections: [
        {
          type: 'input',
          connectedBlockId: '',
        },
        {
          type: 'output',
          connectedBlockId: '',
        },
      ],
    }
  })

  const [activeState, setActiveState] = useState<ActiveStateT>({
    block: {
      activeBlockId: '',
      xDiff: 0,
      yDiff: 0,
    },
    connection: {
      activeBlockId: '',
      activeConnectionIndex: 0,
      x: 0,
      y: 0,
    },
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
            ...cur,
          },
        }
      }, {}),
    }))
  }

  const changeActiveState = useCallback(
    (action: ChangeActiveStateProps) => {
      switch (action.type) {
        case 'block': {
          setActiveState((prev) => ({
            ...prev,
            block: {
              activeBlockId: action.blockId,
              xDiff:
                action.blockId && action.diff
                  ? action.diff.xDiff - blockState[action.blockId].position.x
                  : 0,
              yDiff:
                action.blockId && action.diff
                  ? action.diff.yDiff - blockState[action.blockId].position.y
                  : 0,
            },
          }))
          break
        }
        case 'connection':
          {
            if (
              !activeState.connection.activeBlockId ||
              activeState.connection.activeBlockId === action.blockId
            ) {
              setActiveState((prev) => {
                if (!blockState[action.blockId].connections[action.connectionIndex].connectedBlockId) {
                  prev.connection = {
                    activeBlockId: action.blockId,
                    activeConnectionIndex: action.connectionIndex,
                    x: action.x,
                    y: action.y,
                  }
                }
                return prev
              })
            } else {
              const outBlock = blockState[activeState.connection.activeBlockId]
              const inBlock = blockState[action.blockId]
              if (
                outBlock.connections[
                  activeState.connection.activeConnectionIndex
                ].type !== inBlock.connections[action.connectionIndex].type &&
                !inBlock.connections[action.connectionIndex].connectedBlockId
              ) {
                outBlock.connections[
                  activeState.connection.activeConnectionIndex
                ].connectedBlockId = action.blockId
                inBlock.connections[action.connectionIndex].connectedBlockId =
                  activeState.connection.activeBlockId
                setBlockState((prev) => ({
                  ...prev,
                  [outBlock.id]: outBlock,
                  [inBlock.id]: inBlock,
                }))
                setActiveState((prev) => ({
                  ...prev,
                  connection: {
                    activeBlockId: '',
                    activeConnectionIndex: 0,
                    x: 0,
                    y: 0,
                  },
                }))
              }
            }
          }
          break
      }
    },
    [Object.keys(blockState).length, activeState]
  )

  /**
   * Изменение позиции активного блока
   */
  const changePosition = useCallback(
    (x: number, y: number): void => {
      if (activeState.block.activeBlockId) {
        setBlockState((prev) => {
          const nextPosition = calcNextPosition(
            prev,
            activeState.block.activeBlockId,
            x - activeState.block.xDiff,
            y - activeState.block.yDiff
          )
          return {
            ...prev,
            [activeState.block.activeBlockId]: {
              ...prev[activeState.block.activeBlockId],
              position: {
                ...nextPosition,
              },
            },
          }
        })
      }
      if (activeState.connection.activeBlockId) {
        setActiveState((prev) => ({
          ...prev,
          connection: {
            ...prev.connection,
            x,
            y,
          },
        }))
      }
    },
    [activeState]
  )

  /**
   * Отрисовка соединений и сети доски
   */
  const drawBoard = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size.width, size.height)

    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    for (let tempBlockId in blockState) {
      const block = blockState[tempBlockId]
      for (let connection of block.connections) {
        if (connection.type === 'output' && connection.connectedBlockId) {
          const startPosition = {
            x: block.position.x + Math.floor(block.size.width / 2),
            y: block.position.y + Math.floor(block.size.height / 2),
          }
          const endPosition = {
            x:
              blockState[connection.connectedBlockId].position.x +
              Math.floor(
                blockState[connection.connectedBlockId].size.width / 2
              ),
            y:
              blockState[connection.connectedBlockId].position.y +
              Math.floor(
                blockState[connection.connectedBlockId].size.height / 2
              ),
          }
          const points = calcConnectionPoints(startPosition, endPosition)
          for (
            let pointIndex = 0;
            pointIndex < points.length - 1;
            pointIndex++
          ) {
            ctx.moveTo(points[pointIndex].x, points[pointIndex].y)
            ctx.lineTo(points[pointIndex + 1].x, points[pointIndex + 1].y)
          }
        }
      }
    }
    if (activeState.connection.activeBlockId) {
      const block = blockState[activeState.connection.activeBlockId]
      const startPosition = {
        x: block.position.x + Math.floor(block.size.width / 2),
        y: block.position.y + Math.floor(block.size.height / 2),
      }
      const endPosition = {
        x: activeState.connection.x,
        y: activeState.connection.y,
      }
      const points = calcConnectionPoints(startPosition, endPosition)
      for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex++) {
        ctx.moveTo(points[pointIndex].x, points[pointIndex].y)
        ctx.lineTo(points[pointIndex + 1].x, points[pointIndex + 1].y)
      }
    }
    ctx.stroke()
  }

  /**
   * Вычисление точек соединительной линии
   */
  const calcConnectionPoints = (
    startPosition: PositionT,
    endPosition: PositionT
  ) => {
    const xMiddle = Math.round((startPosition.x + endPosition.x) / 2)
    const yMiddle = Math.round((startPosition.y + endPosition.y) / 2)
    let points = [startPosition]
    if (
      Math.abs(startPosition.x - endPosition.x) >=
      Math.abs(startPosition.y - endPosition.y)
    ) {
      points = [
        ...points,
        {
          x: xMiddle,
          y: startPosition.y,
        },
        {
          x: xMiddle,
          y: endPosition.y,
        },
      ]
    } else {
      points = [
        ...points,
        {
          x: startPosition.x,
          y: yMiddle,
        },
        {
          x: endPosition.x,
          y: yMiddle,
        },
      ]
    }
    return [...points, endPosition]
  }

  /**
   * Просчитывание следующей позиции, основываясь на новом положении курсора и предыдущей позиции
   */
  const calcNextPosition = (
    prev: BlockStateT,
    blockId: string,
    x: number,
    y: number
  ): PositionT => {
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
        if (
          prevY <= tempYDown &&
          prevYDown >= tempY &&
          ((xRight >= tempX && x <= tempX) ||
            (x <= tempXRight && xRight >= tempXRight))
        ) {
          xDone = false
        }
        if (
          prevXRight >= tempX &&
          prevX <= tempXRight &&
          ((y <= tempYDown && yDown >= tempYDown) ||
            (yDown >= tempY && y <= tempY))
        ) {
          yDone = false
        }
      }
    }
    return {
      x: xDone ? x : prev[blockId].position.x,
      y: yDone ? y : prev[blockId].position.y,
    }
  }

  return {
    blocks: blockState,
    size,
    changePosition,
    changeActiveState,
    createBlocks,
    drawBoard,
  }
}
