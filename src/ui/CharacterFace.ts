import Phaser from 'phaser';

export type FaceExpression = 'happy' | 'confused' | 'angry' | 'tired' | 'surprised' | 'neutral';

export interface FaceConfig {
  x: number;
  y: number;
  scale?: number;
}

export class CharacterFace {
  private container: Phaser.GameObjects.Container;
  private expression: FaceExpression = 'neutral';
  private graphics!: Phaser.GameObjects.Graphics;
  private readonly skinColor = 0xf0c9a8;
  private readonly skinShadowColor = 0xd9a47f;
  private readonly outlineColor = 0x20242a;
  private readonly hairColor = 0x2b211d;
  private readonly eyeColor = 0x1f252d;

  constructor(scene: Phaser.Scene, config: FaceConfig) {
    this.container = scene.add.container(config.x, config.y);
    this.container.setScale(config.scale || 1);
    this.graphics = scene.add.graphics();
    this.container.add(this.graphics);
  }

  setExpression(expression: FaceExpression): void {
    this.expression = expression;
    this.drawFace();
  }

  private drawFace(): void {
    this.graphics.clear();
    this.drawHeadBase();

    switch (this.expression) {
      case 'happy':
        this.drawHappyFace();
        break;
      case 'confused':
        this.drawConfusedFace();
        break;
      case 'angry':
        this.drawAngryFace();
        break;
      case 'tired':
        this.drawTiredFace();
        break;
      case 'surprised':
        this.drawSurprisedFace();
        break;
      case 'neutral':
      default:
        this.drawNeutralFace();
        break;
    }
  }

  private drawHeadBase(): void {
    // Bust and neck sit behind the face to make the character feel grounded.
    this.graphics.fillStyle(0x2b3444, 0.96);
    this.graphics.fillEllipse(0, 58, 92, 34);
    this.graphics.lineStyle(2, 0x171b22, 0.8);
    this.graphics.strokeEllipse(0, 58, 92, 34);

    this.graphics.fillStyle(this.skinShadowColor, 1);
    this.graphics.fillRoundedRect(-14, 30, 28, 30, 8);
    this.graphics.lineStyle(2, this.outlineColor, 0.8);
    this.graphics.strokeRoundedRect(-14, 30, 28, 30, 8);

    this.graphics.fillStyle(this.skinColor, 1);
    this.graphics.fillEllipse(-42, -2, 18, 28);
    this.graphics.fillEllipse(42, -2, 18, 28);
    this.graphics.lineStyle(2, this.outlineColor, 1);
    this.graphics.strokeEllipse(-42, -2, 18, 28);
    this.graphics.strokeEllipse(42, -2, 18, 28);

    this.graphics.lineStyle(2, this.skinShadowColor, 0.85);
    this.graphics.beginPath();
    this.graphics.arc(-43, -2, 5, -Math.PI / 2, Math.PI / 2, false);
    this.graphics.strokePath();
    this.graphics.beginPath();
    this.graphics.arc(43, -2, 5, Math.PI / 2, -Math.PI / 2, false);
    this.graphics.strokePath();

    this.graphics.fillStyle(this.skinColor, 1);
    this.graphics.lineStyle(3, this.outlineColor, 1);
    this.graphics.fillEllipse(0, -5, 82, 98);
    this.graphics.strokeEllipse(0, -5, 82, 98);

    this.graphics.fillStyle(this.hairColor, 1);
    this.graphics.fillEllipse(0, -52, 70, 20);
    this.graphics.fillEllipse(-27, -38, 24, 30);
    this.graphics.fillEllipse(28, -38, 22, 28);
    this.graphics.fillEllipse(-5, -43, 38, 24);
  }

  private drawEyes(leftY = -14, rightY = -14, pupilOffsetX = 0, pupilOffsetY = 0): void {
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.lineStyle(2, this.outlineColor, 1);
    this.graphics.fillEllipse(-20, leftY, 22, 26);
    this.graphics.strokeEllipse(-20, leftY, 22, 26);
    this.graphics.fillEllipse(20, rightY, 22, 26);
    this.graphics.strokeEllipse(20, rightY, 22, 26);

    this.graphics.fillStyle(this.eyeColor, 1);
    this.graphics.fillCircle(-20 + pupilOffsetX, leftY + pupilOffsetY, 8);
    this.graphics.fillCircle(20 + pupilOffsetX, rightY + pupilOffsetY, 8);

    this.graphics.fillStyle(0xffffff, 0.95);
    this.graphics.fillCircle(-23 + pupilOffsetX, leftY - 4 + pupilOffsetY, 3);
    this.graphics.fillCircle(17 + pupilOffsetX, rightY - 4 + pupilOffsetY, 3);
  }

  private drawBlinkingEyes(): void {
    this.graphics.lineStyle(4, this.outlineColor, 1);
    this.strokeQuadratic(-31, -16, -20, -10, -9, -16);
    this.strokeQuadratic(9, -16, 20, -10, 31, -16);
  }

