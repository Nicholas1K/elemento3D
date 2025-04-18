import React, { useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleSystem({ points }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ mouse }) => {
    const mouseVec = new THREE.Vector3(mouse.x * 5, mouse.y * 5, 0)

    points.forEach((p, i) => {
      const distance = p.distanceTo(mouseVec)
      const direction = new THREE.Vector3().subVectors(p, mouseVec).normalize()
      const strength = Math.max(0, 1 - distance / 2)
      const offset = direction.multiplyScalar(strength * 0.5)

      dummy.position.set(p.x + offset.x, p.y + offset.y, p.z + offset.z)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

 

  return (
    <instancedMesh ref={meshRef} args={[null, null, points.length]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color="white" />
    </instancedMesh>
  )
}

export default function ImmagineParticella({ url }) {
  const { nodes } = useGLTF(url)

  const points = useMemo(() => {
    const geometry = Object.values(nodes).find(n => n.isMesh && n.geometry)?.geometry;
    if (!geometry) return [];

    const position = geometry.attributes.position
    const arr = []
    for (let i = 0; i < position.count; i++) {
      arr.push(new THREE.Vector3(
        position.getX(i),
        position.getY(i),
        position.getZ(i)
      ))
    }
    
    return arr
  }, [nodes])

  return <ParticleSystem points={points} />
}

useGLTF.preload('./welcome_3d_text_logo.glb')


//console.log(nodes);