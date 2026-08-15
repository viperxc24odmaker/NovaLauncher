<template>
  <div class="news-view">
    <div class="page-header">
      <h1 class="page-title">News</h1>
      <p class="page-sub">Latest from Minecraft.net</p>
    </div>

    <!-- Skeleton / placeholder cards -->
    <div class="news-grid">
      <div v-for="n in 6" :key="n" class="news-card">
        <div class="news-thumb skeleton"></div>
        <div class="news-body">
          <div class="news-tag skeleton-line" style="width: 60px; height: 14px;"></div>
          <div class="skeleton-line" style="width: 100%; height: 16px; margin-top: 8px;"></div>
          <div class="skeleton-line" style="width: 80%; height: 16px; margin-top: 6px;"></div>
          <div class="skeleton-line" style="width: 90px; height: 12px; margin-top: 12px;"></div>
        </div>
      </div>
    </div>

    <p class="coming-note">Live news feed coming in the next milestone.</p>
  </div>
</template>

<style scoped>
.news-view {
  padding: 32px 40px;
  height: 100%;
  overflow-y: auto;
}

.page-header { margin-bottom: 24px; }
.page-title  { font-size: 22px; font-weight: 700; }
.page-sub    { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.news-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.news-thumb {
  width: 100%;
  height: 140px;
  background: var(--bg-elevated);
}

.news-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--bg-hover)    50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.skeleton-line {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--bg-hover)    50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.coming-note {
  text-align: center;
  margin-top: 32px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
