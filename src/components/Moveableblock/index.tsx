import React, { MouseEvent, useEffect } from 'react'
import { Block, ControlButton, ControlHeader } from './MoveableBlocks.styles'
import MoveArrow from '@icons/MoveArrow.svg'

type MoveableBlockProps = {
  size: {
    height: number
    width: number
  }
  blockId: string
  position: {
    x: number
    y: number
  }
  isActive: boolean
  onGrabDown: (e: MouseEvent<HTMLButtonElement>) => void
  onGrabUp: (e: MouseEvent<HTMLButtonElement>) => void
}

const MoveableBlock: React.FC<MoveableBlockProps> = React.memo(
  ({ size, blockId, isActive, position, onGrabDown, onGrabUp }) => {
    return (
      <Block
        width={size.width}
        height={size.height}
        style={{
          transform: `translate(${position.x}px,${position.y}px)`,
          zIndex: isActive ? 2 : 1,
        }}
      >
        <ControlHeader>
          <ControlButton
            data-name={blockId}
            onMouseUp={onGrabUp}
            onMouseDown={onGrabDown}
            className="grab"
          >
            {/* Найти иконку побольше */}
            <MoveArrow />
          </ControlButton>
        </ControlHeader>
        <h5>empty Block</h5>
      </Block>
    )
  }
)

export default MoveableBlock
