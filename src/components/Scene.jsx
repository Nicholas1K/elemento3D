import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import MovingSphere from "./element/MovingSphere";
import TennisBall from "./element/TennisBall";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <pointLight position={[0, 0, 1]} />
      <TennisBall />
      <OrbitControls />
    </Canvas>
  );
};
export default Scene;

//Canvas è il contenitore principale per la scena 3D in @react-three/fiber
//camera={{ position: [0, 0, 5] }} imposta la posizione iniziale della camera:

//[0, 0, 5] significa che la telecamera è spostata in avanti lungo l'asse Z, permettendoci di vedere gli oggetti centrati sull'origine (0,0,0)

//<ambientLight /> crea la luce che illumina la scena

//<pointLight position={[0, 0, 1]} /> aggiunge una luce come una lampada che punta sull'oggetto

//<OrbitControls /> serve a controllare l'oggetto 3D con il mouse in modo da ruotarlo o spostarlo sulla scena