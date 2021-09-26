import TestComponent from '@components/TestComponent'
import {
  BaseBlockAction,
  Block,
  ChangeActiveStateProps,
  initSettings,
  PositionT,
  ActiveStateT,
  contentWrapper,
} from '@type/infinityBoard'
import React, { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

type BlockStateT = {
  [key: string]: Block
}

export const useBoard = ({ size, theme }: initSettings) => {
  const [blockState, setBlockState] = useState<BlockStateT>({
    '1block': {
      id: '1block',
      size: { height: 170, width: 100 },
      position: {
        x: 10,
        y: 10,
      },
      // content: {
      //   component: TestComponent,
      //   props: {
      //     text: test_text,
      //   },
      // },
      // content: contentWrapper(TestComponent, { text: test_text }),
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
        height: 70,
        width: 100,
      },
      position: {
        x: 450,
        y: 450,
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
        height: 120,
        width: 150,
      },
      position: {
        x: 300,
        y: 300,
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
    },
  })

  const [mousePosition, setMousePosition] = useState<PositionT>({
    x: 0,
    y: 0,
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

  /**
   * Изменение активного состояния блоков и соединений
   */
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
                if (
                  !blockState[action.blockId].connections[
                    action.connectionIndex
                  ].connectedBlockId
                ) {
                  prev.connection = {
                    activeBlockId: action.blockId,
                    activeConnectionIndex: action.connectionIndex,
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
        case 'connection_reset':
          {
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
            y - activeState.block.yDiff,
            'get'
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
        setMousePosition({ x, y })
      }
    },
    [activeState]
  )

  /**
   * Отрисовка соединений и сетки доски
   */
  const drawBoard = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = theme.board.backgroundColor || theme.backgroundColor
    ctx.fillRect(0, 0, size.width, size.height)

    ctx.strokeStyle = theme.textColor
    ctx.fillStyle = theme.textColor
    for (let tempBlockId in blockState) {
      const block = blockState[tempBlockId]
      for (let connection of block.connections) {
        if (connection.type === 'output' && connection.connectedBlockId) {
          const inputBlock = blockState[connection.connectedBlockId]
          const startPosition = {
            x: block.position.x + Math.floor(block.size.width / 2),
            y: block.position.y + Math.floor(block.size.height / 2),
          }
          const endPosition = {
            x: inputBlock.position.x + Math.floor(inputBlock.size.width / 2),
            y: inputBlock.position.y + Math.floor(inputBlock.size.height / 2),
          }

          const points = calcConnectionPoints(startPosition, endPosition)
          drawConnections(ctx, points)

          drawArrow(
            ctx,
            inputBlock,
            points[points.length - 1],
            points[points.length - 2]
          )
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
        x: mousePosition.x,
        y: mousePosition.y,
      }
      const points = calcConnectionPoints(startPosition, endPosition)
      drawConnections(ctx, points)
    }
  }

  /**
   * Отрисовка указателя направления соединения
   */
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    block: Block,
    lastPoint: PositionT,
    prevLastPoint: PositionT
  ) => {
    let addRotation = 0
    let inputArrowPosition = {
      x: block.position.x + block.size.width / 2,
      y: block.position.y + block.size.height / 2,
    }

    if (lastPoint.y - prevLastPoint.y === 0) {
      if (lastPoint.x - prevLastPoint.x >= 0) {
        addRotation = 0
        inputArrowPosition.x -= block.size.width / 2
      } else {
        addRotation = Math.PI
        inputArrowPosition.x += block.size.width / 2
      }
    } else if (lastPoint.x - prevLastPoint.x === 0) {
      if (lastPoint.y - prevLastPoint.y >= 0) {
        addRotation = Math.PI / 2
        inputArrowPosition.y -= block.size.height / 2
      } else {
        addRotation = -Math.PI / 2
        inputArrowPosition.y += block.size.height / 2
      }
    }

    ctx.beginPath()
    ctx.save()
    ctx.translate(inputArrowPosition.x, inputArrowPosition.y)
    ctx.moveTo(0, 0)
    ctx.rotate(addRotation)
    Array(2)
      .fill(0)
      .forEach((_) => {
        ctx.rotate(-Math.PI / 3)
        ctx.lineTo(0, -10)
      })
    ctx.restore()
    ctx.closePath()
    ctx.fill()
  }

  /**
   * Отрисовка соединений
   */
  const drawConnections = (
    ctx: CanvasRenderingContext2D,
    points: PositionT[]
  ) => {
    ctx.beginPath()
    for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex++) {
      ctx.moveTo(points[pointIndex].x, points[pointIndex].y)
      ctx.lineTo(points[pointIndex + 1].x, points[pointIndex + 1].y)
    }
    ctx.closePath()
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

  function calcNextPosition(
    prev: BlockStateT,
    blockId: string,
    x: number,
    y: number,
    isRetry: 'get'
  ): PositionT
  function calcNextPosition(
    prev: BlockStateT,
    blockId: string,
    x: number,
    y: number,
    isRetry: 'check'
  ): {
    x: boolean
    y: boolean
  }
  function calcNextPosition(
    prev: BlockStateT,
    blockId: string,
    x: number,
    y: number,
    isRetry: 'get' | 'check'
  ) {
    let xNew = x
    let yNew = y
    const xRight = x + prev[blockId].size.width - 1
    const yDown = y + prev[blockId].size.height - 1

    let xOk = true
    let yOk = true

    const prevX = prev[blockId].position.x
    const prevY = prev[blockId].position.y
    const prevXRight = prevX + prev[blockId].size.width - 1
    const prevYDown = prevY + prev[blockId].size.height - 1

    for (let tempBlockId in prev) {
      if (tempBlockId !== blockId) {
        const tempX = prev[tempBlockId].position.x
        const tempY = prev[tempBlockId].position.y
        const tempXRight = tempX + prev[tempBlockId].size.width - 1
        const tempYDown = tempY + prev[tempBlockId].size.height - 1

        if (prevYDown >= tempY && prevY <= tempYDown) {
          const xCon = x <= tempXRight && xRight >= tempX
          if (isRetry === 'get' && xCon) {
            if (
              xRight <=
              tempX +
                Math.ceil(prev[tempBlockId].size.width / 2) +
                Math.ceil(prev[blockId].size.width / 2)
            ) {
              xNew = tempX - prev[blockId].size.width
            } else {
              xNew = tempXRight + 1
            }
          } else {
            xOk = !xCon
          }
        }

        if (prevXRight >= tempX && prevX <= tempXRight) {
          const yCon = y <= tempYDown && yDown >= tempY

          if (isRetry === 'get' && yCon) {
            if (
              yDown <=
              tempY +
                Math.ceil(prev[tempBlockId].size.height / 2) +
                Math.ceil(prev[blockId].size.height / 2)
            ) {
              yNew = tempY - prev[blockId].size.height
            } else {
              yNew = tempYDown + 1
            }
          } else {
            yOk = !yCon
          }
        }
      }
    }

    if (isRetry === 'get') {
      const isOk = calcNextPosition(prev, blockId, xNew, yNew, 'check')
      xNew = isOk.x ? xNew : prevX
      xNew = xNew >= 0 && xRight < size.width ? xNew : prevX

      yNew = isOk.y ? yNew : prevY
      yNew = yNew >= 0 && yDown < size.height ? yNew : prevY
      return {
        x: xNew,
        y: yNew,
      }
    } else if (isRetry === 'check') {
      xOk = xOk ? xNew >= 0 && xRight < size.width : xOk
      yOk = yOk ? yNew >= 0 && yDown < size.height : yOk

      return {
        x: xOk,
        y: yOk,
      }
    }
  }

  return {
    blocks: blockState,
    activeState,
    size,
    theme,
    changePosition,
    changeActiveState,
    createBlocks,
    drawBoard,
  }
}
