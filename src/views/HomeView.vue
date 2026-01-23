<script setup lang="ts">
/**
 * 首页
 */
import { defineAsyncComponent, ref } from "vue";
import type LeaderboardCardComponent from "@/components/business/LeaderboardCard/LeaderboardCard.vue";
import type { OJStatsResponse } from "@/types";

const HeaderBar = defineAsyncComponent(() => import("@/components/layout/HeaderBar.vue"));
const OJCard = defineAsyncComponent(() => import("@/components/business/OJCard/OJCard.vue"));
const LeaderboardCard = defineAsyncComponent(
  () => import("@/components/business/LeaderboardCard/LeaderboardCard.vue")
);

// 排行榜组件引用
const leaderboardRef = ref<InstanceType<typeof LeaderboardCardComponent> | null>(null);

/**
 * 处理洛谷绑定成功
 */
const handleLuoguBound = (_data: OJStatsResponse) => {
  // 刷新排行榜
  leaderboardRef.value?.refresh();
};

/**
 * 处理力扣绑定成功
 */
const handleLeetcodeBound = (_data: OJStatsResponse) => {
  // 刷新排行榜
  leaderboardRef.value?.refresh();
};
</script>

<template>
  <div class="home-view">
    <!-- Header Bar -->
    <HeaderBar />

    <!-- 卡片容器 -->
    <div class="cards-container">
      <!-- 左侧列：OJ 卡片 -->
      <div class="left-column">
        <!-- 洛谷绑定卡片 -->
        <OJCard platform="luogu" @bound="handleLuoguBound" />

        <!-- 力扣绑定卡片 -->
        <OJCard platform="leetcode" @bound="handleLeetcodeBound" />
      </div>

      <!-- <div class="right-column"> -->

      <!-- 右侧列：排行榜卡片 -->
        <LeaderboardCard ref="leaderboardRef" />
      <!-- </div> -->

    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cards-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 24px;
  padding: 24px;
  padding-top: 80px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  align-content: start;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  min-height: 0;
}

/* 左侧列 */
.left-column {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
  grid-row: 1 / 3;
}
.right-column{
  height: 100%;
}

/* 右侧排行榜 */
.leaderboard-card-wrapper {
  grid-row: 1 / 3;
  grid-column: 2;
}

/* 响应式 */
@media (max-width: 1200px) {
  .cards-container {
    max-width: 800px;
  }
}

@media (max-width: 800px) {
  .cards-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1fr;
    gap: 16px;
    max-width: none;
    padding-top: 24px;
  }

  .left-column {
    display: grid;
    /* grid-template-columns: 1fr; */
    /* grid-auto-rows: auto; */
    gap: 16px;
  }

  .left-column > * {
    max-width: 100%;
    height: 320px;
  }

  /* 排行榜卡片在800px以下时也设置固定高度 */
  .left-column + * {
    height: 560px;
  }
}

@media (max-width: 768px) {
  .cards-container {
    gap: 16px;
    padding: 16px;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }

  .left-column {
    grid-template-columns: 1fr 1fr;
  }

  .left-column > * {
    width: 100%;
    height: 280px;
  }

  /* 排行榜卡片在768px以下时高度 */
  .left-column + * {
    height: 480px;
  }
}

@media (max-width: 480px) {
  .cards-container {
    gap: 12px;
    padding: 12px;
  }

  .left-column {
    gap: 12px;
  }
}
</style>
