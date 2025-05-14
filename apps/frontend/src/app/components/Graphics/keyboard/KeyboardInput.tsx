import {useMemo, PropsWithChildren, FC } from 'react';
import { KeyboardControls, KeyboardControlsEntry} from '@react-three/drei';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  jump = 'jump',
}


export const KeyboardInput: FC<PropsWithChildren> = (props) => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(()=>[
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
    ], [])

  return (
    <KeyboardControls map={map}>
      {props.children}
    </KeyboardControls>
  );
}
