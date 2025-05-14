"use client";

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Sky } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

interface SceneProps {
  modelPath?: string;
}

const SpinningBox: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const Model: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} dispose={null} />;
};

export default function Scene({ modelPath }: SceneProps) {
  return (<>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Sky sunPosition={[100, 20, 100]} />
      {modelPath ? <Model modelPath={modelPath} /> : <SpinningBox />}
      <RigidBody type="fixed">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
        <CuboidCollider args={[50, 1, 50]} position={[0, -1, 0]} />
      </RigidBody>
  </>);
}
