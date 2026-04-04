import Phaser from 'phaser';
import { DESTINATION_POOL, PASSENGER_PROFILES } from '../data/customers';
import { t, tList, translateDataText, translateDestination } from '../i18n';
import type { DestinationDefinition, PassengerProfile } from '../types';
import { TextButton } from '../ui/Button';

const SHIFT_DURATION_SECONDS = 120;
const MAX_STRIKES = 3;
const PASSENGER_TIMEOUT_MS = 14000;

export class KioskScene extends Phaser.Scene {
  private money = 0;
  private strikes = 0;
  private processedPassengers = 0;
  private correctRoutes = 0;
  private shiftTimeLeft = SHIFT_DURATION_SECONDS;

  private routingBrief!: Phaser.GameObjects.Text;
  private passengerCardText!: Phaser.GameObjects.Text;
  private passengerIndicatorsText!: Phaser.GameObjects.Text;
  private customerName!: Phaser.GameObjects.Text;
  private customerLine!: Phaser.GameObjects.Text;
  private selectionText!: Phaser.GameObjects.Text;
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
  private ambienceText!: Phaser.GameObjects.Text;
  private customerBaseX = 0;
  private customerBaseY = 0;

  private currentPassenger: PassengerProfile | null = null;
  private selectedDestinationId: string | null = null;
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
    this.createDestinationButtons();
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

