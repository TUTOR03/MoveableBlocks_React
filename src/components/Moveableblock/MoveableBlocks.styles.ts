import styled from 'styled-components'

type BlockProps = {
  height: number
  width: number
}

export const BlockContainer = styled.div<BlockProps>`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left top;
  background-color: white;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`

export const ControlHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid black;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ControlButton = styled.button`
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

  &.grab {
    cursor: grab;
  }
`
