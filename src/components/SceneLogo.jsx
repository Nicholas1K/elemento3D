import React, {useState} from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ParticleLogo from './element/ParticleLogo'


export default function SceneLogo() {

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 30 }}
      onPointerMove={(e) => {
        setMouse({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
      }}
    >
      <ambientLight intensity={0.5}/>
      <ParticleLogo mouse={mouse}/>
    </Canvas>
  )
}

/*
    SERVE PER MOSTRARE L'ASSE X E Y PER CENTRARE GLI OGGETTI AL CENTRO DELLA SCENA 
    <axesHelper args={[5]} />

    SERVE PER AGGIUNGERE UNA GRIGLIA PER CAPIRE L'AMPIEZZA DELLA SCENA
    <gridHelper args={[10, 10]} />

    SERVE A MUOVERE IN 3D CIò CHE C'è SULLA SCENA 
    <OrbitControls /> ha anche diverse opzioni tipo: autoRotate autoRotateSpeed={0.5}
 */