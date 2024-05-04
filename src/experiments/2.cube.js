import { Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import { R3FCanvasLayout } from '../components/layout/r3f-canvas-layout'

const Cube = () => {
  const boxRef = useRef()

  useFrame(() => {
    boxRef.current.rotation.x += 0.01
    boxRef.current.rotation.y += 0.01
  })

  return (
    <Box ref={boxRef}>
      <meshNormalMaterial />
    </Box>
  )
}

Cube.Layout = R3FCanvasLayout
Cube.Title = 'Three.js Cube'
Cube.Description =
  'This is just a cube'
Cube.Tags = ['r3f']

export default Cube
