import MoveableBlock from '@components/Moveableblock'
import { useBlocks } from '@hooks/useBlocks'
import { BlockType } from '@type/infinityBoard'
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Board } from './InfinityBoard.styles'

type InfinityBoardProps = {
  size: {
    width: number
    height: number
  }
  blocks: BlockType[]
}

const InfinityBoard: React.FC<InfinityBoardProps> = ({ size, blocks }) => {
  const {
    blockState,
    changeActiveBlock,
    changePosition,
    generateBlock,
    addBlocks,
    activeBlockState,
  } = useBlocks(size)
  const boardRef = useRef<HTMLDivElement>(null)

  const onGrabDown = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const board = boardRef.current
      if (board && e.target) {
        const boundingRect = board.getBoundingClientRect()
        const xDiff = e.clientX - boundingRect.left
        const yDiff = e.clientY - boundingRect.top
        changeActiveBlock(e.currentTarget.dataset.name || '', { xDiff, yDiff })
      }
    },
    [changeActiveBlock]
  )

  const onGrabUp = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      changeActiveBlock('')
    },
    [changeActiveBlock]
  )

  const mouseMoveBoard = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const board = boardRef.current
      if (board) {
        const boundingRect = board.getBoundingClientRect()
        const x = e.clientX - boundingRect.left
        const y = e.clientY - boundingRect.top
        changePosition({ x, y })
      }
    },
    [changePosition]
  )

  useEffect(() => {
    if (blocks) {
      addBlocks(
        Array.from(
          blocks.map((block, blockId) => {
            const generated = generateBlock(block)
            return [generated.id, generated]
          })
        )
      )
    }
  }, [])

  return (
    <Board
      onMouseMove={mouseMoveBoard}
      ref={boardRef}
      height={size.height}
      width={size.width}
    >
      {Object.values(blockState).map((block) => {
        switch (block.type) {
          case 'block_empty': {
            return (
              <MoveableBlock
                blockId={block.id}
                isActive={activeBlockState.activeId === block.id}
                onGrabUp={onGrabUp}
                onGrabDown={onGrabDown}
                position={block.position}
                size={block.size}
                key={block.id}
              />
            )
          }
        }
      })}
    </Board>
  )
}

export default InfinityBoard
