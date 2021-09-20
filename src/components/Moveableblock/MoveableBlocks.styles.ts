import { ThemeStyle } from '@type/infinityBoard'
import styled from 'styled-components'

type BlockProps = {
  height: number
  width: number
  isTouchable: boolean
  theme: ThemeStyle
}

type HeaderProps = {
  theme: ThemeStyle
}

export const BlockContainer = styled.div<BlockProps>`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left top;
  box-shadow: ${(props) => props.theme.block.shadow};
  background-color: ${(props) =>
    props.theme.block.backgroundColor || props.theme.backgroundColor};
  border: ${(props) =>
    props.theme.block.borderColor
      ? `1px solid ${props.theme.board.borderColor}`
      : ''};
  border-radius: ${(props) => props.theme.block.borderRadius};
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  user-select: ${(props) => (props.isTouchable ? '' : 'none')};
`

export const ControlHeader = styled.div<HeaderProps>`
  width: 100%;
  height: 32px;
  display: flex;
  color: ${(props) =>
    props.theme.block.header.iconColor || props.theme.textColor};
  justify-content: ${(props) => props.theme.block.header.justifyContent};
  border-bottom: 1px solid
    ${(props) => props.theme.block.header.borderColor || props.theme.textColor};
  align-items: center;
`

const ControlElement = styled.div`
  height: 32px;
  width: 32px;
  border: none;
  background: none;
  text-align: center;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export const ControlMoveButton = styled(ControlElement)`
  cursor: grab;
`

export const ControlConnector = styled(ControlElement)``
