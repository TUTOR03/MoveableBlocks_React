import React, { MouseEvent } from 'react'
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
  ({ block, onGrabDown, onGrabUp, onConnectionClick }) => {
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
            data-name={block.id}
            onMouseUp={onGrabUp}
            onMouseDown={onGrabDown}
            className="grab"
          >
            {/* Найти иконку побольше */}
            <MoveArrow />
          </ControlButton>
          {block.type === 'in_out_block' &&
            block.connections.map((connection, connectionIndex) => (
              <ControlConnector
                key={connectionIndex}
                color={connection.type === 'input' ? '#ff0000' : '#00ff00'}
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
