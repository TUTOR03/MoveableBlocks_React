import styled from 'styled-components'

type BoardProps = {
  height: number
  width: number
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
  background-color: white;
  border: 1px solid red;
`

export const BoardCanvas = styled.canvas<BoardCanvasProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`
