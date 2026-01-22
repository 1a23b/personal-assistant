<template>
  <div class="leaderboard-card-wrapper">
    <!-- SVG 渐变定义 -->
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <!-- 金色渐变 -->
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #ffd700; stop-opacity: 1" />
          <stop offset="50%" style="stop-color: #ffed4e; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #daa520; stop-opacity: 1" />
        </linearGradient>
        <!-- 银色渐变 -->
        <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #e8e8e8; stop-opacity: 1" />
          <stop offset="50%" style="stop-color: #c0c0c0; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #a8a8a8; stop-opacity: 1" />
        </linearGradient>
        <!-- 铜色渐变 -->
        <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #e6a55c; stop-opacity: 1" />
          <stop offset="50%" style="stop-color: #cd7f32; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #a87232; stop-opacity: 1" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 3D 翻转卡片容器 -->
    <div class="flip-card" :class="{ flipped: isFlipped }">
      <!-- 正面：洛谷排行榜 -->
      <div class="flip-card-front">
        <div class="leaderboard-card">
          <div class="card-header">
            <h2>算法排行榜 - 洛谷</h2>
            <div class="flip-hint" @click="handleFlip">点击查看力扣 →</div>
          </div>
          <div class="card-content">
            <!-- 加载状态 -->
            <div v-if="luoguLoading" class="loading-state">
              <div class="spinner"></div>
              <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div v-else-if="luoguRankList.length === 0" class="empty-state">
              <p>暂无排行榜数据</p>
              <p class="hint">绑定洛谷账号后即可查看</p>
            </div>

            <!-- 数据列表 -->
            <div v-else>
              <!-- 前三名颁奖台 -->
              <RankingPodium :items="luoguRankList.slice(0, 3)" />

              <!-- 第四名及以后 -->
              <RankingList
                :items="luoguRankList.slice(3)"
                :start-index="3"
                :loading-more="luoguLoadingMore"
                :has-more="luoguHasMore"
                @load-more="loadMoreLuogu"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 反面：力扣排行榜 -->
      <div class="flip-card-back">
        <div class="leaderboard-card">
          <div class="card-header">
            <h2>算法排行榜 - 力扣</h2>
            <div class="flip-hint" @click="handleFlip">← 点击查看洛谷</div>
          </div>
          <div class="card-content">
            <!-- 加载状态 -->
            <div v-if="leetcodeLoading" class="loading-state">
              <div class="spinner"></div>
              <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div v-else-if="leetcodeRankList.length === 0" class="empty-state">
              <p>暂无排行榜数据</p>
              <p class="hint">绑定力扣账号后即可查看</p>
            </div>

            <!-- 数据列表 -->
            <div v-else>
              <!-- 前三名颁奖台 -->
              <RankingPodium :items="leetcodeRankList.slice(0, 3)" />

              <!-- 第四名及以后 -->
              <RankingList
                :items="leetcodeRankList.slice(3)"
                :start-index="3"
                :loading-more="leetcodeLoadingMore"
                :has-more="leetcodeHasMore"
                @load-more="loadMoreLeetcode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 排行榜卡片组件
 * 支持3D翻转切换洛谷/力扣排行榜
 */
import { ref, onMounted } from 'vue'
import RankingPodium from './RankingPodium.vue'
import RankingList from './RankingList.vue'
import { useRankingData } from './useRankingData'

// 使用数据逻辑
const {
  luoguLoading,
  leetcodeLoading,
  luoguLoadingMore,
  leetcodeLoadingMore,
  luoguHasMore,
  leetcodeHasMore,
  luoguRankList,
  leetcodeRankList,
  loadMoreLuogu,
  loadMoreLeetcode,
  refreshAll,
} = useRankingData()

// 翻转状态
const isFlipped = ref(false)

/**
 * 切换翻转状态
 */
const handleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// 组件挂载时获取数据
onMounted(() => {
  refreshAll()
})

// 暴露刷新方法
defineExpose({
  refresh: refreshAll,
})
</script>

<style scoped>
.leaderboard-card-wrapper {
  width: 100%;
  height: 100%;
  min-height: 560px;
  position: relative;
  perspective: 1000px;
  overflow: hidden;
}

/* 3D 翻转容器 */
.flip-card {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card-front,
.flip-card-back {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
}

.flip-card-front {
  transform: rotateY(0deg);
  z-index: 2;
}

.flip-card-back {
  transform: rotateY(180deg);
  z-index: 1;
}

/* 翻转状态 */
.flip-card.flipped {
  transform: rotateY(180deg);
}

.leaderboard-card {
  height: 100%;
  min-height: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.flip-hint {
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.flip-hint:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.card-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 16px 0;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c8c8c;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c8c8c;
}

.empty-state p {
  margin: 4px 0;
}

.empty-state .hint {
  font-size: 12px;
  color: #bfbfbf;
}

/* 滚动条样式 */
.card-content::-webkit-scrollbar {
  width: 6px;
}

.card-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.card-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.card-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
