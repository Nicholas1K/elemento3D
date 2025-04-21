import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ParticleExplosion({ points, mouse }) {

  const ref = useRef(); //serve per aggiornare manualmente la geometria (modificare le posizioni delle particelle al volo)

/*
  questo useMemo serve a centrare tutte le particelle rispetto al logo SVG
  calcola il centro medio del riquadro di delimitazione 
*/
  const originalPositions = useMemo(() => {

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return points.map(p => new THREE.Vector3(p.x - centerX, p.y - centerY, p.z));

  }, [points]);

  const currentPoints = useMemo(() => originalPositions.map(p => p.clone()), [originalPositions]); //posizione attuale delle particelle

  const velocities = useMemo(() => originalPositions.map(() => new THREE.Vector3()), [originalPositions]); //ogni particella ha una velocità iniziale di 0 serve pr gestire l'esplosione e il movimento

  const positions = useMemo(() => new Float32Array(currentPoints.flatMap(p => [p.x, p.y, p.z])), [currentPoints]);//posizione iniziale delle particelle

  /*
    useFreme serve per aggiornare il comportamento dinamico dell'esplosione
    e del ritorno delle particelle alla loro posizione inizale
  */

  useFrame(({ camera }) => {

    //calcolo del punto di interazione del mouse
    const ray = new THREE.Raycaster();// creo il lanciatore di raggi

    ray.setFromCamera(mouse, camera);
  
    // Piano z = 0
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);// piano sull'asse z
    const intersect = new THREE.Vector3();//intersezione

    ray.ray.intersectPlane(plane, intersect); // il raggio viene intersecato con un piano virtuale
  
    const interactionRadius = 0.02; //Definisce il raggio d'interazione (grandezza del puntatore), Più piccolo = più preciso, se un punto si trova in questo raggio viene spostato via
  
    /*
      Questo ciclo forfa diverse cose
      1) calcola la distanza dal mouse
      2) calcola la forza di spinta (esplosione) la forza è maggiore più il punto è vicino
      3) regola l'attrito delle particelle in modo da rallentarle con il tempo
      4) Aggiunge alla posizione la velocità
      5) Calcola la differenza tra la posizione attuale e quella originale, applicando una forza elastica che fa tornare al loro posto le particelle
      6) aggiorna i valori  all'interno dell'array positions
     */
    for (let i = 0; i < currentPoints.length; i++) {
      const point = currentPoints[i]; //posizione corrente della singola particella
      const orig = originalPositions[i]; //posizione di origin e di ogni singola particella
      const vel = velocities[i]; //velocità di ogni singola particella, che inizialmente è 0
  
      const distance = point.distanceTo(intersect); //distanza di ogni particella dal punto di intesezione
  
      if (distance < interactionRadius) {

        const strength = (interactionRadius - distance) / interactionRadius; //forza di base 
        const force = point.clone().sub(intersect).normalize().multiplyScalar(strength * 0.2); //forza applicata, 1.2 = più forza (forza dell'esplosione)

        vel.add(force); //aggiunge la forza alla velocità in modo da cambiare la velocità da 0 e spostare le particelle
      }
  
      vel.multiplyScalar(0.88); // attrito che rallenta i punti che vengono sparati via con il tempo
      
      point.add(vel);
  
      const toOrig = orig.clone().sub(point).multiplyScalar(0.015); // ritorno dei punti al loro posto più è basso il numero tanto più sarà lento il loro ritorno
      point.add(toOrig);
  
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
  
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true; //essenziale per rendere visibile il movimento delle particelle perchè comunica a Three.js che le posizioni sono cambiate
    }
  });

  /* 
    Points:
      è un  componente per disegnare molte particelle, lavora interamente con Three.Points
      positions: è l'array Float32 con le coordinate delle particelle
      stride={3}: ogni punto ha 3 valori (x,y,z)
      frustumCulled={false}: disattiva la rimozione automatica degli oggetti fuori dalla camera

    PointMaterial:
      materiale usato per le particelle
      size: grandezza delle particelle
      sizeAttenuation={false}: disattiva il ridimensionamento in base alla distanza
      depthWrite={false}: evita che i punti coprano altri oggetti         
  */
  
  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial 
        color='white' 
        size={2} //grandezza delle particelle
        sizeAttenuation={false} 
        depthWrite={false} />
    </Points>
  );
}