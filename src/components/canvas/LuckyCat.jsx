import { useGLTF, useAnimations, Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LuckyCat() {
  //  create camera and mouse variables
  const { camera, mouse } = useThree()
  //   console.log("camera", camera);
  //   console.log("mouse", mouse);

  // create a ref for the mesh
  const modelRef = useRef()

  // import a gltf luckyCat
  const luckyCat = useGLTF('/lucky-cat.glb')
  //   console.log("luckyCat", luckyCat);

  // useAnimations hook to play the animation
  const { actions } = useAnimations(luckyCat.animations, luckyCat.scene)
  //   console.log("Waving", actions.Waving);

  // useFrame hook to rotate the mesh and to move the model based on mouse position
  useFrame(() => {
    // console.log("mouse", mouse.x);
    const y = mouse.x / 7 + 0.4
    const x = -mouse.y / 50
    const rotation = new THREE.Euler(x, y, 0)

    // Update the rotation of the model
    modelRef.current.rotation.setFromVector3(rotation)
  })

  // useEffect hook to play the animation
  //   useEffect(() => {
  //     actions.Waving.play();
  //   }, []);

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5} floatingRange={[-0.05, 0.05]}>
      <primitive ref={modelRef} object={luckyCat.scene} scale={8} position={[-2.9, -3.7, 0]} />
    </Float>
  )
}
