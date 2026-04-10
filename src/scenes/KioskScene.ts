import Phaser from 'phaser';
import { DESTINATION_POOL, PASSENGER_PROFILES } from '../data/customers';
import { t, translateDataText, translateDestination } from '../i18n';
import type { DestinationDefinition, PassengerProfile } from '../types';
import { TextButton } from '../ui/Button';

const SHIFT_DURATION_SECONDS = 120;
const MAX_STRIKES = 3;
const PASSENGER_TIMEOUT_MS = 20000;

export class KioskScene extends Phaser.Scene {
  private money = 0;
  private strikes = 0;
  private processedPassengers = 0;
  private correctRoutes = 0;
  private shiftTimeLeft = SHIFT_DURATION_SECONDS;

  private caseFileText!: Phaser.GameObjects.Text;
  private routingBrief!: Phaser.GameObjects.Text;
  private passengerCardText!: Phaser.GameObjects.Text;
  private passengerIndicatorsText!: Phaser.GameObjects.Text;
  private destinationFlagText!: Phaser.GameObjects.Text;
  private routeCardLabelText!: Phaser.GameObjects.Text;
  private customerName!: Phaser.GameObjects.Text;
  private customerLine!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private hudText!: Phaser.GameObjects.Text;
  private customerSilhouette!: Phaser.GameObjects.Rectangle;
  private customerContainer!: Phaser.GameObjects.Container;
  private customerPortrait!: Phaser.GameObjects.Image;
  private customerHead!: Phaser.GameObjects.Ellipse;
  private customerShadow!: Phaser.GameObjects.Ellipse;
  private dialoguePanel!: Phaser.GameObjects.Rectangle;
  private namePlate!: Phaser.GameObjects.Rectangle;
  private dialogueAccent!: Phaser.GameObjects.Rectangle;
  private customerBaseX = 0;
  private customerBaseY = 0;