    this.time.addEvent({
      delay: 3200,
      loop: true,
      callback: () => {
        this.ambienceText.setText(Phaser.Utils.Array.GetRandom(tList('kiosk.ambient')));
        this.tweens.add({
          targets: this.ambienceText,
          alpha: { from: 0.3, to: 0.95 },
          duration: 420
        });
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

    const coldSkyTop = 0x050911;
    const coldSkyBottom = 0x0d1c34;
    const exteriorPanel = 0x0b1526;
    const interiorPanel = 0x151e2e;
    const interiorAccent = 0x2e3f58;
    const warmGlow = 0xe6b36b;

    const sky = this.add.graphics();
    sky.fillGradientStyle(coldSkyTop, coldSkyTop, coldSkyBottom, coldSkyBottom, 1);
    sky.fillRect(0, 0, width, height);

    this.add.ellipse(width - 220, 96, 260, 120, 0x7cb7ff, 0.12);
    this.add.ellipse(width - 220, 96, 190, 80, 0xc2ddff, 0.07);
    this.add.ellipse(layout.sidePad + layout.leftPanelW / 2, 148, 210, 90, 0x9dc7ff, 0.06);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.18);
    vignette.fillRect(0, 0, width, 44);
    vignette.fillRect(0, height - 44, width, 44);
    vignette.fillRect(0, 0, 22, height);
    vignette.fillRect(width - 22, 0, 22, height);

    this.add.rectangle(width / 2, layout.topBarH / 2, width, layout.topBarH, 0x10233f, 0.62);
    this.add.rectangle(width / 2, height - layout.bottomBarH / 2, width, layout.bottomBarH, 0x1a2438, 0.95);

    this.add
      .rectangle(layout.leftPanelX, layout.panelY, layout.leftPanelW, layout.panelH, exteriorPanel, 0.93)
      .setStrokeStyle(2, 0x35557f, 0.8);
    this.add
      .rectangle(layout.rightPanelX, layout.panelY, layout.rightPanelW, layout.panelH, interiorPanel, 0.94)
      .setStrokeStyle(2, 0x40597e, 0.9);

    const dividerX = layout.sidePad + layout.leftPanelW + layout.gap / 2;
    const leftPanelLeft = layout.sidePad;
    const leftPanelRight = layout.sidePad + layout.leftPanelW;
    this.add.rectangle(dividerX, layout.panelY, 6, layout.panelH, 0x3a5378, 0.95);
    this.add.rectangle(dividerX + 3, layout.panelY, 2, layout.panelH, 0x8cb0e0, 0.23);

    const windowX = layout.leftPanelX;
    const windowY = layout.topBarH + 82;
    const windowW = layout.leftPanelW - 56;
    const windowH = 128;

    this.add.rectangle(windowX, windowY, windowW + 8, windowH + 8, 0x0b1628, 0.58);
    this.add.rectangle(windowX, windowY, windowW, windowH, 0x15293f, 0.96).setStrokeStyle(3, 0x8db5e9, 0.48);
    this.add.rectangle(windowX, windowY, windowW - 28, windowH - 28, 0xa3d0ff, 0.07);
    this.add.rectangle(windowX, windowY + 60, windowW - 34, 18, 0x25374f, 0.97).setStrokeStyle(1, 0x7393bd, 0.58);
    this.add.rectangle(windowX, windowY + 72, windowW - 18, 6, 0x0a1628, 0.5);
    this.add.rectangle(windowX, windowY - windowH / 2 + 10, windowW - 16, 10, 0xddeeff, 0.08);

    this.add.rectangle(layout.rightPanelX, windowY + 87, layout.rightPanelW - 20, 16, interiorAccent, 0.96);
    this.add.rectangle(layout.rightPanelX, windowY + 95, layout.rightPanelW - 20, 5, 0x0f1727, 0.45);
    this.add.rectangle(dividerX + 1, windowY + 76, 24, 36, 0x25374f, 0.96).setStrokeStyle(1, 0x7393bd, 0.45);

    this.add.ellipse(layout.rightPanelX + 110, layout.topBarH + 76, 220, 78, warmGlow, 0.08);
    this.add.ellipse(layout.rightPanelX + 110, layout.topBarH + 76, 140, 48, warmGlow, 0.12);

    const snow = this.add.graphics();
    snow.fillStyle(0xb8d7ff, 0.11);
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
      color: '#cde0ff'
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
    const neonHalo = this.add.ellipse(neonX, neonY, 150, 42, 0x4fd7ff, 0.1);
    const neonSign = this.add.rectangle(neonX, neonY, 86, 16, 0x68e3ff, 0.28).setStrokeStyle(1, 0xbef2ff, 0.4);
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
      .rectangle(layout.leftPanelX, layout.topBarH + 278, layout.leftPanelW - 20, 200, 0x08101d, 0.28)
      .setStrokeStyle(1, 0x2f4b73, 0.35);

    this.add
      .rectangle(layout.rightPanelX, layout.topBarH + 252, layout.rightPanelW - 22, 214, 0x11243e, 0.24)
      .setStrokeStyle(1, 0x3f5a83, 0.35);

    this.add
      .rectangle(layout.rightPanelX, layout.topBarH + 62, layout.rightPanelW - 20, 72, 0x152844, 0.86)
      .setStrokeStyle(1, 0x59779f, 0.65);
    this.add.text(layout.rightPanelX, layout.topBarH + 32, t('kiosk.consoleTitle'), {
      fontFamily: 'Georgia, serif',
      fontSize: '23px',
      color: '#dbe9ff'
    }).setOrigin(0.5);

    this.add.text(layout.sidePad + 12, height - layout.bottomBarH + 12, t('kiosk.arrivalSide'), {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '13px',
      color: '#7595bc'
    });
    this.add.text(layout.sidePad + layout.leftPanelW + layout.gap + 12, height - layout.bottomBarH + 12, t('kiosk.controlSide'), {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '13px',
      color: '#7595bc'
    });
  }

  private createUI(): void {
    const layout = this.getLayout();
    const rightPanelLeft = layout.sidePad + layout.leftPanelW + layout.gap;
    const rightTextX = rightPanelLeft + 30;
    const rightTextWidth = layout.rightPanelW - 60;
    const sectionCenterX = rightPanelLeft + layout.rightPanelW / 2;
    const sectionWidth = layout.rightPanelW - 24;

    this.hudText = this.add.text(layout.sidePad, 16, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '22px',
      color: '#eef4ff'
    });

    const dialogueX = layout.sidePad + layout.leftPanelW / 2;
    const dialogueY = layout.topBarH + 312;
    const dialogueW = layout.leftPanelW - 20;
    const dialogueH = 176;

    this.dialoguePanel = this.add
      .rectangle(dialogueX, dialogueY, dialogueW, dialogueH, 0x071120, 0.56)
      .setStrokeStyle(1, 0x3d5f88, 0.42);
    this.dialogueAccent = this.add.rectangle(dialogueX - dialogueW / 2 + 3, dialogueY, 6, dialogueH - 10, 0x82b0e8, 0.5);
    this.namePlate = this.add
      .rectangle(dialogueX - dialogueW / 2 + 78, dialogueY - dialogueH / 2 + 22, 148, 34, 0x12243d, 0.92)
      .setStrokeStyle(1, 0x5f83b0, 0.62);

    this.customerName = this.add.text(dialogueX - dialogueW / 2 + 16, dialogueY - dialogueH / 2 + 5, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '31px',
      color: '#f1f6ff'
    });

