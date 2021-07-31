import React from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'

const App: React.FC = () => {
  return (
    <Container>
      <InfinityBoard size={{ height: 500, width: 500 }} />
    </Container>
  )
}

export default App
