
import { FC, PropsWithChildren } from 'react';
import { Physics as RapierPhysics } from '@react-three/rapier';

export const Physics: FC<PropsWithChildren> = ({ children }) => {
  return (
    <RapierPhysics
      gravity={[0, -30, 0]}
      colliders="cuboid"
      timeStep={1 / 60}
      debug={false}
    >
      {children}
    </RapierPhysics>
  );
}
