import { ThemeStyle } from '@type/infinityBoard'
import styled from 'styled-components'

type BoardProps = {
  height: number
  width: number
  theme: ThemeStyle
}

type BoardCanvasProps = {
  height: number
  width: number
}

export const Board = styled.div<BoardProps>`
  position: relative;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  box-sizing: content-box;
  box-shadow: ${(props) => props.theme.board.shadow};
  border: ${(props) =>
    props.theme.board.borderColor
      ? `1px solid ${props.theme.board.borderColor}`
      : ''};
`

export const BoardCanvas = styled.canvas<BoardCanvasProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`
