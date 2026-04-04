import Phaser from 'phaser';
import { EndScene } from './scenes/EndScene';
import { KioskScene } from './scenes/KioskScene';
import { MenuScene } from './scenes/MenuScene';

export function createGame(): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'app',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#0c1220',
    scene: [MenuScene, KioskScene, EndScene]
  });
}
