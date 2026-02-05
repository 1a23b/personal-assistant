<template>
  <div class="console-page">
    <div class="page-header">
      <h2>我的团队</h2>
      <p>查看与管理团队成员</p>
    </div>
    <div class="page-content">
      <div class="placeholder-content">
        <p>功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.console-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
}

.placeholder-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #9ca3af;
  font-size: 18px;
}
</style>
