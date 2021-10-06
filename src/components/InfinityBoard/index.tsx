import MoveableBlock from '@components/MoveableBlock'
import WrapperBlock, { WrapperBlockProps } from '@components/WrapperBlock'
import {
  ActiveStateT,
  Block,
  ChangeActiveStateT,
  ChangePositionT,
  DrawBoardT,
  ThemeStyle,
} from '@type/infinityBoard'
import React, { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { Board, BoardCanvas } from './InfinityBoard.styles'

type InfinityBoardProps = {
  size: {
    width: number
    height: number
  }
  theme: ThemeStyle
  children: InfinityBoardChildrenT | []
  activeState: ActiveStateT
  changePosition: ChangePositionT
  changeActiveState: ChangeActiveStateT
  drawBoard: DrawBoardT
}

type InfinityBoardChildrenT =
  | React.ReactElement<InfinityBoardChildrenProps>[]
  | React.ReactElement<InfinityBoardChildrenProps>

type InfinityBoardChildrenProps = {
  block: Block
}

const InfinityBoard: React.FC<InfinityBoardProps> = ({
  size,
  theme,
  activeState,
  children,
  changePosition,
  changeActiveState,
  drawBoard,
}) => {
  // console.log(children)
  const boardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onGrabDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const board = boardRef.current
      if (board && e.target) {
        const boundingRect = board.getBoundingClientRect()
        const xDiff = e.clientX - boundingRect.left
        const yDiff = e.clientY - boundingRect.top
        changeActiveState({
          type: 'block',
          blockId: e.currentTarget.dataset.block_id || '',
          diff: { xDiff, yDiff },
        })
      }
    },
    [changeActiveState]
  )

  const onGrabUp = useCallback(() => {
    changeActiveState({ type: 'block', blockId: '' })
  }, [changeActiveState])

  const onConnectionClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const targetDataSet = e.currentTarget.dataset
      const board = boardRef.current
      if (board) {
        const boundingRect = board.getBoundingClientRect()
        const x = e.clientX - boundingRect.left
        const y = e.clientY - boundingRect.top
        changeActiveState({
          type: 'connection',
          blockId: targetDataSet.block_id || '',
          connectionIndex: parseInt(targetDataSet.connection_index || '0'),
        })
      }
    },
    [changeActiveState]
  )

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

  const mouseUpBoard = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.dataset.type === 'board'
      ) {
        changeActiveState({ type: 'connection_reset' })
      }
    },
    [changeActiveState]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        drawBoard(context)
      }
    }
  }, [changeActiveState])

  return (
    <Board
      onMouseMove={mouseMoveBoard}
      onMouseUp={mouseUpBoard}
      theme={theme}
      ref={boardRef}
      height={size.height}
      width={size.width}
    >
      <BoardCanvas
        ref={canvasRef}
        data-type="board"
        height={size.height}
        width={size.width}
      />
      {React.Children.map<any, React.ReactElement<InfinityBoardChildrenProps>>(
        children,
        (child) => (
          <MoveableBlock
            key={child.props.block.id}
            block={child.props.block}
            isTouchable={activeState.block.activeBlockId === ''}
            theme={theme}
            onGrabDown={onGrabDown}
            onGrabUp={onGrabUp}
            onConnectionClick={onConnectionClick}
          >
            {child}
          </MoveableBlock>
        )
      )}
    </Board>
  )
}

export default InfinityBoard
