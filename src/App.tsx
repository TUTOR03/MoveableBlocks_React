import React, { useEffect } from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { useBoard } from '@hooks/useBoard'
import { defaultDark, defaultLight } from './assets/theme'
import TestComponent from '@components/TestComponent'

const App: React.FC = () => {
  const {
    blocks,
    size,
    theme,
    activeState,
    changeActiveState,
    changePosition,
    createBlocks,
    drawBoard,
  } = useBoard({
    size: { height: 650, width: 650 },
    theme: defaultDark,
    useGrid: false,
  })

  return (
    <Container>
      <InfinityBoard
        blocks={blocks}
        theme={theme}
        activeState={activeState}
        changeActiveState={changeActiveState}
        changePosition={changePosition}
        size={size}
        drawBoard={drawBoard}
      />
    </Container>
  )
}

export default App
