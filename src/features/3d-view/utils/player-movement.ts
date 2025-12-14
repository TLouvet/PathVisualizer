import type { Player } from '../types/raycaster';
import type { PlayerKeyState } from '../hooks/use-player-keyboard-input';

export interface PlayerMovementConfig {
  moveSpeed: number;
  canMove: (x: number, y: number) => boolean;
}

/**
 * Calculate the new player state based on keyboard input and mouse rotation
 */
export function calculatePlayerMovement(
  player: Player,
  keyState: PlayerKeyState,
  mouseRotation: number,
  deltaTime: number,
  config: PlayerMovementConfig
): Player {
  let newX = player.x;
  let newY = player.y;
  let newAngle = player.angle;

  // Apply mouse rotation
  if (mouseRotation !== 0) {
    newAngle += mouseRotation;
  }

  // Normalize angle
  while (newAngle < 0) newAngle += Math.PI * 2;
  while (newAngle >= Math.PI * 2) newAngle -= Math.PI * 2;

  // Calculate direction vectors
  const dirX = Math.cos(newAngle);
  const dirY = Math.sin(newAngle);

  // Forward/backward movement
  if (keyState.forward) {
    const testX = newX + dirX * config.moveSpeed * deltaTime;
    const testY = newY + dirY * config.moveSpeed * deltaTime;
    if (config.canMove(testX, testY)) {
      newX = testX;
      newY = testY;
    }
  }
  if (keyState.backward) {
    const testX = newX - dirX * config.moveSpeed * deltaTime;
    const testY = newY - dirY * config.moveSpeed * deltaTime;
    if (config.canMove(testX, testY)) {
      newX = testX;
      newY = testY;
    }
  }

  // Strafe left/right
  if (keyState.left) {
    const strafeX = dirY;
    const strafeY = -dirX;
    const testX = newX + strafeX * config.moveSpeed * deltaTime;
    const testY = newY + strafeY * config.moveSpeed * deltaTime;
    if (config.canMove(testX, testY)) {
      newX = testX;
      newY = testY;
    }
  }
  if (keyState.right) {
    const strafeX = -dirY;
    const strafeY = dirX;
    const testX = newX + strafeX * config.moveSpeed * deltaTime;
    const testY = newY + strafeY * config.moveSpeed * deltaTime;
    if (config.canMove(testX, testY)) {
      newX = testX;
      newY = testY;
    }
  }

  return {
    ...player,
    x: newX,
    y: newY,
    angle: newAngle,
  };
}
