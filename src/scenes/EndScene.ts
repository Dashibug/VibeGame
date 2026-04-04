import Phaser from 'phaser';
import { t } from '../i18n';
import type { EndShiftData } from '../types';
import { TextButton } from '../ui/Button';

export class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  create(data: EndShiftData): void {
    const { width, height } = this.scale;
    const money = data.money ?? data.score;
    const processedPassengers = data.processedPassengers ?? data.servedCustomers;
    const correctRoutes = data.correctRoutes ?? Math.max(0, processedPassengers - data.strikes);
    const accuracy = processedPassengers > 0 ? Math.round((correctRoutes / processedPassengers) * 100) : 0;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a1120);
    this.add.rectangle(width / 2, height / 2, 760, 410, 0x121d31).setStrokeStyle(2, 0x6f88ac, 0.6);
    this.add.rectangle(width / 2, 120, 760, 74, 0x182743, 0.78);
    this.add.rectangle(width / 2, height / 2 + 74, 700, 190, 0x0e1627, 0.34).setStrokeStyle(1, 0x415e87, 0.4);

    this.add
      .text(width / 2, 122, t('end.title'), {
        fontFamily: 'Georgia, serif',
        fontSize: '44px',
        color: '#f2f6ff'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 164, t('end.subtitle'), {
        fontFamily: 'Verdana, sans-serif',
        fontSize: '18px',
        color: '#adc4e6'
      })
      .setOrigin(0.5);

    const statStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '28px',
      color: '#d8e5fa'
    };

    const accentStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Courier New, monospace',
      fontSize: '22px',
      color: '#f1d7a0'
    };

    this.add.text(width / 2, 220, t('end.creditsEarned', { money }), statStyle).setOrigin(0.5);
    this.add.text(width / 2, 265, t('end.passengersProcessed', { count: processedPassengers }), statStyle).setOrigin(0.5);
    this.add.text(width / 2, 310, t('end.correctRoutes', { count: correctRoutes }), statStyle).setOrigin(0.5);
    this.add.text(width / 2, 355, t('end.strikes', { count: data.strikes }), statStyle).setOrigin(0.5);
    this.add.text(width / 2, 396, t('end.routingAccuracy', { accuracy }), accentStyle).setOrigin(0.5);

    new TextButton(this, width / 2 - 130, 470, t('end.restartShift'), {
      width: 220,
      height: 52,
      fontSize: '21px',
      onClick: () => this.scene.start('KioskScene')
    });

    new TextButton(this, width / 2 + 130, 470, t('end.backToMenu'), {
      width: 220,
      height: 52,
      fontSize: '21px',
      onClick: () => this.scene.start('MenuScene')
    });

    this.cameras.main.fadeIn(220, 0, 0, 0);
  }
}
