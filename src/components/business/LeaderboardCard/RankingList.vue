<template>
  <div class="rank-list" ref="listRef">
    <!-- 列表项（第四名及以后） -->
    <div
      v-for="(item, index) in items"
      :key="item.user_id"
      class="rank-item"
      :class="{ 'is-current-user': isCurrentUser(item) }"
    >
      <div class="rank-number">{{ startIndex + index + 1 }}</div>
      <div class="user-info">
        <div class="avatar">
          <img
            v-if="item.avatar"
            :src="item.avatar"
            :alt="item.real_name"
          />
          <div v-else class="avatar-placeholder">
            {{ item.real_name?.charAt(0) || "U" }}
          </div>
        </div>
        <div class="name">{{ item.real_name }}</div>
      </div>
      <div class="passed-count">{{ item.total_passed }}题</div>
    </div>

    <!-- 加载更多按钮 -->
    <div v-if="hasMore && items.length > 0" class="load-more-wrapper">
      <button
        class="load-more-button"
        @click="handleLoadMore"
        :disabled="loadingMore"
      >
        <span v-if="!loadingMore">加载更多</span>
        <span v-else>加载中...</span>
      </button>
    </div>

    <!-- 没有更多数据提示 -->
    <div v-else-if="!hasMore && items.length > 0" class="no-more">
      已加载全部数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RankingItem } from '@/types'
import { useAuthStore } from '@/stores/auth'

interface Props {
  items: RankingItem[]
  startIndex?: number
  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  startIndex: 3,
  loadingMore: false,
  hasMore: true,
})

const listRef = ref<HTMLElement | null>(null)

// 获取 auth store
const authStore = useAuthStore()

/**
 * 判断排行榜项是否是当前用户
 */
const isCurrentUser = (item: RankingItem) => {
  const user = authStore.user
  return user?.id === item.user_id
}

/**
 * 处理加载更多点击
 */
const handleLoadMore = () => {
  if (props.onLoadMore && !props.loadingMore) {
    props.onLoadMore()
  }
}
</script>

<style scoped>
/* 列表容器 */
.rank-list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 20px;
  overflow-y: auto;
}

/* 列表项 */
.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.rank-item:hover {
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 当前用户高亮 */
.rank-item.is-current-user {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-color: #69c0ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

/* 排名序号 */
.rank-number {
  min-width: 32px;
  font-size: 16px;
  font-weight: 600;
  color: #8c8c8c;
  text-align: center;
}

/* 用户信息 */
.user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.user-info .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
}

.user-info .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info .avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.user-info .name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 通过题目数 */
.passed-count {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  text-align: right;
  min-width: 60px;
}

/* 加载更多按钮容器 */
.load-more-wrapper {
  padding: 16px 20px 8px;
}

/* 加载更多按钮 */
.load-more-button {
  width: 100%;
  padding: 10px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-button:hover:not(:disabled) {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.load-more-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
  color: #8c8c8c;
  border-color: #d9d9d9;
}

/* 没有更多数据提示 */
.no-more {
  padding: 16px 20px 8px;
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
}

/* 滚动条样式 */
.rank-list::-webkit-scrollbar {
  width: 6px;
}

.rank-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.rank-list::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.rank-list::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
