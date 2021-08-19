import MoveableBlock from '@components/Moveableblock'
import { Block, ChangeActiveBlockT, ChangePositionT } from '@type/infinityBoard'
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
  blocks: { [key: string]: Block }
  changePosition: ChangePositionT
  changeActiveBlock: ChangeActiveBlockT
}

const InfinityBoard: React.FC<InfinityBoardProps> = ({ size, blocks, changePosition, changeActiveBlock }) => {
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
    () => {
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
        changePosition(x, y)
      }
    },
    [changePosition]
  )

  return (
    <Board
      onMouseMove={mouseMoveBoard}
      ref={boardRef}
      height={size.height}
      width={size.width}
    >
      {
        Object.values(blocks).map((block) =>
          <MoveableBlock key={block.id} block={block} onGrabDown={onGrabDown} onGrabUp={onGrabUp} />)
      }

    </Board>
  )
}

export default InfinityBoard
