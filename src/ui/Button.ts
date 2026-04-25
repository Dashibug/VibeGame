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
  private readonly bgInset: Phaser.GameObjects.Rectangle;
  private readonly text: Phaser.GameObjects.Text;
  private readonly baseColor: number;
  private readonly hoverColor: number;
  private readonly activeColor: number;
  private readonly strokeColor: number;
  private readonly correctColor: number = 0x228b22; // soft green
  private readonly incorrectColor: number = 0x8b4513; // dusty red
  private isActiveState = false;
  private isCorrect = false;
  private isIncorrect = false;

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
    this.baseColor = options.backgroundColor ?? 0x2a3440; // worn metal
    this.hoverColor = options.hoverColor ?? 0x3a4555; // dull gray-blue
    this.activeColor = options.activeColor ?? 0x5f9ea0; // desaturated cyan
    this.strokeColor = options.strokeColor ?? 0x5a4a3a; // faded brass

    // Outer frame for depth
    this.bg = scene.add
      .rectangle(0, 0, width, height, this.baseColor)
      .setStrokeStyle(2, this.strokeColor, 0.8);

    // Inner inset for button depth
    this.bgInset = scene.add
      .rectangle(0, 0, width - 8, height - 8, this.baseColor)
      .setStrokeStyle(1, this.strokeColor, 0.6);

    this.text = scene.add
      .text(0, 0, label, {
        fontFamily: 'serif',
        fontSize: options.fontSize ?? '16px',
        color: options.textColor ?? '#c4b89a'
      })
      .setOrigin(0.5);

    this.add([this.bg, this.bgInset, this.text]);
    this.setSize(width, height);
    this.bg.setInteractive({ useHandCursor: true });

    this.bg.on('pointerover', () => {
      if (!this.isActiveState && !this.isCorrect && !this.isIncorrect) {
        this.bg.setFillStyle(this.hoverColor);
        this.bgInset.setFillStyle(this.hoverColor);
      }
    });
    this.bg.on('pointerout', () => {
      this.updateButtonAppearance();
    });
    this.bg.on('pointerdown', () => {
      scene.tweens.add({ targets: this, scale: 0.98, duration: 60, yoyo: true });
      options.onClick();
    });

    scene.add.existing(this);
  }

  setActiveState(isActive: boolean): void {
    this.isActiveState = isActive;
    this.updateButtonAppearance();
  }

  setCorrect(isCorrect: boolean): void {
    this.isCorrect = isCorrect;
    this.isIncorrect = false;
    this.updateButtonAppearance();
  }

  setIncorrect(isIncorrect: boolean): void {
    this.isIncorrect = isIncorrect;
    this.isCorrect = false;
    this.updateButtonAppearance();
  }

  private updateButtonAppearance(): void {
    let fillColor = this.baseColor;
    let strokeColor = this.strokeColor;
    let strokeWidth = 2;
    let textColor = '#c4b89a';

    if (this.isCorrect) {
      fillColor = this.correctColor;
      strokeColor = 0xb8860b; // muted amber
      strokeWidth = 3;
      textColor = '#e8dcc0';
    } else if (this.isIncorrect) {
      fillColor = this.incorrectColor;
      strokeColor = 0xb8860b;
      strokeWidth = 3;
      textColor = '#e8dcc0';
    } else if (this.isActiveState) {
      fillColor = this.activeColor;
      strokeColor = 0xb8860b;
      strokeWidth = 3;
      textColor = '#e8dcc0';
    } else {
      fillColor = this.baseColor;
      strokeColor = this.strokeColor;
      strokeWidth = 2;
      textColor = '#c4b89a';
    }

    this.bg.setFillStyle(fillColor);
    this.bg.setStrokeStyle(strokeWidth, strokeColor, 0.8);
    this.bgInset.setFillStyle(fillColor);
    this.bgInset.setStrokeStyle(1, strokeColor, 0.6);
    this.text.setColor(textColor);
  }
}
