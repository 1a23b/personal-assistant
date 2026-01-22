<script setup lang="ts">
/**
 * 应用根组件
 */
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'
import { BackgroundCarousel } from '@/components/business/Carousel'

const authStore = useAuthStore()
const router = useRouter()

// 初始化认证状态
onMounted(() => {
  authStore.restoreAuth()

  // 如果当前在登录页且已登录，跳转到首页
  if (authStore.isLoggedIn && router.currentRoute.value.path === '/login') {
    router.push('/home')
  }
})
</script>

<template>
  <div class="app-container">
    <!-- 全局背景轮播 -->
    <BackgroundCarousel />

    <!-- 页面内容 -->
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.page-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
