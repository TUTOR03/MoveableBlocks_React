import { BaseBlock, Block, BlockType } from '@type/infinityBoard'
import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type blockStateT = {
  [key: string]: Block
}

export const useBlocks = (size: { width: number; height: number }) => {
  const [blockState, setBlockState] = useState<blockStateT>({})
  const [activeBlockState, setActiveBlockState] = useState<{
    activeId: string
    xDiff: number
    yDiff: number
  }>({
    activeId: '',
    xDiff: 0,
    yDiff: 0,
  })

  const addBlocks = (newBlocks: [string, Block][]) => {
    setBlockState((prev) => ({
      ...prev,
      ...Object.fromEntries(newBlocks),
    }))
  }

  const generateBlock = (blockType: BlockType): Block => {
    switch (blockType) {
      case BlockType.block_empty: {
        return {
          id: uuidv4(),
          type: 'block_empty',
          size: {
            height: 70,
            width: 100,
          },
          position: {
            x: 10,
            y: 10,
          },
        }
      }
    }
  }

  const changeActiveBlock = useCallback(
    (blockId: string, diff?: { xDiff: number; yDiff: number }) => {
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

  const changePosition = useCallback(
    (newPosition: { x: number; y: number }) => {
      if (activeBlockState.activeId) {
        setBlockState((prev) => ({
          ...prev,
          [activeBlockState.activeId]: {
            ...prev[activeBlockState.activeId],
            position: {
              // Надо придумать как это нормально сделать
              x:
                newPosition.x - activeBlockState.xDiff >= 0
                  ? newPosition.x -
                      activeBlockState.xDiff +
                      blockState[activeBlockState.activeId].size.width <=
                    size.width
                    ? newPosition.x - activeBlockState.xDiff
                    : size.width -
                      1 -
                      blockState[activeBlockState.activeId].size.width
                  : 0,
              y:
                newPosition.y - activeBlockState.yDiff >= 0
                  ? newPosition.y -
                      activeBlockState.yDiff +
                      blockState[activeBlockState.activeId].size.height <=
                    size.height
                    ? newPosition.y - activeBlockState.yDiff
                    : size.height -
                      1 -
                      blockState[activeBlockState.activeId].size.height
                  : 0,
            },
          },
        }))
      }
    },
    [Object.keys(blockState).length, activeBlockState]
  )

  return {
    blockState,
    changeActiveBlock,
    changePosition,
    generateBlock,
    addBlocks,
    activeBlockState,
  }
}
