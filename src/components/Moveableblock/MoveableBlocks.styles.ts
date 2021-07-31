import styled from 'styled-components'

type BlockProps = {
  height: number
  width: number
}

export const Block = styled.div<BlockProps>`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left top;
  background-color: white;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  -webkit-box-shadow: 0px 0px 10px 1px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 10px 1px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 10px 1px rgba(34, 60, 80, 0.2);
`

export const ControlHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid black;
  // Возможно я исправлю это )))
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
