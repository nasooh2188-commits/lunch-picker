const App = {
  currentView: 'home',
  selectedTags: new Set(),
  filteredRestaurants: [...restaurants],
  history: JSON.parse(localStorage.getItem('lunchHistory') || '[]'),

  init() {
    this.render('home');
    window.addEventListener('popstate', () => this.render(location.hash.slice(1) || 'home'));
  },

  navigate(view) {
    this.currentView = view;
    location.hash = view;
    this.render(view);
  },

  render(view) {
    const app = document.getElementById('app');
    app.classList.add('fade-out');
    setTimeout(() => {
      switch(view) {
        case 'home': this.renderHome(app); break;
        case 'recommend': this.renderRecommend(app); break;
        case 'roulette': this.renderRoulette(app); break;
        case 'random': this.renderRandomPick(app); break;
        default: this.renderHome(app);
      }
      app.classList.remove('fade-out');
      app.classList.add('fade-in');
      setTimeout(() => app.classList.remove('fade-in'), 300);
    }, 150);
  },

  renderHome(el) {
    const recentHtml = this.history.length > 0 ? `
      <div class="recent-section">
        <h3>최근 선택 기록</h3>
        <div class="recent-list">
          ${this.history.slice(0, 5).map(h => `
            <div class="recent-item">
              <span class="recent-date">${h.date}</span>
              <span class="recent-name">${h.name}</span>
              <span class="recent-method">${h.method}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    el.innerHTML = `
      <div class="home-view">
        <div class="home-header">
          <div class="logo-area">
            <img src="img/logo-white.png" alt="kt nasmedia" class="company-logo">
          </div>
          <div class="hero">
            <div class="hero-emoji">🍽️</div>
            <h1>OOH매체사업팀<br><span>점심 뭐 먹지?</span></h1>
            <p class="hero-sub">오늘도 고민은 그만! 바로 정해보세요</p>
          </div>
        </div>
        <div class="menu-section">
          <div class="menu-section-title">어떻게 정할까?</div>
          <div class="menu-grid">
            <button class="menu-card card-recommend" onclick="App.navigate('recommend')">
              <div class="card-icon">🎯</div>
              <div class="card-info">
                <div class="card-title">키워드 추천</div>
                <div class="card-desc">기분에 맞는 식당 찾기</div>
              </div>
            </button>
            <button class="menu-card card-roulette" onclick="App.navigate('roulette')">
              <div class="card-icon">🎰</div>
              <div class="card-info">
                <div class="card-title">룰렛</div>
                <div class="card-desc">돌려서 정하기</div>
              </div>
            </button>
            <button class="menu-card card-random card-full" onclick="App.navigate('random')">
              <div class="card-icon">🎴</div>
              <div class="card-info">
                <div class="card-title">랜덤뽑기</div>
                <div class="card-desc">카드 뒤집어 뽑기</div>
              </div>
            </button>
          </div>
        </div>
        ${recentHtml}
      </div>
    `;
  },

  renderRecommend(el) {
    Recommend.render(el);
  },
  renderRoulette(el) {
    Roulette.render(el);
  },
  renderRandomPick(el) {
    RandomPick.render(el);
  },

  saveHistory(name, method) {
    const today = new Date();
    const dateStr = `${today.getMonth()+1}/${today.getDate()}`;
    this.history.unshift({ date: dateStr, name, method });
    if (this.history.length > 20) this.history.pop();
    localStorage.setItem('lunchHistory', JSON.stringify(this.history));
  },

  showResult(name, category, menu, address, method) {
    this.saveHistory(name, method);
    const mapUrl = getNaverMapUrl(name, address);
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.innerHTML = `
      <div class="result-modal">
        <div class="result-confetti">🎉</div>
        <h2>오늘의 점심은!</h2>
        <div class="result-name">${name}</div>
        <div class="result-category">${category}</div>
        <div class="result-menu">${menu}</div>
        <a href="${mapUrl}" target="_blank" class="result-map-btn">📍 네이버지도에서 보기</a>
        <div class="result-actions">
          <button class="btn-retry" onclick="this.closest('.result-overlay').remove()">다시하기</button>
          <button class="btn-home" onclick="document.querySelector('.result-overlay').remove(); App.navigate('home')">홈으로</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
  },

  getBackBtn() {
    return `<button class="back-btn" onclick="App.navigate('home')">← 홈</button>`;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
