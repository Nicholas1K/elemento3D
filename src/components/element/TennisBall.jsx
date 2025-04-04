import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const TennisBall = () => {
  const ballRef = useRef();
  const { scene } = useGLTF("./tennisball.glb"); //importare il file 3D da mostrare
  const [scale, setScale] = useState(1);

   // Effetto per aggiornare la scala con lo scroll
  useEffect(() => {
    const handleScroll = (event) => {
      setScale((prev) => Math.max(0.5, prev - event.deltaY * 0.001));
    };
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  useFrame(({ clock }) => {
    if (ballRef.current) {
      ballRef.current.rotation.x += 0.01; // Ruota la palla cambiando 0.01 si aumenta la velocità, mentre la x di ballRef.current.rotation idnica la direzione della rotazione sull'asse x o y 
    }
  });

  return <primitive ref={ballRef} object={scene} scale={scale} />;
};

export default TennisBall;