  private currentPassenger: PassengerProfile | null = null;
  private activeDestinations: DestinationDefinition[] = [];
  private destinationButtons: Record<string, TextButton> = {};
  private readonly customerPortraitKeys = [
    'customer-01',
    'customer-02',
    'customer-03',
    'customer-04',
    'customer-05',
    'customer-06'
  ];
  private usePortrait = false;
  private currentPassengerTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('KioskScene');
  }

  preload(): void {
    this.customerPortraitKeys.forEach((key) => {
      this.load.image(key, `customers/${key}.svg`);
    });
  }

  create(): void {
    this.money = 0;
    this.strikes = 0;
    this.processedPassengers = 0;
    this.correctRoutes = 0;
    this.shiftTimeLeft = SHIFT_DURATION_SECONDS;

    this.drawBackground();
    this.createUI();
    this.spawnNextPassenger();

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.shiftTimeLeft -= 1;
        this.refreshHud();

        if (this.shiftTimeLeft <= 0) {
          this.endShift();
        }
      }
    });

    this.cameras.main.fadeIn(200, 0, 0, 0);
  }

  private getLayout() {
    const width = this.scale.width;
    const height = this.scale.height;
    const topBarH = 64;
    const bottomBarH = 84;
    const sidePad = 24;
    const gap = 20;
    const panelH = height - topBarH - bottomBarH - 16;
    const leftPanelW = Math.max(290, Math.min(370, width * 0.32));
    const rightPanelW = width - sidePad * 2 - leftPanelW - gap;
    const leftPanelX = sidePad + leftPanelW / 2;
    const rightPanelX = sidePad + leftPanelW + gap + rightPanelW / 2;
    const panelY = topBarH + panelH / 2;

    return {
      width,
      height,
      topBarH,
      bottomBarH,
      sidePad,
      gap,
      panelH,
      leftPanelW,
      rightPanelW,
      leftPanelX,
      rightPanelX,
      panelY
    };
  }

  private drawBackground(): void {
    const layout = this.getLayout();
    const { width, height } = layout;

    const coldSkyTop = 0x04080d;
    const coldSkyBottom = 0x0a121a;
    const exteriorPanel = 0x0d141b;
    const interiorPanel = 0x11181f;
    const interiorAccent = 0x252f37;
    const warmGlow = 0xd59b58;

    const sky = this.add.graphics();
    sky.fillGradientStyle(coldSkyTop, coldSkyTop, coldSkyBottom, coldSkyBottom, 1);
    sky.fillRect(0, 0, width, height);

    this.add.ellipse(width - 240, 104, 320, 120, 0x7dd7d0, 0.05);
    this.add.ellipse(width - 240, 104, 220, 82, 0xcfe1d6, 0.04);
    this.add.ellipse(layout.sidePad + layout.leftPanelW / 2, 148, 220, 100, 0x8fd8d7, 0.04);
    this.add.ellipse(width * 0.68, height * 0.76, 320, 120, 0xe3ab63, 0.04);

    const worldGrid = this.add.graphics();
    worldGrid.lineStyle(1, 0x6ad2d2, 0.05);
    for (let x = 24; x < width; x += 62) {
      worldGrid.lineBetween(x, 0, x, height);
    }
    for (let y = 20; y < height; y += 28) {
      worldGrid.lineBetween(0, y, width, y);
    }

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.34);
    vignette.fillRect(0, 0, width, 52);
    vignette.fillRect(0, height - 52, width, 52);
    vignette.fillRect(0, 0, 28, height);
    vignette.fillRect(width - 28, 0, 28, height);

    this.add.rectangle(width / 2, height / 2, width - 14, height - 14, 0x081015, 0.34).setStrokeStyle(2, 0x28353d, 0.7);
    this.add.rectangle(width / 2, height / 2, width - 34, height - 34, 0x000000, 0).setStrokeStyle(1, 0x45545d, 0.45);

    this.add.rectangle(width / 2, layout.topBarH / 2, width, layout.topBarH, 0x111a21, 0.88);
    this.add.rectangle(width / 2, layout.topBarH - 4, width - 42, 2, 0x8b6a43, 0.3);

    this.add
      .rectangle(layout.leftPanelX, layout.panelY, layout.leftPanelW, layout.panelH, exteriorPanel, 0.93)
      .setStrokeStyle(2, 0x394751, 0.9);
    this.add
      .rectangle(layout.rightPanelX, layout.panelY, layout.rightPanelW, layout.panelH, interiorPanel, 0.94)
      .setStrokeStyle(2, 0x4b5b63, 0.95);

    const dividerX = layout.sidePad + layout.leftPanelW + layout.gap / 2;
    const leftPanelLeft = layout.sidePad;
    const leftPanelRight = layout.sidePad + layout.leftPanelW;
    this.add.rectangle(dividerX, layout.panelY, 6, layout.panelH, 0x3a342e, 0.95);
    this.add.rectangle(dividerX + 3, layout.panelY, 2, layout.panelH, 0xd6a96d, 0.16);

    const windowX = layout.leftPanelX;
    const windowY = layout.topBarH + 82;
    const windowW = layout.leftPanelW - 56;
    const windowH = 128;

    this.add.rectangle(windowX, windowY, windowW + 12, windowH + 12, 0x0b1015, 0.82).setStrokeStyle(2, 0x38444c, 0.7);
    this.add.rectangle(windowX, windowY, windowW, windowH, 0x12222d, 0.96).setStrokeStyle(2, 0x69757e, 0.52);
    this.add.rectangle(windowX, windowY, windowW - 28, windowH - 28, 0x9fdde2, 0.04);
    this.add.rectangle(windowX, windowY + 60, windowW - 34, 18, 0x26333d, 0.97).setStrokeStyle(1, 0x7f8d95, 0.48);
    this.add.rectangle(windowX, windowY + 72, windowW - 18, 6, 0x090d11, 0.58);
    this.add.rectangle(windowX, windowY - windowH / 2 + 10, windowW - 16, 10, 0xddeeff, 0.04);

    this.add.rectangle(layout.rightPanelX, windowY + 87, layout.rightPanelW - 20, 16, interiorAccent, 0.96);
    this.add.rectangle(layout.rightPanelX, windowY + 95, layout.rightPanelW - 20, 5, 0x0f1727, 0.45);
    this.add.rectangle(dividerX + 1, windowY + 76, 24, 36, 0x2c3138, 0.96).setStrokeStyle(1, 0xc49862, 0.4);

    this.add.ellipse(layout.rightPanelX + 110, layout.topBarH + 76, 240, 86, warmGlow, 0.06);
    this.add.ellipse(layout.rightPanelX + 110, layout.topBarH + 76, 148, 52, warmGlow, 0.1);

    const snow = this.add.graphics();
    snow.fillStyle(0xb8d7ff, 0.06);
    for (let i = 0; i < 22; i += 1) {
      const x = layout.sidePad + 16 + i * 12;
      const y = layout.topBarH + 22 + (i % 7) * 26;
      snow.fillRect(x, y, 11, 2);
    }

    const reflectionA = this.add
      .rectangle(windowX - windowW * 0.19, windowY - 8, 18, windowH - 30, 0xe2f1ff, 0.08)
      .setAngle(-15);
    const reflectionB = this.add
      .rectangle(windowX + windowW * 0.04, windowY - 6, 10, windowH - 42, 0xcfe6ff, 0.07)
      .setAngle(-13);
    this.tweens.add({
      targets: [reflectionA, reflectionB],
      x: '+=22',
      alpha: { from: 0.04, to: 0.12 },
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add.rectangle(windowX - windowW / 2 + 28, windowY - 46, 24, 6, 0xc7e5ff, 0.2);
    this.add.rectangle(windowX - 6, windowY - 42, 18, 5, 0xc7e5ff, 0.14);
    this.add.rectangle(windowX + windowW / 2 - 44, windowY - 48, 26, 6, 0xc7e5ff, 0.17);
    this.add.circle(windowX - 60, windowY - 28, 5, 0xe2f3ff, 0.1);
    this.add.circle(windowX + 42, windowY - 18, 4, 0xe2f3ff, 0.08);
    this.add.circle(windowX + 66, windowY + 9, 3, 0xe2f3ff, 0.08);

    this.add.text(windowX, windowY - 62, t('kiosk.windowTitle'), {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#d2c8b0'
    }).setOrigin(0.5);

    const coat = this.add.rectangle(0, 28, 94, 104, 0x2f445f, 0.94).setStrokeStyle(2, 0xafc7e4, 0.42);
    const collar = this.add.rectangle(0, 2, 62, 20, 0x465c79, 0.9);
    const scarf = this.add.rectangle(0, 15, 34, 22, 0x776245, 0.92);
    this.customerHead = this.add.ellipse(0, -18, 48, 56, 0x3a4c64, 0.98).setStrokeStyle(1, 0xa5bdd8, 0.4);
    const hat = this.add.rectangle(0, -44, 58, 16, 0x21354d, 0.95);
    const brim = this.add.rectangle(0, -35, 68, 6, 0x1b2b40, 0.9);
    this.customerShadow = this.add.ellipse(0, 70, 92, 20, 0x000000, 0.24);

    this.customerContainer = this.add.container(windowX, windowY + 32, [
      this.customerShadow,
      coat,
      collar,
      scarf,
      this.customerHead,
      hat,
      brim
    ]);
    this.customerPortrait = this.add
      .image(windowX, windowY + 22, this.customerPortraitKeys[0])
      .setDisplaySize(130, 170)
      .setAlpha(0)
      .setVisible(false);
    this.customerContainer.setDepth(22);
    this.customerPortrait.setDepth(23);
    this.customerSilhouette = coat;
    this.customerBaseX = windowX;
    this.customerBaseY = windowY + 12;

    const neonX = leftPanelLeft + 70;
    const neonY = layout.topBarH + 40;
    const neonHalo = this.add.ellipse(neonX, neonY, 150, 42, 0x4fd7ff, 0.08);
    const neonSign = this.add.rectangle(neonX, neonY, 86, 16, 0x68e3ff, 0.18).setStrokeStyle(1, 0xbef2ff, 0.22);
    this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: () => {
        const to = Phaser.Math.FloatBetween(0.18, 0.36);
        this.tweens.add({ targets: [neonSign], alpha: to, duration: 120, yoyo: true, hold: 40 });
        this.tweens.add({ targets: [neonHalo], alpha: to * 0.45, duration: 160, yoyo: true, hold: 40 });
      }
    });

    const headlights = this.add.ellipse(leftPanelLeft + 110, height - layout.bottomBarH - 30, 120, 22, 0xd7e8ff, 0.06);
    this.tweens.add({
      targets: headlights,
      alpha: { from: 0.02, to: 0.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const sweep = this.add
      .rectangle(leftPanelLeft - 120, layout.topBarH + 210, 170, 46, 0xb8d9ff, 0)
      .setAngle(-11);
    this.time.addEvent({
      delay: 6500,
      loop: true,
      callback: () => {
        sweep.x = leftPanelLeft - 120;
        sweep.alpha = 0;
        this.tweens.add({
          targets: sweep,
          x: leftPanelRight + 110,
          alpha: { from: 0, to: 0.13 },
          duration: 2200,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            sweep.alpha = 0;
          }
        });
      }
    });

    if (!this.textures.exists('snow-dot')) {
      const dot = this.add.graphics();
      dot.fillStyle(0xdff1ff, 1);
      dot.fillCircle(2, 2, 2);
      dot.generateTexture('snow-dot', 4, 4);
      dot.destroy();
    }
    this.add.particles(0, 0, 'snow-dot', {
      x: { min: leftPanelLeft + 10, max: leftPanelRight - 10 },
      y: layout.topBarH - 8,
      lifespan: { min: 5200, max: 7600 },
      speedY: { min: 22, max: 40 },
      speedX: { min: -8, max: 8 },
      alpha: { start: 0.34, end: 0 },
      scale: { start: 1, end: 0.25 },
      quantity: 1,
      frequency: 170,
      blendMode: 'ADD'
    });

    this.add
      .rectangle(layout.leftPanelX, layout.topBarH + 278, layout.leftPanelW - 20, 200, 0x0d1116, 0.36)
      .setStrokeStyle(1, 0x344047, 0.38);

    this.add
      .rectangle(layout.rightPanelX, layout.topBarH + 62, layout.rightPanelW - 20, 72, 0x171c21, 0.92)
      .setStrokeStyle(1, 0x5f666c, 0.65);
    this.add.rectangle(layout.rightPanelX, layout.topBarH + 62, layout.rightPanelW - 84, 2, 0xd0a168, 0.28);
    this.add.rectangle(layout.rightPanelX - layout.rightPanelW / 2 + 92, layout.topBarH + 62, 120, 14, 0x9ee8e4, 0.05);
    this.add.text(layout.rightPanelX, layout.topBarH + 32, t('kiosk.consoleTitle'), {
      fontFamily: 'Georgia, serif',
      fontSize: '23px',
      color: '#d4c7ad'
    }).setOrigin(0.5);

    this.add.rectangle(layout.rightPanelX + layout.rightPanelW / 2 - 88, layout.topBarH + 62, 18, 18, 0x6d1e1f, 0.85).setStrokeStyle(1, 0xff7d67, 0.5);
    this.add.rectangle(layout.rightPanelX + layout.rightPanelW / 2 - 62, layout.topBarH + 62, 18, 18, 0x6d1e1f, 0.85).setStrokeStyle(1, 0xff7d67, 0.5);
    this.add.rectangle(layout.rightPanelX + layout.rightPanelW / 2 - 28, layout.topBarH + 62, 44, 18, 0x28565d, 0.8).setStrokeStyle(1, 0x85e5e0, 0.5);
    this.add.rectangle(layout.rightPanelX + layout.rightPanelW / 2 + 18, layout.topBarH + 62, 14, 4, 0xe5a55d, 0.88);
    this.add.triangle(layout.rightPanelX + layout.rightPanelW / 2 + 48, layout.topBarH + 62, 0, 10, 10, -10, 20, 10, 0x7a221d, 0.95)
      .setStrokeStyle(1, 0xff8b67, 0.55);

  }

  private createUI(): void {
    const layout = this.getLayout();
    const rightPanelLeft = layout.sidePad + layout.leftPanelW + layout.gap;
    const sectionCenterX = rightPanelLeft + layout.rightPanelW / 2;
    const sectionWidth = layout.rightPanelW - 24;
    const mainGap = 18;
    const leftColumnWidth = Math.max(170, Math.min(220, sectionWidth * 0.24));
    const rightColumnWidth = Math.max(170, Math.min(220, sectionWidth * 0.24));
    const centerColumnWidth = sectionWidth - leftColumnWidth - rightColumnWidth - mainGap * 2;
    const columnsTopY = layout.topBarH + 206;
    const columnHeight = 328;
    const leftColumnX = rightPanelLeft + 22 + leftColumnWidth / 2;
    const centerColumnX = leftColumnX + leftColumnWidth / 2 + mainGap + centerColumnWidth / 2;
    const rightColumnX = centerColumnX + centerColumnWidth / 2 + mainGap + rightColumnWidth / 2;
    const alertY = layout.topBarH + 118;

    this.hudText = this.add.text(layout.sidePad, 16, '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '20px',
      color: '#d6c8ab'
    });

    const dialogueX = layout.sidePad + layout.leftPanelW / 2;
    const dialogueY = layout.topBarH + 312;
    const dialogueW = layout.leftPanelW - 20;
    const dialogueH = 176;

    this.dialoguePanel = this.add
      .rectangle(dialogueX, dialogueY, dialogueW, dialogueH, 0x0e1419, 0.72)
      .setStrokeStyle(1, 0x4a555c, 0.42);
    this.dialogueAccent = this.add.rectangle(dialogueX - dialogueW / 2 + 3, dialogueY, 6, dialogueH - 10, 0xd19a5c, 0.55);
    this.namePlate = this.add
      .rectangle(dialogueX - dialogueW / 2 + 78, dialogueY - dialogueH / 2 + 22, 148, 34, 0x171d22, 0.96)
      .setStrokeStyle(1, 0x75644f, 0.62);

    this.customerName = this.add.text(dialogueX - dialogueW / 2 + 16, dialogueY - dialogueH / 2 + 5, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '31px',
      color: '#e4dac4'
    });

    this.customerLine = this.add.text(dialogueX - dialogueW / 2 + 16, dialogueY - dialogueH / 2 + 50, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '19px',
      color: '#d9d0bf',
      wordWrap: { width: dialogueW - 34 }
    });

    this.add.rectangle(sectionCenterX, alertY, sectionWidth - 42, 34, 0x311d18, 0.96).setStrokeStyle(1, 0xc58a55, 0.55);
    this.add.rectangle(sectionCenterX, alertY, sectionWidth - 42, 4, 0xd29f5f, 0.2);
    this.add.text(sectionCenterX, alertY, `${t('kiosk.alertManual')}  |  ${t('kiosk.alertQueue')}`, {
      fontFamily: 'Courier New, monospace',
      fontSize: '17px',
      color: '#f1a067'
    }).setOrigin(0.5);

    this.add.rectangle(leftColumnX, columnsTopY, leftColumnWidth, columnHeight, 0x12171b, 0.84).setStrokeStyle(2, 0x4d565b, 0.7);
    this.add.rectangle(centerColumnX, columnsTopY, centerColumnWidth, columnHeight, 0x191613, 0.92).setStrokeStyle(2, 0x5c5548, 0.85);
    this.add.rectangle(rightColumnX, columnsTopY, rightColumnWidth, columnHeight, 0x12171b, 0.84).setStrokeStyle(2, 0x4d565b, 0.7);

    this.add.rectangle(leftColumnX, columnsTopY - columnHeight / 2 + 24, leftColumnWidth - 16, 36, 0x1a2126, 0.94)
      .setStrokeStyle(1, 0x6a5d49, 0.55);
    this.add.text(centerColumnX, columnsTopY - columnHeight / 2 + 24, t('kiosk.documentsTitle'), {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#d2bf9f'
    }).setOrigin(0.5);

    this.add.text(rightColumnX, columnsTopY - columnHeight / 2 + 24, t('kiosk.cluesTitle'), {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#d2bf9f'
    }).setOrigin(0.5);
    this.routeCardLabelText = this.add.text(rightColumnX - rightColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 58, t('kiosk.flagClue'), {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '14px',
      color: '#a9cdd1'
    });

    this.caseFileText = this.add.text(leftColumnX - leftColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 16, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '19px',
      color: '#d6c39b'
    });

    this.add
      .rectangle(centerColumnX, columnsTopY, centerColumnWidth - 24, columnHeight - 24, 0xd1c4a2, 0.94)
      .setStrokeStyle(2, 0x918165, 0.9);
    this.add.rectangle(centerColumnX, columnsTopY, centerColumnWidth - 52, columnHeight - 52, 0xe6dcc0, 0.82)
      .setStrokeStyle(1, 0xb6a27f, 0.48);
    this.add.rectangle(centerColumnX, columnsTopY + 2, centerColumnWidth - 120, 4, 0xe1b56b, 0.18);
    this.add.rectangle(centerColumnX + centerColumnWidth / 2 - 76, columnsTopY - columnHeight / 2 + 78, 64, 64, 0x23373f, 0.14)
      .setStrokeStyle(1, 0xb59d74, 0.34);
    this.add.circle(centerColumnX + centerColumnWidth / 2 - 54, columnsTopY + columnHeight / 2 - 78, 44, 0x9d5a42, 0.12)
      .setStrokeStyle(2, 0xb3644f, 0.55);

    this.add.rectangle(rightColumnX - rightColumnWidth / 2 + 64, columnsTopY - 74, 66, 66, 0x1f4a55, 0.78)
      .setStrokeStyle(1, 0x84e3df, 0.35);

    this.add.rectangle(sectionCenterX, layout.topBarH + 468, sectionWidth, 46, 0x141a1e, 0.96).setStrokeStyle(1, 0x49535a, 0.55);
    this.add.text(rightPanelLeft + 20, layout.topBarH + 445, t('kiosk.routeStatus'), {
      fontFamily: 'Courier New, monospace',
      fontSize: '15px',
      color: '#c9b79a'
    });

    this.routingBrief = this.add.text(leftColumnX - leftColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 58, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '16px',
      color: '#e1d4bf',
      wordWrap: { width: leftColumnWidth - 36 }
    });
    this.routingBrief.setLineSpacing(6);

    this.passengerCardText = this.add.text(centerColumnX - centerColumnWidth / 2 + 34, columnsTopY - columnHeight / 2 + 48, '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '15px',
      color: '#3e3427',
      wordWrap: { width: centerColumnWidth - 70 }
    });
    this.passengerCardText.setLineSpacing(4);

    this.destinationFlagText = this.add.text(rightColumnX - rightColumnWidth / 2 + 64, columnsTopY - 74, '', {
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontSize: '42px'
    }).setOrigin(0.5);

    this.passengerIndicatorsText = this.add.text(rightColumnX - rightColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 156, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '16px',
      color: '#e6cfab',
      wordWrap: { width: rightColumnWidth - 36 }
    });
    this.passengerIndicatorsText.setLineSpacing(8);

    this.feedbackText = this.add.text(rightPanelLeft + 22, layout.topBarH + 476, '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#d2bc93',
      wordWrap: { width: sectionWidth - 44 }
    });

    this.refreshHud();
  }

  private createDestinationButtons(): void {
    Object.values(this.destinationButtons).forEach((button) => button.destroy());
    this.destinationButtons = {};

    const layout = this.getLayout();
    const columns = 3;
    const innerPad = 26;
    const buttonGapX = 14;
    const buttonWidth = (layout.rightPanelW - innerPad * 2 - buttonGapX * (columns - 1)) / columns;
    const buttonGapY = 62;
    const buttonHeight = 54;
    const startX = layout.sidePad + layout.leftPanelW + layout.gap + innerPad + buttonWidth / 2;
    const maxGridBottom = layout.height - layout.bottomBarH - 24;
    const rowCount = Math.ceil(this.activeDestinations.length / columns);
    let startY = layout.topBarH + 546;
    const projectedBottom = startY + (rowCount - 1) * buttonGapY + buttonHeight / 2;

    if (projectedBottom > maxGridBottom) {
      startY -= projectedBottom - maxGridBottom;
    }

    this.activeDestinations.forEach((destination, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = startX + col * (buttonWidth + buttonGapX);
      const y = startY + row * buttonGapY;

      const button = new TextButton(this, x, y, `${destination.code}  ${this.getLocalizedDestinationLabel(destination)}`, {
        width: buttonWidth,
        height: buttonHeight,
        fontSize: '17px',
        backgroundColor: 0x20262b,
        hoverColor: 0x323e46,
        activeColor: 0x365c61,
        strokeColor: 0xa78457,
        textColor: '#ebe0cb',
        onClick: () => this.handleDestinationChoice(destination)
      });
      this.destinationButtons[destination.id] = button;
    });
  }

  private spawnNextPassenger(): void {
    this.currentPassengerTimer?.remove();

    const passenger = Phaser.Utils.Array.GetRandom(PASSENGER_PROFILES);
    this.currentPassenger = passenger;
    this.activeDestinations = this.buildDestinationOptions(passenger.destinationCountryId, 6);
    this.createDestinationButtons();

    this.customerName.setText(passenger.person.name);
    this.customerLine.setText(`"${passenger.person.speech}"`);
    this.customerName.setColor('#f1f6ff');
    this.customerLine.setColor('#d7e3f8');

    const accentColor = this.resolveAccentColor(passenger.accentColor, 0x82b0e8);
    this.dialogueAccent.setFillStyle(accentColor, 0.58);
    this.namePlate.setFillStyle(0x12243d, 0.92);

    this.caseFileText.setText(t('kiosk.passengerProfile'));
    this.routingBrief.setText(this.formatPassengerSummary(passenger));
    this.passengerCardText.setText(this.formatPassengerCard(passenger));
    this.renderRouteCard(passenger);
    this.feedbackText.setText('');
    this.feedbackText.setAlpha(1);

    this.usePortrait = Phaser.Math.Between(0, 100) >= 8;
    const portraitKey = Phaser.Utils.Array.GetRandom(this.customerPortraitKeys);
    const portraitTexture = this.textures.exists(portraitKey) ? this.textures.get(portraitKey) : null;
    const sourceImage = portraitTexture?.getSourceImage() as { width?: number; height?: number } | undefined;
    const portraitReady = Boolean(sourceImage?.width && sourceImage?.height);

    if (this.usePortrait && portraitReady) {
      this.customerPortrait
        .setTexture(portraitKey)
        .setPosition(this.customerBaseX, this.customerBaseY - 6)
        .setScale(0.96)
        .setVisible(true)
        .setAlpha(0);
      this.customerContainer.setVisible(true).setAlpha(0.38);
    } else {
      this.usePortrait = false;
      this.customerPortrait.setVisible(false).setAlpha(0);
      this.customerContainer.setVisible(true).setAlpha(1);
    }

    this.tweens.killTweensOf([this.customerContainer, this.customerHead, this.customerShadow, this.customerPortrait]);
    this.customerContainer.setAlpha(0);
    this.customerContainer.setScale(0.97);
    this.customerContainer.setPosition(this.customerBaseX, this.customerBaseY + 12);
    this.customerHead.setAngle(0);
    this.customerSilhouette.setFillStyle(0x2d3c52, 0.94);
    if (this.usePortrait) {
      this.customerContainer.setPosition(this.customerBaseX, this.customerBaseY);
      this.tweens.add({
        targets: this.customerPortrait,
        alpha: 1,
        y: this.customerBaseY - 18,
        scaleX: 1,
        scaleY: 1,
        duration: 420,
        ease: 'Sine.easeOut'
      });
      this.tweens.add({
        targets: this.customerContainer,
        alpha: 0.5,
        duration: 240
      });
    } else {
      this.tweens.add({
        targets: this.customerContainer,
        alpha: 1,
        y: this.customerBaseY,
        scaleX: 1,
        scaleY: 1,
        duration: 420,
        ease: 'Sine.easeOut'
      });
    }
    this.tweens.add({
      targets: [this.customerName, this.customerLine, this.dialoguePanel, this.namePlate],
      alpha: { from: 0.65, to: 1 },
      duration: 280
    });
    this.startCustomerIdleAnimation();

    this.currentPassengerTimer = this.time.addEvent({
      delay: PASSENGER_TIMEOUT_MS,
      callback: () => {
        if (!this.currentPassenger) {
          return;
        }

        const timedOutPassenger = this.currentPassenger;
        this.playCustomerReaction('impatient');
        this.registerFail(
          t('kiosk.timeoutFeedback', {
            penalty: timedOutPassenger.penalty,
            strike: timedOutPassenger.strikePenalty ?? 1
          }),
          timedOutPassenger.penalty,
          timedOutPassenger.strikePenalty ?? 1
        );
      }
    });
  }

  private startCustomerIdleAnimation(): void {
    if (this.usePortrait) {
      this.tweens.killTweensOf([this.customerPortrait, this.customerContainer]);
      this.customerPortrait.clearTint();
      this.customerPortrait.setPosition(this.customerBaseX, this.customerBaseY - 18);
      this.customerContainer.setPosition(this.customerBaseX, this.customerBaseY).setAlpha(0.5);
      this.tweens.add({
        targets: this.customerPortrait,
        y: this.customerBaseY - 16,
        duration: 1750,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.tweens.add({
        targets: this.customerPortrait,
        x: this.customerBaseX + 2,
        duration: 2100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.tweens.add({
        targets: this.customerContainer,
        y: this.customerBaseY + 1.5,
        duration: 1750,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      return;
    }

    this.tweens.killTweensOf([this.customerContainer, this.customerHead]);
    this.customerContainer.setPosition(this.customerBaseX, this.customerBaseY);
    this.customerHead.setX(0);
    this.tweens.add({
      targets: this.customerContainer,
      y: this.customerBaseY + 2,
      duration: 1750,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.customerHead,
      x: 2,
      duration: 2100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private playCustomerReaction(type: 'satisfied' | 'annoyed' | 'impatient'): void {
    this.tweens.killTweensOf([this.customerContainer, this.customerHead, this.customerShadow, this.customerPortrait]);

    if (type === 'satisfied') {
      this.customerSilhouette.setFillStyle(0x325744, 0.95);
      this.dialogueAccent.setFillStyle(0x86d9b1, 0.6);
      this.namePlate.setFillStyle(0x17322d, 0.92);
      this.customerLine.setColor('#d9f1e5');
      if (this.usePortrait) {
        this.customerPortrait.setTint(0xb7ffd8);
        this.tweens.add({ targets: this.customerPortrait, y: this.customerPortrait.y + 5, duration: 110, yoyo: true, repeat: 1 });
        this.tweens.add({ targets: this.customerPortrait, x: this.customerBaseX + 2, duration: 130, yoyo: true, repeat: 1 });
      } else {
        this.tweens.add({ targets: this.customerHead, y: this.customerHead.y + 5, duration: 110, yoyo: true, repeat: 1 });
        this.tweens.add({ targets: this.customerContainer, x: this.customerBaseX + 2, duration: 130, yoyo: true, repeat: 1 });
      }
    } else if (type === 'annoyed') {
      this.customerSilhouette.setFillStyle(0x5b3642, 0.95);
      this.dialogueAccent.setFillStyle(0xd19aa0, 0.62);
      this.namePlate.setFillStyle(0x381f2b, 0.92);
      this.customerLine.setColor('#f0d7dc');
      if (this.usePortrait) {
        this.customerPortrait.setTint(0xffc0c0);
        this.tweens.add({ targets: this.customerPortrait, x: this.customerBaseX + 4, duration: 70, yoyo: true, repeat: 3 });
        this.tweens.add({ targets: this.customerPortrait, angle: 3, duration: 90, yoyo: true, repeat: 3 });
      } else {
        this.tweens.add({ targets: this.customerContainer, x: this.customerBaseX + 4, duration: 70, yoyo: true, repeat: 3 });
        this.tweens.add({ targets: this.customerHead, angle: 3, duration: 90, yoyo: true, repeat: 3 });
      }
    } else {
      this.customerSilhouette.setFillStyle(0x4d4854, 0.95);
      this.dialogueAccent.setFillStyle(0xb3b7d8, 0.58);
      this.namePlate.setFillStyle(0x262b45, 0.92);
      this.customerLine.setColor('#e2e6f7');
      if (this.usePortrait) {
        this.customerPortrait.setTint(0xddd8ff);
        this.tweens.add({ targets: this.customerPortrait, scaleX: 1.04, duration: 120, yoyo: true, repeat: 2 });
        this.tweens.add({ targets: this.customerPortrait, y: this.customerPortrait.y - 2, duration: 110, yoyo: true, repeat: 2 });
      } else {
        this.tweens.add({ targets: this.customerShadow, scaleX: 1.08, duration: 120, yoyo: true, repeat: 2 });
        this.tweens.add({ targets: this.customerContainer, y: this.customerBaseY - 2, duration: 110, yoyo: true, repeat: 2 });
      }
    }

    this.time.delayedCall(460, () => this.startCustomerIdleAnimation());
  }

  private handleDestinationChoice(destination: DestinationDefinition): void {
    if (!this.currentPassenger) {
      return;
    }

    this.currentPassengerTimer?.remove();

    const passenger = this.currentPassenger;

    if (destination.id === passenger.destinationCountryId) {
      this.money += passenger.reward;
      this.processedPassengers += 1;
      this.correctRoutes += 1;
      this.playCustomerReaction('satisfied');
      this.feedback(
        t('kiosk.successFeedback', {
          route: destination ? this.getLocalizedDestinationLabel(destination) : t('kiosk.targetRoute'),
          reward: passenger.reward
        }),
        true
      );
      this.refreshHud();
      this.time.delayedCall(850, () => {
        if (this.isShiftOver()) {
          this.endShift();
        } else {
          this.spawnNextPassenger();
        }
      });
      return;
    }

    this.playCustomerReaction('annoyed');
    this.registerFail(
      t('kiosk.failFeedback', {
        route: destination ? this.getLocalizedDestinationLabel(destination) : t('kiosk.routeUnknown'),
        penalty: passenger.penalty,
        strike: passenger.strikePenalty ?? 1
      }),
      passenger.penalty,
      passenger.strikePenalty ?? 1
    );
  }

  private registerFail(message: string, penalty: number, strikePenalty: number): void {
    this.money = Math.max(0, this.money - penalty);
    this.strikes += strikePenalty;
    this.processedPassengers += 1;
    this.refreshHud();
    this.feedback(message, false);

    if (this.isShiftOver()) {
      this.endShift();
    } else {
      this.time.delayedCall(850, () => this.spawnNextPassenger());
    }
  }

  private feedback(message: string, positive: boolean): void {
    this.feedbackText.setColor(positive ? '#9de7b3' : '#ffb0b0');
    this.feedbackText.setText(message);
    this.feedbackText.setAlpha(1);
    this.tweens.killTweensOf(this.feedbackText);
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 0.28,
      duration: 1100,
      ease: 'Sine.easeOut'
    });
  }

  private refreshHud(): void {
    this.hudText.setText(
      t('kiosk.hud', {
        time: this.shiftTimeLeft,
        money: this.money,
        correct: this.correctRoutes,
        processed: this.processedPassengers,
        strikes: this.strikes,
        max: MAX_STRIKES
      })
    );
  }

  private isShiftOver(): boolean {
    return this.shiftTimeLeft <= 0 || this.strikes >= MAX_STRIKES;
  }

  private endShift(): void {
    this.currentPassengerTimer?.remove();

    this.cameras.main.fadeOut(240, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('EndScene', {
        score: this.money,
        servedCustomers: this.processedPassengers,
        strikes: this.strikes,
        money: this.money,
        processedPassengers: this.processedPassengers,
        correctRoutes: this.correctRoutes
      });
    });
  }

  private getDestinationById(id: string): DestinationDefinition | undefined {
    return DESTINATION_POOL.find((destination) => destination.id === id);
  }

  private buildDestinationOptions(correctDestinationId: string, count: number): DestinationDefinition[] {
    const correctDestination = this.getDestinationById(correctDestinationId);
    if (!correctDestination) {
      return [];
    }

    const decoys = Phaser.Utils.Array.Shuffle(
      DESTINATION_POOL.filter((destination) => destination.id !== correctDestinationId)
    ).slice(0, Math.max(0, count - 1));

    return Phaser.Utils.Array.Shuffle([correctDestination, ...decoys]);
  }

  private formatPassengerCard(passenger: PassengerProfile): string {
    return [
      `${translateDataText('Document')}: ${translateDataText(passenger.routing.documentText)}`,
      `${translateDataText('Declared route')}: ${translateDataText(passenger.routing.declaredRoute)}`,
      `${translateDataText('Language tag')}: ${translateDataText(passenger.routing.languageTag)}`,
      `${translateDataText('Symbol')}: ${translateDataText(passenger.routing.symbol)}`,
      `${translateDataText('Mark')}: ${translateDataText(passenger.routing.mark)}`
    ].join('\n');
  }

  private formatPassengerSummary(passenger: PassengerProfile): string {
    const originCountry = this.getLocalizedCountryName(passenger.summary.originCountryId);
    const passportCountry = passenger.summary.passportCountryId
      ? this.getLocalizedCountryName(passenger.summary.passportCountryId)
      : t('kiosk.passportMissing');

    return [
      `${t('kiosk.originCountry')}: ${originCountry}`,
      `${t('kiosk.passportCountry')}: ${passportCountry}`,
      `${t('kiosk.spokenLanguage')}: ${translateDataText(passenger.summary.spokenLanguage)}`
    ].join('\n');
  }

  private getLocalizedDestinationLabel(destination: DestinationDefinition): string {
    return translateDestination(destination.id, destination.label);
  }

  private getLocalizedCountryName(countryId: string): string {
    const destination = this.getDestinationById(countryId);
    return destination ? this.getLocalizedDestinationLabel(destination) : countryId.toUpperCase();
  }

  private renderRouteCard(passenger: PassengerProfile): void {
    if (passenger.routeCard.mode === 'flag' && passenger.routeCard.flagCountryCode) {
      this.routeCardLabelText.setText(t('kiosk.flagClue'));
      this.destinationFlagText.setText(this.getFlagEmoji(passenger.routeCard.flagCountryCode));
      this.passengerIndicatorsText.setText('');
      return;
    }

    this.routeCardLabelText.setText(translateDataText(passenger.routeCard.hintLabel ?? 'Route code'));
    this.destinationFlagText.setText('');
    this.passengerIndicatorsText.setText(translateDataText(passenger.routeCard.hintValue ?? ''));
  }

  private getFlagEmoji(countryCode: string): string {
    if (!/^[A-Z]{2}$/i.test(countryCode)) {
      return '??';
    }

    return countryCode
      .toUpperCase()
      .split('')
      .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join('');
  }

  private resolveAccentColor(hexColor: string | undefined, fallback: number): number {
    if (!hexColor) {
      return fallback;
    }

    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }
}
