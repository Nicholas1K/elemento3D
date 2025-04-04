import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const MovingSphere = () => {
  const meshRef = useRef();
  const [scale, setScale] = useState(1); //scala grandezza di partenza

  // Effetto per aggiornare la scala con lo scroll
  useEffect(() => {
    const handleScroll = (event) => {
      setScale((prev) => Math.max(0.5, prev - event.deltaY * 0.001));
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  // Movimento dell'oggetto
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(clock.getElapsedTime()) * 0.5; //movimento sinistra e destra
      meshRef.current.position.y = Math.cos(clock.getElapsedTime()) * 0.5; //movimento verso l'alto e verso il basso
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}> 
      <sphereGeometry args={[1, 5, 3]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};


export default MovingSphere;

//mesh è un nodo di Three.js che rappresenta tridimensionale che verrà utilizzato nella scena
//ref={meshRef} collega l'elemento a una ref, permettendo di manipolarlo direttamente con useRef.
//scale imposta la grandezza di un oggetto che cambierà con lo scroll del mouse

//sphereGeometry definisce la forma geometrica dell'oggetto

//args={[1, 32, 32]} specifica i parametri della sfera:

// 1 → raggio della sfera (quindi inizialmente ha diametro 2).

// 32 → suddivisioni lungo la larghezza (widthSegments).

// 32 → suddivisioni lungo l'altezza (heightSegments).

// meshStandardMaterial definisce il materiale della sfera