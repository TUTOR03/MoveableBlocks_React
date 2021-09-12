import React, { useEffect } from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { useBoard } from '@hooks/useBoard'
import { defaultDark, defaultLight } from './assets/theme'

const App: React.FC = () => {
  const {
    blocks,
    size,
    theme,
    changeActiveState,
    changePosition,
    createBlocks,
    drawBoard,
  } = useBoard({ size: { height: 600, width: 600 }, theme: defaultDark, useGrid: false })

  return (
    <Container>
      <InfinityBoard
        blocks={blocks}
        theme={theme}
        changeActiveState={changeActiveState}
        changePosition={changePosition}
        size={size}
        drawBoard={drawBoard}
      />
    </Container>
  )
}

export default App
