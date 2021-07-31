import styled from 'styled-components'

type BoardProps = {
  height: number
  width: number
}

export const Board = styled.div<BoardProps>`
  position: relative;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: white;
  border: 1px solid black;
  -webkit-box-shadow: 0px 0px 10px 1px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 10px 1px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 10px 1px rgba(34, 60, 80, 0.2);
`
