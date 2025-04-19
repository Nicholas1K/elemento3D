import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ParticleExplosion({ points, mouse }) {
  const ref = useRef();
  const { camera, size } = useThree();

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

  const currentPoints = useMemo(() => originalPositions.map(p => p.clone()), [originalPositions]);
  const velocities = useMemo(() => originalPositions.map(() => new THREE.Vector3()), [originalPositions]);
  const positions = useMemo(() => new Float32Array(currentPoints.flatMap(p => [p.x, p.y, p.z])), [currentPoints]);

  useFrame(({ camera }) => {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
  
    // Piano z = 0
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersect = new THREE.Vector3();
    ray.ray.intersectPlane(plane, intersect);
  
    const interactionRadius = 0.02; // Più piccolo = più preciso grandezza del puntatore
  
    for (let i = 0; i < currentPoints.length; i++) {
      const point = currentPoints[i];
      const orig = originalPositions[i];
      const vel = velocities[i];
  
      const distance = point.distanceTo(intersect);
  
      if (distance < interactionRadius) {
        const strength = (interactionRadius - distance) / interactionRadius;
        const force = point.clone().sub(intersect).normalize().multiplyScalar(strength * 0.2); // 1.2 = più forza forza dell'esplosione
        vel.add(force);
      }
  
      vel.multiplyScalar(0.88); // attrito
      point.add(vel);
  
      const toOrig = orig.clone().sub(point).multiplyScalar(0.015); // ritorno più lento dei punti al loro posto
      point.add(toOrig);
  
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
  
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  

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