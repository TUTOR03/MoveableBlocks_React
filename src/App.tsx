import React, { useEffect } from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { useBoard } from '@hooks/useBoard'

const App: React.FC = () => {
  const {
    blocks,
    size,
    changeActiveState,
    changePosition,
    createBlocks,
    drawBoard,
  } = useBoard({ height: 600, width: 600 })

  return (
    <Container>
      <InfinityBoard
        blocks={blocks}
        changeActiveState={changeActiveState}
        changePosition={changePosition}
        size={size}
        drawBoard={drawBoard}
      />
    </Container>
  )
}

export default App