    this.customerLine = this.add.text(dialogueX - dialogueW / 2 + 16, dialogueY - dialogueH / 2 + 50, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '19px',
      color: '#d7e3f8',
      wordWrap: { width: dialogueW - 34 }
    });

    this.add
      .rectangle(sectionCenterX, layout.topBarH + 126, sectionWidth, 86, 0x18263d, 0.38)
      .setStrokeStyle(1, 0x3f5e86, 0.45);
    this.add
      .rectangle(sectionCenterX, layout.topBarH + 234, sectionWidth, 128, 0x142338, 0.34)
      .setStrokeStyle(1, 0x355276, 0.42);
    this.add
      .rectangle(sectionCenterX, layout.topBarH + 372, sectionWidth, 108, 0x111d2f, 0.34)
      .setStrokeStyle(1, 0x31506f, 0.38);
    this.add.rectangle(sectionCenterX, layout.topBarH + 172, sectionWidth - 2, 2, 0x355276, 0.18);
    this.add.rectangle(sectionCenterX, layout.topBarH + 298, sectionWidth - 2, 2, 0x355276, 0.16);

    this.routingBrief = this.add.text(rightTextX, layout.topBarH + 92, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '17px',
      color: '#f2f7ff',
      wordWrap: { width: rightTextWidth - 8 }
    });
    this.routingBrief.setLineSpacing(6);

    this.passengerCardText = this.add.text(rightTextX, layout.topBarH + 184, '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#c9dcf6',
      wordWrap: { width: rightTextWidth - 12 }
    });
    this.passengerCardText.setLineSpacing(4);

    this.passengerIndicatorsText = this.add.text(rightTextX, layout.topBarH + 330, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '17px',
      color: '#f3dec0',
      wordWrap: { width: rightTextWidth - 12 }
    });
    this.passengerIndicatorsText.setLineSpacing(8);

    this.selectionText = this.add.text(rightTextX, layout.topBarH + 430, t('kiosk.selectedRouteNone'), {
      fontFamily: 'Courier New, monospace',
      fontSize: '18px',
      color: '#a4e7da',
      wordWrap: { width: rightTextWidth }
    });

    this.feedbackText = this.add.text(rightTextX, layout.topBarH + 462, '', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '16px',
      color: '#f3d7a5',
      wordWrap: { width: rightTextWidth }
    });

    this.ambienceText = this.add.text(layout.sidePad + 12, layout.height - layout.bottomBarH + 38, tList('kiosk.ambient')[0], {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#99afcf'
    });

    new TextButton(this, layout.width - layout.sidePad - 112, layout.height - layout.bottomBarH / 2, t('kiosk.dispatchButton'), {
      width: 224,
      height: 54,
      fontSize: '24px',
      backgroundColor: 0x255946,
      hoverColor: 0x3b8a6a,
      activeColor: 0x3b8a6a,
      strokeColor: 0x86c6af,
      onClick: () => this.handleDispatch()
    });

    this.refreshHud();
  }

  private createDestinationButtons(): void {
    const layout = this.getLayout();
    const columns = 2;
    const innerPad = 26;
    const buttonGapX = 16;
    const buttonWidth = (layout.rightPanelW - innerPad * 2 - buttonGapX) / columns;
    const buttonGapY = 58;
    const buttonHeight = 46;
    const startX = layout.sidePad + layout.leftPanelW + layout.gap + innerPad + buttonWidth / 2;
    const maxGridBottom = layout.height - layout.bottomBarH - 24;
    const rowCount = Math.ceil(DESTINATION_POOL.length / columns);
    let startY = layout.topBarH + 514;
    const projectedBottom = startY + (rowCount - 1) * buttonGapY + buttonHeight / 2;

    if (projectedBottom > maxGridBottom) {
      startY -= projectedBottom - maxGridBottom;
    }

    DESTINATION_POOL.forEach((destination, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = startX + col * (buttonWidth + buttonGapX);
      const y = startY + row * buttonGapY;

      const button = new TextButton(this, x, y, `${destination.code}  ${this.getLocalizedDestinationLabel(destination)}`, {
        width: buttonWidth,
        height: buttonHeight,
        fontSize: '18px',
        backgroundColor: 0x273653,
        hoverColor: 0x3f5d88,
        activeColor: 0x6a5130,
        strokeColor: 0x7ca3d1,
        onClick: () => this.selectDestination(destination)
      });
      this.destinationButtons[destination.id] = button;
    });
  }

  private selectDestination(destination: DestinationDefinition): void {
    this.selectedDestinationId = destination.id;
    this.updateDestinationButtonStates();
    this.updateSelectionText();
  }

  private updateSelectionText(): void {
    if (!this.selectedDestinationId) {
      this.selectionText.setText(t('kiosk.selectedRouteNone'));
      return;
    }

    const destination = this.getDestinationById(this.selectedDestinationId);
    if (!destination) {
      this.selectionText.setText(t('kiosk.selectedRouteNone'));
      return;
    }

    this.selectionText.setText(
      t('kiosk.selectedRouteValue', {
        route: this.getLocalizedDestinationLabel(destination),
        code: destination.code
      })
    );
  }

  private spawnNextPassenger(): void {
    this.currentPassengerTimer?.remove();

    const passenger = Phaser.Utils.Array.GetRandom(PASSENGER_PROFILES);
    this.currentPassenger = passenger;
    this.selectedDestinationId = null;
    this.updateDestinationButtonStates();
    this.updateSelectionText();

    this.customerName.setText(passenger.name);
    this.customerLine.setText(`"${passenger.speech}"`);
    this.customerName.setColor('#f1f6ff');
    this.customerLine.setColor('#d7e3f8');

    const accentColor = this.resolveAccentColor(passenger.card.accentColor, 0x82b0e8);
    this.dialogueAccent.setFillStyle(accentColor, 0.58);
    this.namePlate.setFillStyle(0x12243d, 0.92);

    this.routingBrief.setText(t('kiosk.routingBrief', { caseId: passenger.id.toUpperCase() }));
    this.passengerCardText.setText(this.formatPassengerCard(passenger));
    this.passengerIndicatorsText.setText(this.formatPassengerIndicators(passenger));
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

  private updateDestinationButtonStates(): void {
    DESTINATION_POOL.forEach((destination) => {
      const button = this.destinationButtons[destination.id];
      if (button) {
        button.setActiveState(this.selectedDestinationId === destination.id);
      }
    });
  }

  private handleDispatch(): void {
    if (!this.currentPassenger) {
      return;
    }

    if (!this.selectedDestinationId) {
      this.feedback(t('kiosk.chooseBeforeDispatch'), false);
      return;
    }

    this.currentPassengerTimer?.remove();

    const passenger = this.currentPassenger;
    const destination = this.getDestinationById(this.selectedDestinationId);

    if (this.selectedDestinationId === passenger.destinationId) {
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

  private formatPassengerCard(passenger: PassengerProfile): string {
    const fields = passenger.card.fields
      .map((field) => `${translateDataText(field.label)}: ${translateDataText(field.value)}`)
      .join('\n');
    return `${translateDataText(passenger.card.title)}\n${fields}`;
  }

  private formatPassengerIndicators(passenger: PassengerProfile): string {
    return [
      `${translateDataText(passenger.symbol.label)}: ${translateDataText(passenger.symbol.value)}`,
      `${translateDataText(passenger.mark.label)}: ${translateDataText(passenger.mark.value)}`,
      t('kiosk.routingNote')
    ].join('\n');
  }

  private getLocalizedDestinationLabel(destination: DestinationDefinition): string {
    return translateDestination(destination.id, destination.label);
  }

  private resolveAccentColor(hexColor: string | undefined, fallback: number): number {
    if (!hexColor) {
      return fallback;
    }

    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }
}
