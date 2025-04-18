import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ImmagineParticella from './element/ImmagineParticella'

export default function SceneThree() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <ImmagineParticella url="/welcome_3d_text_logo.glb" />
    </Canvas>
  )
}