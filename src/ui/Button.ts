import Phaser from 'phaser';

interface ButtonOptions {
  width?: number;
  height?: number;
  fontSize?: string;
  backgroundColor?: number;
  hoverColor?: number;
  activeColor?: number;
  strokeColor?: number;
  textColor?: string;
  onClick: () => void;
}

export class TextButton extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Rectangle;
  private readonly text: Phaser.GameObjects.Text;
  private readonly baseColor: number;
  private readonly hoverColor: number;
  private readonly activeColor: number;
  private readonly strokeColor: number;
  private isActiveState = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    options: ButtonOptions
  ) {
    super(scene, x, y);

    const width = options.width ?? 180;
    const height = options.height ?? 44;
    this.baseColor = options.backgroundColor ?? 0x2a3f5f;
    this.hoverColor = options.hoverColor ?? 0x3b5d88;
    this.activeColor = options.activeColor ?? 0x7a5a2e;
    this.strokeColor = options.strokeColor ?? 0x8aa3c7;

    this.bg = scene.add
      .rectangle(0, 0, width, height, this.baseColor)
      .setStrokeStyle(1, this.strokeColor, 0.65)
      .setOrigin(0.5);

    this.text = scene.add
      .text(0, 0, label, {
        fontFamily: 'Verdana, sans-serif',
        fontSize: options.fontSize ?? '18px',
        color: options.textColor ?? '#e8f0ff'
      })
      .setOrigin(0.5);

    this.add([this.bg, this.text]);
    this.setSize(width, height);
    this.bg.setInteractive({ useHandCursor: true });

    this.bg.on('pointerover', () => {
      if (!this.isActiveState) {
        this.bg.setFillStyle(this.hoverColor);
      }
    });
    this.bg.on('pointerout', () => {
      this.bg.setFillStyle(this.isActiveState ? this.activeColor : this.baseColor);
    });
    this.bg.on('pointerdown', () => {
      scene.tweens.add({ targets: this, scale: 0.96, duration: 60, yoyo: true });
      options.onClick();
    });

    scene.add.existing(this);
  }

  setActiveState(isActive: boolean): void {
    this.isActiveState = isActive;
    this.bg.setFillStyle(isActive ? this.activeColor : this.baseColor);
    this.bg.setStrokeStyle(isActive ? 2 : 1, this.strokeColor, isActive ? 1 : 0.65);
    this.text.setColor(isActive ? '#fff4dc' : '#e8f0ff');
  }
}
