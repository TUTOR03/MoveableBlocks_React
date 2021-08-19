import { BaseBlockAction, Block } from "@type/infinityBoard"
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
  const [blockState, setBlockState] = useState<BlockStateT>({})

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
    [Object.keys(blockState).length, activeBlockState]
  )

  /**
   * Просчитывание следующей позиции, основываясь на новом положении курсора и предыдущей позиции
   */
  const calcNextPosition = (prev: BlockStateT, blockId: string, x: number, y: number): {
    x: number,
    y: number
  } => {
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
    createBlocks
  }
}