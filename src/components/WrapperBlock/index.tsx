import { Block } from '@type/infinityBoard'
import React from 'react'

export type WrapperBlockProps = {
  block: Block
}

const WrapperBlock: React.FC<WrapperBlockProps> = React.memo(() => {
  return (
    <>
      <h3>Hello</h3>
    </>
  )
})

export default WrapperBlock
