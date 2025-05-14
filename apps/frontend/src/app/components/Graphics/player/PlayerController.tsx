import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, PointerLockControls } from "@react-three/drei";
import {
  RigidBody,
  CapsuleCollider,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

export default function PlayerController() {
  const body = useRef<RapierRigidBody>(null);
  const rapier = useRapier();
  const { camera, gl } = useThree();
  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    const handler = () => gl.domElement.requestPointerLock();
    gl.domElement.addEventListener("click", handler);
    return () => gl.domElement.removeEventListener("click", handler);
  }, [gl.domElement]);

  useFrame((state) => {
    if (!body.current) return;

    const { forward, back, left, right, jump } = getKeys();
    const vel = body.current.linvel();
    const pos = body.current.translation();

    // sync camera to body
    camera.position.set(pos.x, pos.y + 1.5, pos.z);

    // movement vectors
    frontVector.set(0, 0, (back ? 1 : 0) - (forward ? 1 : 0));
    sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    body.current.setLinvel(
      { x: direction.x, y: vel.y, z: direction.z },
      true
    );

    // jumping
    const ray = rapier.world.castRay(
      new RAPIER.Ray(pos, { x: 0, y: -1, z: 0 }),
      4,
      false
    );
    const grounded = ray && ray.collider && Math.abs(ray.timeOfImpact) <= 1.75;
    if (jump && grounded) {
      body.current.setLinvel(
        { x: vel.x, y: 7.5, z: vel.z },
        true
      );
    }
  });

  return (
    <>
      <PointerLockControls />
      <RigidBody
        ref={body}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 2, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.5, 0.5]} />
      </RigidBody>
    </>
  );
}
