import React, { useEffect } from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { useBoard } from '@hooks/useBoard'

const App: React.FC = () => {
  const { blocks, size, changeActiveBlock, changePosition, createBlocks } = useBoard({ height: 500, width: 500 })

  useEffect(() => {
    createBlocks([
      {
        type: 'block_empty',
        size: {
          height: 70,
          width: 100,
        },
        position: {
          x: 10,
          y: 10,
        },
        styles: {
          border: '1px solid black'
        },
      }, {
        type: 'block_empty',
        size: {
          height: 70,
          width: 100,
        },
        position: {
          x: 100,
          y: 100,
        },
        styles: {
          border: '1px solid black'
        }
      },
      {
        type: 'block_empty',
        size: {
          height: 70,
          width: 100,
        },
        position: {
          x: 200,
          y: 200,
        },
        styles: {
          border: '1px solid black'
        }
      }
    ])
  }, [])

  return (
    <Container>
      <InfinityBoard
        blocks={blocks}
        changeActiveBlock={changeActiveBlock}
        changePosition={changePosition}
        size={size}
      />
    </Container>
  )
}

export default App
