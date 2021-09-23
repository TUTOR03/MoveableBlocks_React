import React from 'react'

type TestcomponentProps = {
  text: string
  data: number
}

const TestComponent: React.FC<TestcomponentProps> = ({ text }) => {
  return <div>{text}</div>
}

export default TestComponent
