import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import { Physics } from './physics/Physics';
import Scene from './scene/Scene';
import PlayerController from './player/PlayerController';
import { KeyboardInput } from './keyboard/KeyboardInput';

export const Graphics = () => {
  return (
    <Canvas shadows camera={{ position: [0, 2.5, 5], fov: 75, near: 0.1, far: 1000 }} style={{ background: 'black' }}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={null}>
        <Physics>
          <KeyboardInput>
            <Scene />
            <PlayerController />
          </KeyboardInput>
        </Physics>
      </Suspense>
    </Canvas>
  );
}
