import React from 'react'
import { Stage, Container, Text } from '@pixi/react'

function Game() {
  return (
    <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-50'>
      <Stage options={{ backgroundColor: 0xeef1f5 }}>
        <Container >
          <Text text="Hello World" anchor={0.5}
            x={150}
            y={150} />
        </Container>
      </Stage>
    </div>
  )
}

export default Game