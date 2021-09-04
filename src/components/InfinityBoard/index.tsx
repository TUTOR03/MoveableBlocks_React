import MoveableBlock from '@components/Moveableblock'
import {
  Block,
  ChangeActiveBlockT,
  ChangeActiveConnectionT,
  ChangePositionT,
  DrawBoardT,
} from '@type/infinityBoard'
import React, { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { Board, BoardCanvas } from './InfinityBoard.styles'

type InfinityBoardProps = {
  size: {
    width: number
    height: number
  }
  blocks: { [key: string]: Block }
  changePosition: ChangePositionT
  changeActiveBlock: ChangeActiveBlockT
  changeActiveConnection: ChangeActiveConnectionT
  drawBoard: DrawBoardT
}

const InfinityBoard: React.FC<InfinityBoardProps> = ({
  size,
  blocks,
  changePosition,
  changeActiveBlock,
  changeActiveConnection,
  drawBoard,
}) => {
  const boardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const onGrabUp = useCallback(() => {
    changeActiveBlock('')
  }, [changeActiveBlock])

  const onConnectionClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const targetDataSet = e.currentTarget.dataset
    const board = boardRef.current
    if (board) {
      const boundingRect = board.getBoundingClientRect()
      const x = e.clientX - boundingRect.left
      const y = e.clientY - boundingRect.top
      changeActiveConnection(targetDataSet.block_id || '', parseInt(targetDataSet.connection_index || '0'), x, y)
    }
  }, [changeActiveConnection])

  const mouseMoveBoard = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const board = boardRef.current
      const canvas = canvasRef.current
      if (board && canvas) {
        const context = canvas.getContext('2d')
        const boundingRect = board.getBoundingClientRect()
        const x = e.clientX - boundingRect.left
        const y = e.clientY - boundingRect.top
        changePosition(x, y)
        if (context) {
          drawBoard(context)
        }
      }
    },
    [changePosition, drawBoard]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        drawBoard(context)
      }
    }
  }, [])

  return (
    <Board
      onMouseMove={mouseMoveBoard}
      ref={boardRef}
      height={size.height}
      width={size.width}
    >
      <BoardCanvas ref={canvasRef} height={size.height} width={size.width} />
      {Object.values(blocks).map((block) => (
        <MoveableBlock
          key={block.id}
          block={block}
          onGrabDown={onGrabDown}
          onGrabUp={onGrabUp}
          onConnectionClick={onConnectionClick}
        />
      ))}
    </Board>
  )
}

export default InfinityBoard
