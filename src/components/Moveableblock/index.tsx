import React, { MouseEvent, useEffect } from 'react'
import {
  BlockContainer,
  ControlMoveButton,
  ControlConnector,
  ControlHeader,
  UserContent,
} from './MoveableBlocks.styles'
import MoveArrow from '@icons/MoveArrow.svg'
import InputArrow from '@icons/InputArrow.svg'
import OutputArrow from '@icons/OutputArrow.svg'
import { Block, ThemeStyle } from '@type/infinityBoard'

type MoveableBlockProps = {
  block: Block
  theme: ThemeStyle
  isTouchable: boolean
  onGrabDown: (e: MouseEvent<HTMLDivElement>) => void
  onGrabUp: (e: MouseEvent<HTMLDivElement>) => void
  onConnectionClick: (e: MouseEvent<HTMLDivElement>) => void
}

const MoveableBlock: React.FC<MoveableBlockProps> = React.memo(
  ({ block, theme, isTouchable, onConnectionClick, onGrabDown, onGrabUp }) => {
    // const { component, props } = block.content()
    return (
      <BlockContainer
        width={block.size.width}
        height={block.size.height}
        isTouchable={isTouchable}
        theme={theme}
        style={{
          transform: `translate(${block.position.x}px,${block.position.y}px)`,
        }}
      >
        <ControlHeader theme={theme}>
          <ControlMoveButton
            data-block_id={block.id}
            onMouseUp={onGrabUp}
            onMouseDown={onGrabDown}
            className="grab"
          >
            <MoveArrow />
          </ControlMoveButton>
          {block.connections.map((connection, connectionIndex) => (
            <ControlConnector
              key={connectionIndex}
              data-block_id={block.id}
              data-connection_index={connectionIndex}
              onClick={onConnectionClick}
              className="connection"
            >
              {connection.type === 'input' ? <InputArrow /> : <OutputArrow />}
            </ControlConnector>
          ))}
        </ControlHeader>
        <UserContent>
          {/* {block.content &&
            React.createElement(block.content.component, block.content.props)} */}
        </UserContent>
      </BlockContainer>
    )
  }
)

export default MoveableBlock
