<template>
  <div class="view-placeholder">
    <div class="placeholder-content">
      <span class="placeholder-icon">📦</span>
      <h2>Modpacks</h2>
      <p>Import, export, and browse full modpack collections.<br>Coming in the next milestone.</p>
      <div class="pill">Planned: Modrinth · CurseForge · Custom Packs</div>
    </div>
  </div>
</template>

<style scoped>
.view-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  max-width: 400px;
}

.placeholder-icon { font-size: 48px; }

h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); }
p  { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }

.pill {
  margin-top: 8px;
  padding: 6px 14px;
  background: var(--accent-dim);
  color: var(--accent);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>
