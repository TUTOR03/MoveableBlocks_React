import React from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { BlockType } from '@type/infinityBoard'

const App: React.FC = () => {
  return (
    <Container>
      <InfinityBoard
        blocks={[BlockType.block_empty, BlockType.block_empty]}
        size={{ height: 500, width: 500 }}
      />
    </Container>
  )
}

export default App
