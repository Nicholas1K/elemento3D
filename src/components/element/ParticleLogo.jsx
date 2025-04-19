import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import ParticleExplosion from './ParticleExplosion';
import logoUrl from '../../assets/Custom-logo-scritta.svg';

// Utility: Controlla se un punto è dentro un poligono (array di Vector2)
function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y)) &&
                      (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 0.0001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function ParticleLogo({ mouse }) {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const loader = new SVGLoader();
    loader.load(logoUrl, data => {
      const shapes = data.paths.flatMap(path => path.toShapes(true));
      const tempPoints = [];

      const totalPoints = 50000;
      const pointsPerShape = Math.floor(totalPoints / shapes.length);

      for (let shape of shapes) {
        const outline = shape.extractPoints().shape;

        const xs = outline.map(p => p.x);
        const ys = outline.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        let attempts = 0;
        let added = 0;
        while (added < pointsPerShape && attempts < pointsPerShape * 10) {
          const x = THREE.MathUtils.lerp(minX, maxX, Math.random());
          const y = THREE.MathUtils.lerp(minY, maxY, Math.random());
          const point = new THREE.Vector2(x, y);
          if (pointInPolygon(point, outline)) {
            tempPoints.push(new THREE.Vector3(x / 100 - 2, -y / 100 + 2, 0));
            added++;
          }
          attempts++;
        }
      }

      console.log("SVG SHAPES:", shapes.length);
      console.log("GENERATED POINTS:", tempPoints.length);
      setPoints(tempPoints);
    });
  }, []);

  return points.length ? <ParticleExplosion points={points} mouse={mouse}/> : null;
}
