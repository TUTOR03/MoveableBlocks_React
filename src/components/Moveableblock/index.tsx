import React, { MouseEvent, useEffect } from 'react'
import {
  BlockContainer,
  ControlButton,
  ControlConnector,
  ControlHeader,
} from './MoveableBlocks.styles'
import MoveArrow from '@icons/MoveArrow.svg'
import InputArrow from '@icons/InputArrow.svg'
import OutputArrow from '@icons/OutputArrow.svg'
import { Block } from '@type/infinityBoard'

type MoveableBlockProps = {
  block: Block
  onGrabDown: (e: MouseEvent<HTMLButtonElement>) => void
  onGrabUp: (e: MouseEvent<HTMLButtonElement>) => void
  onConnectionClick: (e: MouseEvent<HTMLDivElement>) => void
}

const MoveableBlock: React.FC<MoveableBlockProps> = React.memo(
  ({ block, onConnectionClick, onGrabDown, onGrabUp }) => {
    useEffect(() => {
      console.log(block.id)
    }, [onConnectionClick])
    return (
      <BlockContainer
        width={block.size.width}
        height={block.size.height}
        style={{
          ...block.styles,
          transform: `translate(${block.position.x}px,${block.position.y}px)`,
        }}
      >
        <ControlHeader>
          <ControlButton
            data-block_id={block.id}
            onMouseUp={onGrabUp}
            onMouseDown={onGrabDown}
            className="grab"
          >
            {/* Найти иконку побольше */}
            <MoveArrow />
          </ControlButton>
          {block.connections.map((connection, connectionIndex) => (
            <ControlConnector
              key={connectionIndex}
              data-block_id={block.id}
              data-connection_index={connectionIndex}
              onClick={onConnectionClick}
            >
              {connection.type === 'input' ? <InputArrow /> : <OutputArrow />}
            </ControlConnector>
          ))}
        </ControlHeader>
      </BlockContainer>
    )
  }
)

export default MoveableBlock
