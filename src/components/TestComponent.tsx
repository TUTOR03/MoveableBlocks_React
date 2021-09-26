import React from 'react'

type TestcomponentProps = {
  text: number
}

const TestComponent: React.FC<TestcomponentProps> = ({ text }) => {
  return <div>{text}</div>
}

export default TestComponent
