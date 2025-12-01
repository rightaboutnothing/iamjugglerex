reset() {
    this.credits = 50;
    this.bet = 0;
    this.payout = 0;
    this.stats = {
        games: 0,
        big: 0,
        reg: 0
    };
    this.state = 'IDLE';
    this.bonusState = null;
    this.ui.lightGogoLamp(false);
    this.updateUI();
}
}
