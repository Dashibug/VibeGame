import Phaser from 'phaser';
import { getCurrentLanguage, getSupportedLanguages, setCurrentLanguage, t, tList, type SupportedLanguage } from '../i18n';
import { TextButton } from '../ui/Button';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;
    const currentLanguage = getCurrentLanguage();
    let introStarted = false;

    this.add.rectangle(centerX, centerY, width, height, 0x07111f);

    const backgroundGlow = this.add.ellipse(centerX, centerY - 80, width * 0.7, height * 0.55, 0x5ec8a9, 0.07);
    const topBar = this.add.rectangle(centerX, 86, width, 92, 0x0d1b30, 0.72);
    const bottomBar = this.add.rectangle(centerX, height - 62, width, 108, 0x0d1b30, 0.56);

    const mainPanel = this.add
      .rectangle(centerX, centerY - 12, Math.min(920, width - 80), Math.min(430, height - 180), 0x0f1d32, 0.82)
      .setStrokeStyle(2, 0x42688f, 0.48);

    const upperPanel = this.add
      .rectangle(centerX, centerY - 102, Math.min(840, width - 130), 134, 0x132743, 0.78)
      .setStrokeStyle(1, 0x6b94b7, 0.35);

    const lowerPanel = this.add
      .rectangle(centerX, centerY + 86, Math.min(840, width - 130), 162, 0x0b1525, 0.54)
      .setStrokeStyle(1, 0x385678, 0.42);

    const scanLines = this.add.graphics();
    scanLines.lineStyle(1, 0x86e6cc, 0.05);
    for (let y = 0; y < height; y += 8) {
      scanLines.lineBetween(0, y, width, y);
    }

    const grid = this.add.graphics();
    grid.lineStyle(1, 0x7ed8c0, 0.08);
    for (let x = 80; x < width - 80; x += 80) {
      grid.lineBetween(x, 130, x, height - 110);
    }
    for (let y = 150; y < height - 110; y += 60) {
      grid.lineBetween(80, y, width - 80, y);
    }

    const title = this.add
      .text(centerX, 96, t('menu.title'), {
        fontFamily: 'Georgia, serif',
        fontSize: '34px',
        color: '#eaf7ff',
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const subtitle = this.add
      .text(centerX, 136, t('menu.subtitle'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#92c4d4'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const statusLabel = this.add
      .text(centerX, centerY - 152, t('menu.statusLabel'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        color: '#9bc7d0'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const statusText = this.add
      .text(centerX, centerY - 116, t('menu.status.online'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '30px',
        color: '#8cf2c8',
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const statusGlow = this.add.rectangle(centerX, centerY - 115, 430, 50, 0x72efbe, 0.08).setAlpha(0);
    const pulseDot = this.add.circle(centerX - 265, centerY - 116, 7, 0x8cf2c8, 0.95).setAlpha(0);

    const boardTitle = this.add
      .text(centerX, centerY - 24, t('menu.boardTitle'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        color: '#accce4'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const boardText = this.add
      .text(centerX, centerY + 48, tList('menu.board.online').join('\n'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '22px',
        color: '#d8eef7',
        align: 'center',
        lineSpacing: 10
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const ambientText = this.add
      .text(centerX, height - 66, tList('menu.ambient.stable')[0], {
        fontFamily: 'Courier New, monospace',
        fontSize: '17px',
        color: '#88a8c0'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const failureBanner = this.add
      .rectangle(centerX, centerY - 8, Math.min(760, width - 120), 118, 0x72151f, 0.94)
      .setStrokeStyle(2, 0xff97a0, 0.65)
      .setAlpha(0);

    const failureTitle = this.add
      .text(centerX, centerY - 28, t('menu.failureTitle'), {
        fontFamily: 'Georgia, serif',
        fontSize: '34px',
        color: '#fff1f3',
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const failureSubtitle = this.add
      .text(centerX, centerY + 22, t('menu.failureSubtitle'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '24px',
        color: '#ffd1d5',
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const warningDot = this.add.circle(centerX - 320, centerY - 8, 9, 0xff7a87, 0).setScale(0.8);
    const authorizationText = this.add
      .text(centerX, centerY + 122, t('menu.authorization'), {
        fontFamily: 'Verdana, sans-serif',
        fontSize: '21px',
        color: '#e5edf8',
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const queueRiskText = this.add
      .text(centerX, centerY + 162, t('menu.queueRisk'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '19px',
        color: '#ffb7bf',
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const briefingBackdrop = this.add.rectangle(centerX, centerY, width, height, 0x050b14, 0.58);
    const briefingCard = this.add
      .rectangle(centerX, centerY, Math.min(760, width - 120), 340, 0x101a2d, 0.94)
      .setStrokeStyle(2, 0x587ca7, 0.55);
    const briefingHeader = this.add.rectangle(centerX, centerY - 126, Math.min(760, width - 120), 58, 0x152844, 0.9);

    const briefingTitle = this.add
      .text(centerX, centerY - 128, t('menu.briefingTitle'), {
        fontFamily: 'Georgia, serif',
        fontSize: '34px',
        color: '#eef6ff',
        align: 'center'
      })
      .setOrigin(0.5);

    const briefingBody = this.add
      .text(centerX, centerY - 36, t('menu.briefingBody'), {
        fontFamily: 'Verdana, sans-serif',
        fontSize: '21px',
        color: '#d6e5f8',
        align: 'center',
        wordWrap: { width: Math.min(620, width - 200) }
      })
      .setOrigin(0.5);

    const briefingHint = this.add
      .text(centerX, centerY + 66, t('menu.briefingHint'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        color: '#f1d7a0',
        align: 'center',
        wordWrap: { width: Math.min(620, width - 200) }
      })
      .setOrigin(0.5);

    const briefingLanguageLabel = this.add
      .text(centerX, centerY + 118, t('menu.language'), {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#9bc7d0'
      })
      .setOrigin(0.5);

    const briefingContainer = this.add.container(0, 0, [
      briefingBackdrop,
      briefingCard,
      briefingHeader,
      briefingTitle,
      briefingBody,
      briefingHint,
      briefingLanguageLabel
    ]);

    const languageButtons: TextButton[] = [];
    getSupportedLanguages().forEach((language, index) => {
      const button = new TextButton(this, centerX - 68 + index * 68, centerY + 156, language.toUpperCase(), {
        width: 58,
        height: 34,
        fontSize: '16px',
        backgroundColor: 0x21344c,
        hoverColor: 0x3a587d,
        activeColor: 0x6a5130,
        strokeColor: 0x80a5d1,
        onClick: () => this.switchLanguage(language)
      });
      button.setActiveState(language === currentLanguage);
      languageButtons.push(button);
    });
    briefingContainer.add(languageButtons);

    const startButton = new TextButton(this, centerX, centerY + 224, t('menu.briefingStart'), {
      width: 220,
      height: 52,
      fontSize: '24px',
      backgroundColor: 0x5c1a24,
      hoverColor: 0x8c2f3b,
      activeColor: 0x8c2f3b,
      strokeColor: 0xffa7b0,
      textColor: '#fff4f4',
      onClick: () => {
        if (introStarted) {
          return;
        }

        introStarted = true;
        this.tweens.add({
          targets: briefingContainer,
          alpha: 0,
          duration: 260,
          ease: 'Sine.easeOut',
          onComplete: () => {
            briefingContainer.setVisible(false);
            runIntroSequence();
          }
        });
      }
    });
    briefingContainer.add(startButton);

    const stableState = () => {
      statusText.setText(t('menu.status.online'));
      statusText.setColor('#8cf2c8');
      pulseDot.setFillStyle(0x8cf2c8, 0.95);
      statusGlow.setFillStyle(0x72efbe, 0.08);
      boardText.setText(tList('menu.board.online').join('\n'));
    };

    const unstableState = () => {
      statusText.setText(t('menu.status.unstable'));
      statusText.setColor('#ffd48c');
      pulseDot.setFillStyle(0xffd48c, 0.95);
      statusGlow.setFillStyle(0xffc46e, 0.12);
      boardText.setText(tList('menu.board.unstable').join('\n'));
    };

    const flickerScene = (intensity = 0.12) => {
      this.tweens.add({
        targets: [topBar, bottomBar, mainPanel, upperPanel, lowerPanel],
        alpha: { from: 1, to: 0.78 },
        duration: 70,
        yoyo: true,
        repeat: 1
      });
      this.cameras.main.flash(90, 255 * intensity, 255 * intensity, 255 * intensity, false);
    };

    const glitchText = () => {
      this.tweens.add({
        targets: [statusText, boardText, title],
        x: '+=6',
        duration: 45,
        yoyo: true,
        repeat: 3
      });
      this.tweens.add({
        targets: boardText,
        alpha: { from: 1, to: 0.72 },
        duration: 70,
        yoyo: true,
        repeat: 2
      });
    };

    const transitionToGame = () => {
      this.cameras.main.fadeOut(280, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('KioskScene');
      });
    };

    const runIntroSequence = () => {
      stableState();

      this.tweens.add({
        targets: [title, subtitle, statusLabel, statusText, statusGlow, pulseDot, boardTitle, boardText, ambientText],
        alpha: 1,
        duration: 300,
        ease: 'Sine.easeOut'
      });

      this.tweens.add({
        targets: [backgroundGlow, statusGlow],
        alpha: { from: 0.04, to: 0.1 },
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.tweens.add({
        targets: pulseDot,
        alpha: { from: 0.4, to: 1 },
        scale: { from: 0.9, to: 1.1 },
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      const ambientCues = tList('menu.ambient.stable');
      this.time.addEvent({
        delay: 1900,
        loop: true,
        callback: () => {
          ambientText.setText(Phaser.Utils.Array.GetRandom(ambientCues));
          this.tweens.add({
            targets: ambientText,
            alpha: { from: 0.45, to: 0.95 },
            duration: 320
          });
        }
      });

      this.time.delayedCall(2600, () => {
        unstableState();
        ambientText.setText(t('menu.ambient.drift'));
        flickerScene(0.1);
        glitchText();
      });

      this.time.delayedCall(3600, () => {
        ambientText.setText(t('menu.ambient.signal'));
        flickerScene(0.12);
        this.tweens.add({
          targets: statusText,
          alpha: { from: 1, to: 0.55 },
          duration: 90,
          yoyo: true,
          repeat: 2
        });
      });

      this.time.delayedCall(4700, () => {
        ambientText.setText(t('menu.ambient.failure'));
        boardText.setText(tList('menu.board.failure').join('\n'));
        flickerScene(0.14);
        glitchText();
      });

      this.time.delayedCall(5900, () => {
        this.cameras.main.shake(260, 0.004);
        this.cameras.main.flash(150, 255, 90, 90, false);
        ambientText.setText(t('menu.ambient.manual'));

        statusText.setText(t('menu.status.offline'));
        statusText.setColor('#ff9aa6');
        pulseDot.setFillStyle(0xff7a87, 0.95);
        statusGlow.setFillStyle(0xff7a87, 0.12);

        this.tweens.add({
          targets: [failureBanner, failureTitle, failureSubtitle],
          alpha: 1,
          duration: 320,
          ease: 'Sine.easeOut'
        });

        this.tweens.add({
          targets: warningDot,
          alpha: { from: 0.3, to: 1 },
          scale: { from: 0.9, to: 1.15 },
          duration: 380,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      });

      this.time.delayedCall(7100, () => {
        this.tweens.add({
          targets: [authorizationText, queueRiskText],
          alpha: 1,
          duration: 420,
          ease: 'Sine.easeOut'
        });
      });

      this.time.delayedCall(8700, () => {
        transitionToGame();
      });
    };

    this.cameras.main.fadeIn(250, 0, 0, 0);
  }

  private switchLanguage(language: SupportedLanguage): void {
    if (language === getCurrentLanguage()) {
      return;
    }

    setCurrentLanguage(language);
    this.scene.restart();
  }
}
