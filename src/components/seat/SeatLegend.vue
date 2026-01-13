<template>
  <section class="section">
    <h3>状态说明</h3>
    <div class="legend">
      <span class="dot available"></span>
      <span>可预约</span>
    </div>
    <div class="legend">
      <span class="dot busy"></span>
      <span>不可用</span>
    </div>
    <div class="legend">
      <span class="dot unknown"></span>
      <span>未查询</span>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-top: 16px;
  padding: var(--card-padding);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--panel);
  box-shadow: var(--panel-shadow-md);
}

.section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-strong);
  margin: 0 0 10px;
}

.legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot.available {
  background: var(--success);
}

.dot.busy {
  background: var(--danger);
}

.dot.unknown {
  background: var(--neutral);
}
</style>
