import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ParticleExplosion({ points }) {
  const ref = useRef();
  const { camera, mouse: mouseNDC } = useThree();

  // 1️⃣ Centrare i punti rispetto al baricentro
  const originalPositions = useMemo(() => {
    // Calcola bounding box
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

  const currentPoints = useMemo(() =>
    originalPositions.map(p => p.clone()), [originalPositions]
  );

  const velocities = useMemo(() =>
    originalPositions.map(() => new THREE.Vector3()), [originalPositions]
  );

  const positions = useMemo(() =>
    new Float32Array(currentPoints.flatMap(p => [p.x, p.y, p.z])), [currentPoints]
  );

  useEffect(() => {
    if (ref.current) {
      console.log("GEOMETRY READY:", ref.current.geometry.attributes.position);
    }
  }, []);

  useFrame(() => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseNDC, camera);
    const mousePos = raycaster.ray.origin;

    for (let i = 0; i < currentPoints.length; i++) {
      const point = currentPoints[i];
      const orig = originalPositions[i];
      const vel = velocities[i];

      const distance = point.distanceTo(mousePos);
      if (distance < 1) {
        const force = point.clone().sub(mousePos).normalize().multiplyScalar(0.1);
        vel.add(force);
      }

      vel.multiplyScalar(0.9);
      point.add(vel);

      const toOrig = orig.clone().sub(point).multiplyScalar(0.02);
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
        size={1}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </Points>
  );
}