  private drawNose(): void {
    const nosePoints = [
      ...this.getQuadraticPoints(0, -9, 18, 3, 11, 19),
      ...this.getQuadraticPoints(11, 19, 2, 27, -9, 18).slice(1),
      ...this.getQuadraticPoints(-9, 18, -2, 8, 0, -9).slice(1)
    ];

    this.graphics.fillStyle(0xe7b58f, 1);
    this.graphics.lineStyle(3, this.outlineColor, 1);
    this.graphics.fillPoints(nosePoints, true, true);
    this.graphics.strokePoints(nosePoints, true, true);

    this.graphics.fillStyle(0xb7775c, 0.8);
    this.graphics.fillCircle(6, 17, 2.4);
    this.graphics.fillCircle(-5, 16, 2);
  }

  private drawEyebrows(leftStartY: number, leftEndY: number, rightStartY: number, rightEndY: number): void {
    this.graphics.lineStyle(4, this.hairColor, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(-32, leftStartY);
    this.graphics.lineTo(-10, leftEndY);
    this.graphics.strokePath();

    this.graphics.beginPath();
    this.graphics.moveTo(10, rightStartY);
    this.graphics.lineTo(32, rightEndY);
    this.graphics.strokePath();
  }

  private drawHappyFace(): void {
    this.drawEyebrows(-33, -36, -36, -33);
    this.drawEyes(-16, -16, 0, -1);
    this.drawNose();

    this.graphics.lineStyle(4, this.outlineColor, 1);
    this.graphics.beginPath();
    this.graphics.arc(0, 21, 20, 0.08 * Math.PI, 0.92 * Math.PI, false);
    this.graphics.strokePath();
  }

  private drawConfusedFace(): void {
    this.drawEyebrows(-32, -40, -38, -29);
    this.drawEyes(-17, -12, 1, 0);
    this.drawNose();

    this.graphics.lineStyle(3, this.outlineColor, 1);
    this.strokePoints([
      ...this.getQuadraticPoints(-18, 28, -8, 22, 0, 28),
      ...this.getQuadraticPoints(0, 28, 9, 34, 19, 27).slice(1)
    ]);
  }

  private drawAngryFace(): void {
    this.drawEyes(-13, -13, 0, 2);
    this.drawNose();

    this.graphics.lineStyle(5, this.hairColor, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(-34, -33);
    this.graphics.lineTo(-9, -22);
    this.graphics.strokePath();
    this.graphics.beginPath();
    this.graphics.moveTo(9, -22);
    this.graphics.lineTo(34, -33);
    this.graphics.strokePath();

    this.graphics.lineStyle(4, this.outlineColor, 1);
    this.strokeQuadratic(-20, 32, 0, 23, 20, 32);
  }

  private drawTiredFace(): void {
    this.drawEyebrows(-28, -31, -31, -28);
    this.drawBlinkingEyes();
    this.drawNose();

    this.graphics.lineStyle(3, 0x6a4f4a, 0.65);
    this.graphics.beginPath();
    this.graphics.moveTo(-34, 0);
    this.graphics.lineTo(-22, 2);
    this.graphics.moveTo(22, 2);
    this.graphics.lineTo(34, 0);
    this.graphics.strokePath();

    this.graphics.lineStyle(4, this.outlineColor, 1);
    this.graphics.beginPath();
    this.graphics.arc(0, 37, 18, 1.15 * Math.PI, 1.85 * Math.PI, false);
    this.graphics.strokePath();
  }

  private drawSurprisedFace(): void {
    this.drawEyebrows(-39, -44, -44, -39);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.lineStyle(2, this.outlineColor, 1);
    this.graphics.fillEllipse(-20, -15, 26, 30);
    this.graphics.strokeEllipse(-20, -15, 26, 30);
    this.graphics.fillEllipse(20, -15, 26, 30);
    this.graphics.strokeEllipse(20, -15, 26, 30);

    this.graphics.fillStyle(this.eyeColor, 1);
    this.graphics.fillCircle(-20, -14, 7);
    this.graphics.fillCircle(20, -14, 7);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillCircle(-23, -18, 3);
    this.graphics.fillCircle(17, -18, 3);

    this.drawNose();

    this.graphics.fillStyle(this.outlineColor, 1);
    this.graphics.fillEllipse(0, 31, 20, 26);

    this.graphics.fillStyle(0x7f4a46, 1);
    this.graphics.fillEllipse(0, 34, 10, 9);
  }

  private drawNeutralFace(): void {
    this.drawEyebrows(-33, -32, -32, -33);
    this.drawEyes();
    this.drawNose();

    this.graphics.lineStyle(4, this.outlineColor, 1);
    this.strokeQuadratic(-18, 30, 0, 31, 18, 30);
  }

  private strokeQuadratic(
    startX: number,
    startY: number,
    controlX: number,
    controlY: number,
    endX: number,
    endY: number
  ): void {
    this.strokePoints(this.getQuadraticPoints(startX, startY, controlX, controlY, endX, endY));
  }

  private strokePoints(points: Array<{ x: number; y: number }>): void {
    this.graphics.strokePoints(points, false, false);
  }

  private getQuadraticPoints(
    startX: number,
    startY: number,
    controlX: number,
    controlY: number,
    endX: number,
    endY: number,
    steps = 12
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const inverseT = 1 - t;

      points.push({
        x: inverseT * inverseT * startX + 2 * inverseT * t * controlX + t * t * endX,
        y: inverseT * inverseT * startY + 2 * inverseT * t * controlY + t * t * endY
      });
    }

    return points;
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  destroy(): void {
    this.container.destroy();
  }
}
