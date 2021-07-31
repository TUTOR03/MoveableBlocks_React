import MoveableBlock from '@components/Moveableblock'
import React, {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Board } from './InfinityBoard.styles'

type InfinityBoardProps = {
  size: {
    width: number
    height: number
  }
}

const InfinityBoard: React.FC<InfinityBoardProps> = ({ size }) => {
  const [grabbedState, setGrabbedState] = useState<{
    isGrabbed: boolean
    xDiff: number
    yDiff: number
  }>({
    isGrabbed: false,
    xDiff: 0,
    yDiff: 0,
  })
  const [blockPositionState, setBlockPositionState] = useState<{
    x: number
    y: number
  }>({ x: 20, y: 20 })
  const boardRef = useRef<HTMLDivElement>(null)

  const onGrabDown = (e: MouseEvent<HTMLButtonElement>) => {
    const board = boardRef.current
    if (board) {
      const boundingRect = board.getBoundingClientRect()
      const newXDiff = e.clientX - boundingRect.left - blockPositionState.x
      const newYDiff = e.clientY - boundingRect.top - blockPositionState.y
      setGrabbedState({
        isGrabbed: true,
        xDiff: newXDiff,
        yDiff: newYDiff,
      })
    }
  }

  const onGrabUp = (e: MouseEvent<HTMLButtonElement>) => {
    setGrabbedState((prev) => ({
      ...prev,
      isGrabbed: false,
    }))
  }

  const boardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const board = boardRef.current
    if (board) {
      const boundingRect = board.getBoundingClientRect()
      // console.log({
      //   x: e.clientX,
      //   y: e.clientY - boundingRect.top
      // })
      if (grabbedState.isGrabbed) {
        setBlockPositionState({
          x: e.clientX - boundingRect.left - grabbedState.xDiff,
          y: e.clientY - boundingRect.top - grabbedState.yDiff,
        })
      }
    }
  }

  return (
    <Board
      onMouseMove={boardMouseMove}
      ref={boardRef}
      height={size.height}
      width={size.width}
    >
      <MoveableBlock
        onGrabUp={onGrabUp}
        onGrabDown={onGrabDown}
        position={blockPositionState}
        width={160}
        height={90}
      >
        <h3>TEST text</h3>
      </MoveableBlock>
    </Board>
  )
}

export default InfinityBoard
