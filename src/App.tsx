import React, { useEffect, useState } from 'react'
import { Container } from '@styles/index'
import InfinityBoard from '@components/InfinityBoard'
import { useBoard } from '@hooks/useBoard'
import { defaultDark, defaultLight } from './assets/theme'
import WrapperBlock from '@components/WrapperBlock'

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

  const [tempState, setTempState] = useState(0)

  return (
    <Container>
      <InfinityBoard
        theme={theme}
        activeState={activeState}
        changeActiveState={changeActiveState}
        changePosition={changePosition}
        size={size}
        drawBoard={drawBoard}
      >
        {Object.values(blocks).map((block) => {
          return (
            <WrapperBlock key={block.id} block={block}>
              <h3>Hello</h3>
            </WrapperBlock>
          )
        })}
      </InfinityBoard>
    </Container>
  )
}

export default App
