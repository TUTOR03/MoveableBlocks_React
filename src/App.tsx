import React, { useEffect } from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { useBoard } from '@hooks/useBoard'

const App: React.FC = () => {
  const { blocks, size, changeActiveBlock, changePosition, createBlocks, drawBoard } = useBoard({ height: 500, width: 500 })

  return (
    <Container>
      <InfinityBoard
        blocks={blocks}
        changeActiveBlock={changeActiveBlock}
        changePosition={changePosition}
        size={size}
        drawBoard={drawBoard}
      />
    </Container>
  )
}

export default App
