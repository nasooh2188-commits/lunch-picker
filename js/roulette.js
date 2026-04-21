const Roulette = {
  canvas: null,
  ctx: null,
  items: [],
  spinning: false,
  angle: 0,
  targetAngle: 0,
  animId: null,

  colors: [
    '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7',
    '#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9',
    '#F8C471','#82E0AA','#F1948A','#AED6F1','#D2B4DE',
    '#A3E4D7'
  ],

  render(el) {
    const items = [...restaurants].sort(() => Math.random() - 0.5).slice(0, 12);
    this.items = items;
    this.angle = 0;
    this.spinning = false;

    el.innerHTML = `
      <div class="sub-view">
        ${App.getBackBtn()}
        <h2>🎰 룰렛 돌리기</h2>
        <p class="sub-desc">터치해서 돌려보세요!</p>
        <div class="roulette-container">
          <div class="roulette-pointer">▼</div>
          <canvas id="rouletteCanvas" width="340" height="340"></canvas>
        </div>
        <button class="action-btn spin-btn" id="spinBtn" onclick="Roulette.spin()">🎰 돌리기!</button>
        <button class="action-btn shuffle-btn" onclick="Roulette.shuffle()">🔄 식당 섞기</button>
      </div>
    `;
    this.canvas = document.getElementById('rouletteCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.draw();
  },

  shuffle() {
    if (this.spinning) return;
    this.items = [...restaurants].sort(() => Math.random() - 0.5).slice(0, 12);
    this.angle = 0;
    this.draw();
  },

  draw() {
    const ctx = this.ctx;
    const cx = 170, cy = 170, r = 160;
    const count = this.items.length;
    const arc = (2 * Math.PI) / count;

    ctx.clearRect(0, 0, 340, 340);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);

    for (let i = 0; i < count; i++) {
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 11px "GmarketSans", sans-serif';
      const name = this.items[i].name.length > 7
        ? this.items[i].name.slice(0, 7) + '..'
        : this.items[i].name;
      ctx.fillText(name, r - 15, 4);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1c1e';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#e60012';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GO', 0, 4);

    ctx.restore();
  },

  spin() {
    if (this.spinning) return;
    this.spinning = true;
    document.getElementById('spinBtn').disabled = true;

    const count = this.items.length;
    const extraTurns = 5 + Math.random() * 5;
    const targetSlice = Math.floor(Math.random() * count);
    const arc = (2 * Math.PI) / count;
    this.targetAngle = this.angle + extraTurns * 2 * Math.PI + (2 * Math.PI - targetSlice * arc - arc / 2);

    const startAngle = this.angle;
    const totalDelta = this.targetAngle - startAngle;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      this.angle = startAngle + totalDelta * eased;
      this.draw();

      if (progress < 1) {
        this.animId = requestAnimationFrame(animate);
      } else {
        this.spinning = false;
        document.getElementById('spinBtn').disabled = false;
        const normalizedAngle = this.angle % (2 * Math.PI);
        const pointerAngle = (2 * Math.PI - normalizedAngle + 3 * Math.PI / 2) % (2 * Math.PI);
        const selectedIndex = Math.floor(pointerAngle / arc) % count;
        const r = this.items[selectedIndex];
        setTimeout(() => {
          App.showResult(r.name, r.category, r.menu, r.address, '룰렛');
        }, 300);
      }
    };
    this.animId = requestAnimationFrame(animate);
  }
};
