import React, {useState} from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ParticleLogo from './element/ParticleLogo'


export default function SceneLogo() {

  const [mouse, setMouse] = useState({ x: 0, y: 0 });


/*
  Questa funzione serve per posizionare il puntatore sulla scena 3D con precisione
  quindi l'effetto di esplosione avverrà perfettamente quando il mouse toccherà il 
  logo.
*/

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 30 }}
      onPointerMove={handlePointerMove}
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