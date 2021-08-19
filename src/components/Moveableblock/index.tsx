import React, { MouseEvent } from 'react'
import { BlockContainer, ControlButton, ControlHeader } from './MoveableBlocks.styles'
import MoveArrow from '@icons/MoveArrow.svg'
import { Block } from '@type/infinityBoard'

type MoveableBlockProps = {
  block: Block
  onGrabDown: (e: MouseEvent<HTMLButtonElement>) => void
  onGrabUp: (e: MouseEvent<HTMLButtonElement>) => void
}

const MoveableBlock: React.FC<MoveableBlockProps> = React.memo(
  ({ block, onGrabDown, onGrabUp }) => {
    return (
      <BlockContainer
        width={block.size.width}
        height={block.size.height}
        style={{
          ...block.styles,
          transform: `translate(${block.position.x}px,${block.position.y}px)`
        }}
      >
        <ControlHeader>
          <ControlButton
            data-name={block.id}
            onMouseUp={onGrabUp}
            onMouseDown={onGrabDown}
            className="grab"
          >
            {/* Найти иконку побольше */}
            <MoveArrow />
          </ControlButton>
        </ControlHeader>
      </BlockContainer>
    )
  }
)

export default MoveableBlock
