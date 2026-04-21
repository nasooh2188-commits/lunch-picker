const RandomPick = {
  items: [],
  flipped: new Set(),

  render(el) {
    this.items = [...restaurants].sort(() => Math.random() - 0.5).slice(0, 9);
    this.flipped = new Set();

    el.innerHTML = `
      <div class="sub-view">
        ${App.getBackBtn()}
        <h2>🎴 랜덤뽑기</h2>
        <p class="sub-desc">카드 한 장을 골라 뒤집어보세요!</p>
        <div class="card-grid" id="cardGrid"></div>
        <button class="action-btn shuffle-btn" onclick="RandomPick.render(document.getElementById('app'))">🔄 다시 섞기</button>
      </div>
    `;
    this.renderCards();
  },

  renderCards() {
    const grid = document.getElementById('cardGrid');
    grid.innerHTML = this.items.map((r, i) => `
      <div class="flip-card ${this.flipped.has(i) ? 'flipped' : ''}" onclick="RandomPick.flipCard(${i})" style="animation-delay: ${i * 0.05}s">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-front-icon">🍽️</div>
            <div class="card-front-num">${i + 1}</div>
          </div>
          <div class="flip-card-back">
            <div class="card-back-name">${r.name}</div>
            <div class="card-back-category">${r.category}</div>
            <div class="card-back-menu">${r.menu}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  flipCard(index) {
    if (this.flipped.has(index)) return;
    this.flipped.add(index);

    const cards = document.querySelectorAll('.flip-card');
    cards[index].classList.add('flipped');

    if (this.flipped.size === 1) {
      const r = this.items[index];
      setTimeout(() => {
        App.showResult(r.name, r.category, r.menu, r.address, '랜덤뽑기');
      }, 600);
    }
  }
};
