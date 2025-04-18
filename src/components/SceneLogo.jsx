import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ParticleLogo from './element/ParticleLogo'


export default function SceneLogo() {


  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
      <ambientLight intensity={0.5}/>
      <OrbitControls />
      <ParticleLogo />
    </Canvas>
  )
}

/*
    SERVE PER MOSTRARE L'ASSE X E Y PER CENTRARE GLI OGGETTI AL CENTRO DELLA SCENA 
    <axesHelper args={[5]} />

    SERVE PER AGGIUNGERE UNA GRIGLIA PER CAPIRE L'AMPIEZZA DELLA SCENA
    <gridHelper args={[10, 10]} />
 */