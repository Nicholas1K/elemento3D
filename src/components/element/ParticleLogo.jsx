import React, { useEffect, useState} from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import ParticleExplosion from './ParticleExplosion';
import logoUrl from '../../assets/Custom-logo-scritta.svg';

export default function ParticleLogo() {
    const [points, setPoints] = useState([]);

  
    useEffect(() => {
        const loader = new SVGLoader();
        loader.load(logoUrl, data => {
          const shapes = data.paths.flatMap(path => path.toShapes(true));
          const tempPoints = [];
      
          for (let shape of shapes) {
            const spacedPoints = shape.getSpacedPoints(95);
            spacedPoints.forEach(p => {
              tempPoints.push(new THREE.Vector3(p.x / 100 - 2, -p.y / 100 + 2, 0));
            });
          }
      
          console.log("SVG SHAPES:", shapes.length);
          console.log("GENERATED POINTS:", tempPoints.length);
          setPoints(tempPoints);
        });
      }, []);
  
    return points.length ? <ParticleExplosion points={points} /> : null;
  }