import * as THREE from 'three'
import React, { Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { ContactShadows, CubeCamera, Environment, Float, Html } from '@react-three/drei'
import { DoubleSide, MathUtils, NoBlending, Vector3 } from 'three'

const props = [
  { geometry: new THREE.TetrahedronBufferGeometry(2) },
  { geometry: new THREE.CylinderBufferGeometry(0.8, 0.8, 2, 32) },
  { geometry: new THREE.ConeGeometry(1.1, 1.7, 32) },
  { geometry: new THREE.SphereBufferGeometry(1.5, 32, 32) },
  { geometry: new THREE.IcosahedronBufferGeometry(2) },
  { geometry: new THREE.TorusBufferGeometry(1.1, 0.35, 16, 32) },
  { geometry: new THREE.OctahedronGeometry(2) },
  { geometry: new THREE.SphereBufferGeometry(1.5, 32, 32) },
  { geometry: new THREE.BoxBufferGeometry(2.5, 2.5, 2.5) }
]

function Geometries() {
  const n = 40
  const randProps = useMemo(() => Array.from({ length: n }, () => props[Math.floor(Math.random() * props.length)]), [])

  return randProps.map((prop) => {
    const rand = Math.random() > 0.5
    return (
      <Float>
        <mesh
          scale={MathUtils.randFloat(0.25, 0.5)}
          position={
            new Vector3(
              MathUtils.randFloat(-8, 8), //
              MathUtils.randFloat(-8, 8),
              MathUtils.randFloat(-5, 5)
            )
          }
          geometry={prop.geometry}>
          <meshStandardMaterial toneMapped={!rand} color={Math.random() > 0.5 ? [10, 2, 5] : [5, 5, 10]} />
        </mesh>
      </Float>
    )
  })
}

function Rig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 4, mouse.y * 4, camera.position.z), 0.02)
    camera.lookAt(0, 0, 0)
  })
}

function Plane() {
  return (
    <Float floatIntensity={10} rotationIntensity={4}>
      <CubeCamera resolution={1024}>
        {(tex) => (
          <Html
            castShadow
            receiveShadow
            occlude="blending"
            transform
            material={
              <meshStandardMaterial
                opacity={0.1} //
                blending={NoBlending}
                roughness={0.1}
                color={0x030303}
                side={DoubleSide}
                metalness={0.8}
                envMap={tex}
              />
            }>
            <iframe
              title="embed" //
              width={700}
              height={500}
              src="https://threejs.org/"
              frameBorder={0}
            />
          </Html>
        )}
      </CubeCamera>
    </Float>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 15], near: 5, far: 40 }}>
      <Suspense fallback={null}>
        <Plane />
        <Geometries />
        <Environment background preset="dawn" blur={0.8} />

        <ContactShadows position={[0, -9, 0]} opacity={0.7} scale={40} blur={1} />
      </Suspense>

      <EffectComposer disableNormalPass>
        <Bloom intensity={0.3} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
      <Rig />
    </Canvas>
  )
}
