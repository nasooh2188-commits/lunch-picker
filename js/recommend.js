const Recommend = {
  selectedTags: new Set(),

  render(el) {
    el.innerHTML = `
      <div class="sub-view">
        ${App.getBackBtn()}
        <h2>🎯 키워드로 추천받기</h2>
        <p class="sub-desc">오늘 뭐가 땡겨? 골라봐!</p>
        <div id="tag-container"></div>
        <button class="action-btn recommend-btn" onclick="Recommend.doRecommend()">🔍 추천받기</button>
        <div id="recommend-result"></div>
      </div>
    `;
    this.selectedTags.clear();
    this.renderTags();
  },

  renderTags() {
    const container = document.getElementById('tag-container');
    container.innerHTML = tagGroups.map(group => `
      <div class="tag-group">
        <div class="tag-group-label">${group.label}</div>
        <div class="tag-list">
          ${group.tags.map(tag => `
            <button class="tag-chip ${this.selectedTags.has(tag) ? 'active' : ''}"
                    onclick="Recommend.toggleTag('${tag}')">
              ${tag}
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  toggleTag(tag) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
    this.renderTags();
  },

  doRecommend() {
    const resultEl = document.getElementById('recommend-result');

    let matched;
    if (this.selectedTags.size === 0) {
      matched = [...restaurants];
    } else {
      matched = restaurants.filter(r => {
        return [...this.selectedTags].some(tag => r.tags.includes(tag));
      });
      matched.sort((a, b) => {
        const aScore = [...this.selectedTags].filter(t => a.tags.includes(t)).length;
        const bScore = [...this.selectedTags].filter(t => b.tags.includes(t)).length;
        return bScore - aScore;
      });
    }

    if (matched.length === 0) {
      resultEl.innerHTML = `<div class="no-result">😅 조건에 맞는 식당이 없어요. 키워드를 바꿔보세요!</div>`;
      return;
    }

    const top = matched.slice(0, Math.min(5, matched.length));
    const shuffled = top.sort(() => Math.random() - 0.5);

    resultEl.innerHTML = `
      <div class="recommend-results">
        <h3>추천 결과 ✨</h3>
        ${shuffled.map((r, i) => {
          const matchCount = this.selectedTags.size > 0
            ? [...this.selectedTags].filter(t => r.tags.includes(t)).length
            : 0;
          const mapUrl = getNaverMapUrl(r.name, r.address);
          return `
            <div class="result-card ${i === 0 ? 'top-pick' : ''}" style="animation-delay: ${i * 0.1}s">
              ${i === 0 ? '<div class="top-badge">🏆 최고 매칭</div>' : ''}
              <div class="result-card-header">
                <span class="result-card-name">${r.name}</span>
                <span class="result-card-category">${r.category}</span>
              </div>
              <div class="result-card-menu">🍴 ${r.menu}</div>
              <div class="result-card-tags">
                ${r.tags.map(t => `<span class="mini-tag ${this.selectedTags.has(t) ? 'matched' : ''}">${t}</span>`).join('')}
              </div>
              <a href="${mapUrl}" target="_blank" class="result-card-map">📍 지도보기</a>
            </div>
          `;
        }).join('')}
      </div>
    `;
    resultEl.scrollIntoView({ behavior: 'smooth' });
  }
};
