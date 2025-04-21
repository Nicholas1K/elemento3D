import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import ParticleExplosion from './ParticleExplosion';
import logoUrl from '../../assets/Custom-logo-scritta.svg';

/* 
  Questa funzione pointInPolygon è un Utility: Controlla se un punto è dentro 
  un poligono (array di Vector2)
  questa funzione serve per riepire il logo e la scritta con punti, ma solo
  all'interno delle lettere e del logo e non fuori al contorno 
  (poichè in origine la trasformazione del logo creava solo il contorno)
*/

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

/*
  Il componete ParticleLogo è il componente principale che poi verrà importato nella scena
  questo componente genera dei punti 3D in forma particellare basato sulla shape SVG

  GENERA LE PARTICELLE
*/

export default function ParticleLogo({ mouse }) {

  const [points, setPoints] = useState([]);

  useEffect(() => {

    const loader = new SVGLoader(); //serve per caricare il file svg

    loader.load(logoUrl, data => { //l'intero loader converte il path SVG in shapes (forme) utilizzando Three.js per trasformarli in poligono 2D

      const shapes = data.paths.flatMap(path => path.toShapes(true)); //estrae le forme dal file SVG
      const tempPoints = [];

      const totalPoints = 100000; // numero delle shapes o particelle che compongono la scritta 
      const pointsPerShape = Math.floor(totalPoints / shapes.length); //divide equamente le shapes

      //Per ogni SHape (forma) estrae i contorni della forma stessa
      for (let shape of shapes) {
        const outline = shape.extractPoints().shape; //ritorna un array di Vector2 che rappresenta il perimetro del SVG

        /*
          queste costanti calcolano i limiti del riquadro di delimitazione della shape (forma)
          servono per capire lo spazio 2D occupato dalla shape e serve anche per generare punti casuali
          all'interno del riquadro di delimitazione
        */
        const xs = outline.map(p => p.x);
        const ys = outline.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        let attempts = 0;
        let added = 0;

        /*
           questo wile genera i punti all'interno delle lettere e del logo, all'interno del riquadro di delimitazione
           della shape ci sono i punti casuali creati, solo se il punto cade all'interno della shape e questo 
           lo identifichiamo grazie alla funzione pointInPolygon, questo punto viene trasformato in 
           Vector3 e salvato.
        */

        while (added < pointsPerShape && attempts < pointsPerShape * 10) {
          const x = THREE.MathUtils.lerp(minX, maxX, Math.random());
          const y = THREE.MathUtils.lerp(minY, maxY, Math.random());
          const point = new THREE.Vector2(x, y);

          if (pointInPolygon(point, outline)) {
            tempPoints.push(new THREE.Vector3(x / 100 - 2, -y / 100 + 2, 0)); //scala e centra il logo nella scena
            added++;
          }
          attempts++;
        }
      }

      console.log("SVG SHAPES:", shapes.length);
      console.log("GENERATED POINTS:", tempPoints.length);

      setPoints(tempPoints); //aggiorna lo stato con le particelle corrette che riempiono la scritta e il logo

    });
  }, []);

  /*
     In fine viene renderizzato il componente, finchè non ci sono abbastanza punti non si renderizza nulla (evitando problemi)
     Quando tutti i punti sono pronti allora verranno passati al componente ParticleExplosion che si occuperà di animare il file SVG
  */

  return points.length ? <ParticleExplosion points={points} mouse={mouse}/> : null;
}

/*  
  IN SOSTANZA QUESTO COMPONENTE SI OCCUPA DI TRASFORMARE L'SVG IN UN INSIEME DI PARTICELLE 3D.
  CREANDO UN BOX DI PUNTI SALVANDO SOLAMENTE I PUNTI CHE CORRISPONDONO A RIEMPIRE L'SVG E
  PASSA I PUNTI CORRETTI e IL MOUSE CHE VIENE PRESO DA SCENELOGO AL COMPONENTE PARTICLEEXPLOSION
  CHE SI OCCUPERà DI ANIMARE QUESTO COMPONENTE AL PASSAGGIO DEL MOUSE.
*/