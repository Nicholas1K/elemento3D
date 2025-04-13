import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress,Html,ScrollControls } from "@react-three/drei";
import Robot from "./element/Robot";

function Loader() {
    const { progress, active } = useProgress()
  
    return <Html center>{progress.toFixed(1)} % loaded</Html>
  }
  
  export default function SceneTwo() {
    return (
      <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} className="relative h-svh">
        <directionalLight position={[-5, -5, 5]} intensity={4} />
        <Suspense fallback={<Loader />}>
          <ScrollControls damping={0.5} pages={3}>
            <Robot />
          </ScrollControls>
        </Suspense>
      </Canvas>
    )
  }