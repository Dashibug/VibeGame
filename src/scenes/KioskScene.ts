import Phaser from 'phaser';
import { DESTINATION_POOL, PASSENGER_PROFILES } from '../data/customers';
import { t, translateDataText, translateDestination } from '../i18n';
import type { DestinationDefinition, PassengerProfile } from '../types';
import { TextButton } from '../ui/Button';
import { CharacterFace, type FaceExpression } from '../ui/CharacterFace';

const SHIFT_DURATION_SECONDS = 120;
const MAX_STRIKES = 3;
const PASSENGER_TIMEOUT_MS = 20000;

export class KioskScene extends Phaser.Scene {
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
  private routeFlagFrame!: Phaser.GameObjects.Rectangle;
  private customerName!: Phaser.GameObjects.Text;
  private customerLine!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private hudText!: Phaser.GameObjects.Text;
  private characterFace!: CharacterFace;
  private dialoguePanel!: Phaser.GameObjects.Rectangle;
  private namePlate!: Phaser.GameObjects.Rectangle;
  private dialogueAccent!: Phaser.GameObjects.Rectangle;
  private customerBaseX = 0;
  private customerBaseY = 0;

  private currentPassenger: PassengerProfile | null = null;
  private activeDestinations: DestinationDefinition[] = [];
  private destinationButtons: Record<string, TextButton> = {};
  private currentPassengerTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('KioskScene');
  }

  preload(): void {}

  create(): void {
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

    // New color palette for retro government terminal
    const darkNavy = 0x0a0f1a;
    const nearBlack = 0x000000;
    const mutedSteelBlue = 0x1a2332;
    const wornMetal = 0x2a3440;
    const fadedBrass = 0x5a4a3a;
    const dullGrayBlue = 0x3a4555;
    const warmPaper = 0xd4c4a8;
    const fadedBeige = 0xe8dcc0;
    const mutedAmber = 0xb8860b;
    const dustyRed = 0x8b4513;
    const desaturatedCyan = 0x5f9ea0;
    const softGreen = 0x228b22;

    // Background gradient
    const sky = this.add.graphics();
    sky.fillGradientStyle(darkNavy, darkNavy, nearBlack, nearBlack, 1);
    sky.fillRect(0, 0, width, height);

    // Subtle grid overlay for institutional feel
    const worldGrid = this.add.graphics();
    worldGrid.lineStyle(1, dullGrayBlue, 0.1);
    for (let x = 24; x < width; x += 48) {
      worldGrid.lineBetween(x, 0, x, height);
    }
    for (let y = 20; y < height; y += 40) {
      worldGrid.lineBetween(0, y, width, y);
    }

    // Vignette for depth
    const vignette = this.add.graphics();
    vignette.fillStyle(nearBlack, 0.6);
    vignette.fillRect(0, 0, width, 60);
    vignette.fillRect(0, height - 60, width, 60);
    vignette.fillRect(0, 0, 40, height);
    vignette.fillRect(width - 40, 0, 40, height);

    // Main frame borders with layered depth
    this.add.rectangle(width / 2, height / 2, width - 20, height - 20, nearBlack, 0.8).setStrokeStyle(3, wornMetal, 0.9);
    this.add.rectangle(width / 2, height / 2, width - 40, height - 40, mutedSteelBlue, 0.6).setStrokeStyle(2, fadedBrass, 0.7);
    this.add.rectangle(width / 2, height / 2, width - 60, height - 60, nearBlack, 0).setStrokeStyle(1, dullGrayBlue, 0.5);

    // Top bar with institutional styling
    this.add.rectangle(width / 2, layout.topBarH / 2, width, layout.topBarH, wornMetal, 0.95);
    this.add.rectangle(width / 2, layout.topBarH - 6, width - 48, 4, fadedBrass, 0.4);
    this.add.rectangle(width / 2, layout.topBarH - 2, width - 24, 2, mutedAmber, 0.2);

    // Panel frames with inset styling
    const leftPanelInset = this.add.rectangle(layout.leftPanelX, layout.panelY, layout.leftPanelW - 8, layout.panelH - 8, nearBlack, 0.9);
    leftPanelInset.setStrokeStyle(2, wornMetal, 0.8);
    this.add.rectangle(layout.leftPanelX, layout.panelY, layout.leftPanelW, layout.panelH, 0).setStrokeStyle(3, fadedBrass, 0.6);

    const rightPanelInset = this.add.rectangle(layout.rightPanelX, layout.panelY, layout.rightPanelW - 8, layout.panelH - 8, nearBlack, 0.9);
    rightPanelInset.setStrokeStyle(2, wornMetal, 0.8);
    this.add.rectangle(layout.rightPanelX, layout.panelY, layout.rightPanelW, layout.panelH, 0).setStrokeStyle(3, fadedBrass, 0.6);

    // Divider with worn metal styling
    const dividerX = layout.sidePad + layout.leftPanelW + layout.gap / 2;
    this.add.rectangle(dividerX, layout.panelY, 8, layout.panelH, wornMetal, 0.95);
    this.add.rectangle(dividerX + 2, layout.panelY, 4, layout.panelH, fadedBrass, 0.3);
    this.add.rectangle(dividerX, layout.panelY, 8, layout.panelH, 0).setStrokeStyle(1, dullGrayBlue, 0.7);

    // Window frame with layered borders
    const windowX = layout.leftPanelX;
    const windowY = layout.topBarH + 82;
    const windowW = layout.leftPanelW - 56;
    const windowH = 128;

    this.add.rectangle(windowX, windowY, windowW + 16, windowH + 16, wornMetal, 0.9).setStrokeStyle(2, fadedBrass, 0.8);
    this.add.rectangle(windowX, windowY, windowW + 8, windowH + 8, nearBlack, 0.95).setStrokeStyle(1, dullGrayBlue, 0.6);
    this.add.rectangle(windowX, windowY, windowW, windowH, mutedSteelBlue, 0.98).setStrokeStyle(2, wornMetal, 0.7);

    // Subtle scanline effect
    for (let i = 0; i < windowH; i += 4) {
      this.add.rectangle(windowX, windowY - windowH/2 + i, windowW - 4, 1, nearBlack, 0.1);
    }

    // Ambient lighting
    this.add.ellipse(layout.rightPanelX + 110, layout.topBarH + 76, 180, 60, mutedAmber, 0.08);

    // Institutional labels
    this.add.text(windowX, windowY - 70, t('kiosk.windowTitle'), {
      fontFamily: 'serif',
      fontSize: '18px',
      color: '#c4b89a'
    }).setOrigin(0.5);

    // Character face stickman
    this.characterFace = new CharacterFace(this, {
      x: windowX,
      y: windowY + 2,
      scale: 1
    });
    this.characterFace.getContainer().setDepth(22);
    this.customerBaseX = windowX;
    this.customerBaseY = windowY + 2;

    // Console title with institutional styling
    this.add.text(layout.rightPanelX, layout.topBarH + 22, t('kiosk.consoleTitle'), {
      fontFamily: 'serif',
      fontSize: '22px',
      color: '#c4b89a'
    }).setOrigin(0.5);

    // Subtle scanline effect on panels
    for (let i = 0; i < layout.panelH; i += 6) {
      this.add.rectangle(layout.leftPanelX, layout.panelY - layout.panelH/2 + i, layout.leftPanelW - 16, 1, 0x000000, 0.05);
      this.add.rectangle(layout.rightPanelX, layout.panelY - layout.panelH/2 + i, layout.rightPanelW - 16, 1, 0x000000, 0.05);
    }

    // Subtle ambient flicker
    this.time.addEvent({
      delay: 3000 + Math.random() * 2000,
      loop: true,
      callback: () => {
        const flicker = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.02);
        this.tweens.add({
          targets: flicker,
          alpha: 0,
          duration: 100 + Math.random() * 50,
          onComplete: () => flicker.destroy()
        });
      }
    });
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
    const routeFlagX = rightColumnX - rightColumnWidth / 2 + 64;
    const routeFlagY = columnsTopY - columnHeight / 2 + 148;

    // HUD with institutional styling
    this.hudText = this.add.text(layout.sidePad, 16, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#c4b89a'
    });

    const dialogueX = layout.sidePad + layout.leftPanelW / 2;
    const dialogueY = layout.topBarH + 312;
    const dialogueW = layout.leftPanelW - 20;
    const dialogueH = 176;

    // Dialogue panel with worn panel styling
    this.dialoguePanel = this.add
      .rectangle(dialogueX, dialogueY, dialogueW, dialogueH, 0x2a3440, 0.9)
      .setStrokeStyle(2, 0x5a4a3a, 0.7);
    this.dialogueAccent = this.add.rectangle(dialogueX - dialogueW / 2 + 3, dialogueY, 6, dialogueH - 10, 0xb8860b, 0.6);
    this.namePlate = this.add
      .rectangle(dialogueX - dialogueW / 2 + 78, dialogueY - dialogueH / 2 + 22, 148, 34, 0x1a2332, 0.95)
      .setStrokeStyle(1, 0x3a4555, 0.6);

    this.customerName = this.add.text(dialogueX - dialogueW / 2 + 16, dialogueY - dialogueH / 2 + 5, '', {
      fontFamily: 'serif',
      fontSize: '28px',
      color: '#e8dcc0'
    });

    this.customerLine = this.add.text(dialogueX - dialogueW / 2 + 16, dialogueY - dialogueH / 2 + 50, '', {
      fontFamily: 'serif',
      fontSize: '18px',
      color: '#d4c4a8',
      wordWrap: { width: dialogueW - 34 }
    });

    // Column panels with layered borders and paper styling
    this.add.rectangle(leftColumnX, columnsTopY, leftColumnWidth, columnHeight, 0x2a3440, 0.9).setStrokeStyle(3, 0x5a4a3a, 0.8);
    this.add.rectangle(leftColumnX, columnsTopY, leftColumnWidth - 8, columnHeight - 8, 0x1a2332, 0.95).setStrokeStyle(2, 0x3a4555, 0.7);

    this.add.rectangle(centerColumnX, columnsTopY, centerColumnWidth, columnHeight, 0x2a3440, 0.9).setStrokeStyle(3, 0x5a4a3a, 0.8);
    this.add.rectangle(centerColumnX, columnsTopY, centerColumnWidth - 8, columnHeight - 8, 0x1a2332, 0.95).setStrokeStyle(2, 0x3a4555, 0.7);

    this.add.rectangle(rightColumnX, columnsTopY, rightColumnWidth, columnHeight, 0x2a3440, 0.9).setStrokeStyle(3, 0x5a4a3a, 0.8);
    this.add.rectangle(rightColumnX, columnsTopY, rightColumnWidth - 8, columnHeight - 8, 0x1a2332, 0.95).setStrokeStyle(2, 0x3a4555, 0.7);

    // Title plates
    this.add.rectangle(leftColumnX, columnsTopY - columnHeight / 2 + 24, leftColumnWidth - 16, 36, 0x3a4555, 0.95)
      .setStrokeStyle(1, 0x5a4a3a, 0.6);
    this.add.text(centerColumnX, columnsTopY - columnHeight / 2 + 24, t('kiosk.documentsTitle'), {
      fontFamily: 'serif',
      fontSize: '16px',
      color: '#c4b89a'
    }).setOrigin(0.5);

    this.add.text(rightColumnX, columnsTopY - columnHeight / 2 + 24, t('kiosk.cluesTitle'), {
      fontFamily: 'serif',
      fontSize: '16px',
      color: '#c4b89a'
    }).setOrigin(0.5);

    this.routeCardLabelText = this.add.text(rightColumnX - rightColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 58, t('kiosk.flagClue'), {
      fontFamily: 'serif',
      fontSize: '17px',
      color: '#5f9ea0',
      wordWrap: { width: rightColumnWidth - 72 }
    });

    // Passenger summary with institutional styling
    this.caseFileText = this.add.text(leftColumnX - leftColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 16, '', {
      fontFamily: 'serif',
      fontSize: '18px',
      color: '#c4b89a'
    });

    // Document area with paper styling
    this.add
      .rectangle(centerColumnX, columnsTopY, centerColumnWidth - 24, columnHeight - 24, 0xd4c4a8, 0.95)
      .setStrokeStyle(2, 0x8b4513, 0.8);
    this.add.rectangle(centerColumnX, columnsTopY, centerColumnWidth - 52, columnHeight - 52, 0xe8dcc0, 0.9)
      .setStrokeStyle(1, 0x5a4a3a, 0.5);
    this.add.rectangle(centerColumnX, columnsTopY + 2, centerColumnWidth - 120, 4, 0xb8860b, 0.2);
    this.drawDocumentStamp(centerColumnX + centerColumnWidth / 2 - 54, columnsTopY + columnHeight / 2 - 78);

    // Route card area
    this.routeFlagFrame = this.add
      .rectangle(routeFlagX, routeFlagY, 66, 66, 0x1a2332, 0.9)
      .setStrokeStyle(1, 0x5f9ea0, 0.4)
      .setVisible(false);

    this.routingBrief = this.add.text(leftColumnX - leftColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 58, '', {
      fontFamily: 'serif',
      fontSize: '15px',
      color: '#8b4513',
      wordWrap: { width: leftColumnWidth - 36 }
    });
    this.routingBrief.setLineSpacing(6);

    this.passengerCardText = this.add.text(centerColumnX - centerColumnWidth / 2 + 34, columnsTopY - columnHeight / 2 + 48, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#1a2332',
      wordWrap: { width: centerColumnWidth - 70 }
    });
    this.passengerCardText.setLineSpacing(4);

    this.destinationFlagText = this.add.text(routeFlagX, routeFlagY, '', {
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontSize: '42px'
    }).setOrigin(0.5);

    this.passengerIndicatorsText = this.add.text(rightColumnX - rightColumnWidth / 2 + 18, columnsTopY - columnHeight / 2 + 156, '', {
      fontFamily: 'serif',
      fontSize: '15px',
      color: '#5f9ea0',
      wordWrap: { width: rightColumnWidth - 36 }
    });
    this.passengerIndicatorsText.setLineSpacing(8);

    this.feedbackText = this.add.text(rightPanelLeft + 22, layout.topBarH + 476, '', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#c4b89a',
      wordWrap: { width: sectionWidth - 44 }
    });

    this.refreshHud();
  }

  private drawDocumentStamp(x: number, y: number): void {
    const stampColor = 0x9d1d22;
    const stamp = this.add.graphics();

    stamp.fillStyle(stampColor, 0.05);
    stamp.fillCircle(x, y, 44);
    stamp.lineStyle(4, stampColor, 0.72);
    stamp.strokeCircle(x, y, 44);
    stamp.lineStyle(2, stampColor, 0.58);
    stamp.strokeCircle(x, y, 34);
    stamp.strokeCircle(x, y, 18);

    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12;
      const innerX = x + Math.cos(angle) * 22;
      const innerY = y + Math.sin(angle) * 22;
      const outerX = x + Math.cos(angle) * 32;
      const outerY = y + Math.sin(angle) * 32;
      stamp.lineBetween(innerX, innerY, outerX, outerY);
    }

    const starPoints = [];
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
      const radius = i % 2 === 0 ? 14 : 7;
      starPoints.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
      });
    }
    stamp.lineStyle(2, stampColor, 0.68);
    stamp.strokePoints(starPoints, true, true);

    this.add
      .text(x, y + 24, 'ROUTE', {
        fontFamily: 'serif',
        fontSize: '13px',
        color: '#9d1d22'
      })
      .setOrigin(0.5)
      .setAlpha(0.68)
      .setAngle(-8);
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
        fontSize: '16px',
        backgroundColor: 0x2a3440, // worn metal
        hoverColor: 0x3a4555, // dull gray-blue
        activeColor: 0x5f9ea0, // desaturated cyan
        strokeColor: 0x5a4a3a, // faded brass
        textColor: '#c4b89a',
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

    // Set character face to neutral expression
    this.characterFace.setExpression('neutral');

    this.tweens.killTweensOf(this.characterFace.getContainer());
    this.characterFace.getContainer().setAlpha(0);
    this.characterFace.getContainer().setScale(0.97);
    this.tweens.add({
      targets: this.characterFace.getContainer(),
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 420,
      ease: 'Sine.easeOut',
      onComplete: () => this.startCustomerIdleAnimation()
    });

    this.tweens.add({
      targets: [this.customerName, this.customerLine, this.dialoguePanel, this.namePlate],
      alpha: { from: 0.65, to: 1 },
      duration: 280
    });

    this.currentPassengerTimer = this.time.addEvent({
      delay: PASSENGER_TIMEOUT_MS,
      callback: () => {
        if (!this.currentPassenger) {
          return;
        }

        this.playCustomerReaction('impatient');
        this.registerFail(
          t('kiosk.timeoutFeedback', {
            strike: this.currentPassenger.strikePenalty ?? 1
          }),
          this.currentPassenger.strikePenalty ?? 1
        );
      }
    });
  }

  private startCustomerIdleAnimation(): void {
    this.tweens.killTweensOf(this.characterFace.getContainer());
    this.characterFace.getContainer().setPosition(this.customerBaseX, this.customerBaseY);

    // Bobbing animation
    this.tweens.add({
      targets: this.characterFace.getContainer(),
      y: this.customerBaseY + 3,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtle side-to-side sway
    this.tweens.add({
      targets: this.characterFace.getContainer(),
      x: this.customerBaseX + 2,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private playCustomerReaction(type: 'satisfied' | 'annoyed' | 'impatient'): void {
    this.tweens.killTweensOf(this.characterFace.getContainer());

    let faceExpression: FaceExpression;
    let shakeCount = 0;
    let shakeAmount = 0;
    let scaleAmount = 1;

    if (type === 'satisfied') {
      faceExpression = 'happy';
      shakeAmount = 2;
      shakeCount = 2;
      scaleAmount = 1.15;
      this.dialogueAccent.setFillStyle(0x86d9b1, 0.6);
      this.namePlate.setFillStyle(0x17322d, 0.92);
      this.customerLine.setColor('#d9f1e5');
    } else if (type === 'annoyed') {
      faceExpression = 'angry';
      shakeAmount = 5;
      shakeCount = 4;
      this.dialogueAccent.setFillStyle(0xd19aa0, 0.62);
      this.namePlate.setFillStyle(0x381f2b, 0.92);
      this.customerLine.setColor('#f0d7dc');
    } else {
      faceExpression = 'tired';
      shakeAmount = 3;
      shakeCount = 3;
      this.dialogueAccent.setFillStyle(0xb3b7d8, 0.58);
      this.namePlate.setFillStyle(0x262b45, 0.92);
      this.customerLine.setColor('#e2e6f7');
    }

    this.characterFace.setExpression(faceExpression);

    // Shake and scale reaction animation
    if (shakeCount > 0) {
      this.tweens.add({
        targets: this.characterFace.getContainer(),
        x: this.customerBaseX + shakeAmount,
        duration: 60,
        yoyo: true,
        repeat: shakeCount,
        ease: 'Linear'
      });

      if (scaleAmount !== 1) {
        this.tweens.add({
          targets: this.characterFace.getContainer(),
          scaleX: scaleAmount,
          scaleY: scaleAmount,
          duration: 100,
          yoyo: true,
          repeat: shakeCount - 1,
          ease: 'Quad.easeInOut'
        });
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
      this.processedPassengers += 1;
      this.correctRoutes += 1;
      this.playCustomerReaction('satisfied');
      this.feedback(
        t('kiosk.successFeedback', {
          route: destination ? this.getLocalizedDestinationLabel(destination) : t('kiosk.targetRoute')
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
        strike: passenger.strikePenalty ?? 1
      }),
      passenger.strikePenalty ?? 1
    );
  }

  private registerFail(message: string, strikePenalty: number): void {
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
        servedCustomers: this.processedPassengers,
        strikes: this.strikes,
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
      this.routeFlagFrame.setVisible(true);
      this.destinationFlagText.setText(this.getFlagEmoji(passenger.routeCard.flagCountryCode));
      this.passengerIndicatorsText.setText('');
      return;
    }

    this.routeCardLabelText.setText(translateDataText(passenger.routeCard.hintLabel ?? 'Route code'));
    this.routeFlagFrame.setVisible(false);
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
