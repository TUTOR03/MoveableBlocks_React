import React, { MouseEvent } from 'react'
import { Block, ControlButton, ControlHeader } from './MoveableBlocks.styles'
import MoveArrow from '@icons/MoveArrow.svg'

type MoveableBlockProps = {
  height: number
  width: number
  position: {
    x: number
    y: number
  }
  onGrabDown: (e: MouseEvent<HTMLButtonElement>) => void
  onGrabUp: (e: MouseEvent<HTMLButtonElement>) => void
}

const MoveableBlock: React.FC<MoveableBlockProps> = ({
  width,
  height,
  children,
  position,
  onGrabDown,
  onGrabUp,
}) => {
  return (
    <Block
      width={width}
      height={height}
      style={{ transform: `translate(${position.x}px,${position.y}px)` }}
    >
      <ControlHeader>
        <ControlButton
          onMouseUp={onGrabUp}
          onMouseDown={onGrabDown}
          className="grab"
        >
          {/* Найти иконку побольше */}
          <MoveArrow />
        </ControlButton>
      </ControlHeader>
      {children}
    </Block>
  )
}

export default MoveableBlock
