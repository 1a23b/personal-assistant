<template>
  <div class="background-carousel">
    <img
      v-for="(image, index) in images"
      :key="index"
      :src="index === 0 ? image.src : undefined"
      :data-src="image.src"
      :class="['carousel-item', { active: currentIndex === index, loaded: image.loaded }]"
      :alt="`Background ${index + 1}`"
      @load="handleImageLoad(index)"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 背景轮播组件（性能优化版）
 * - 首屏只加载第一张图片
 * - 延迟加载后续图片
 * - 使用 CSS transform 优化动画性能
 */

import { ref, onMounted, onUnmounted } from 'vue'

interface ImageData {
  src: string
  loaded: boolean
}

// 背景图片列表（按优先级排序）
const images = ref<ImageData[]>([
  { src: new URL('@/assets/background/a.png', import.meta.url).href, loaded: false },
  { src: new URL('@/assets/background/b.png', import.meta.url).href, loaded: false },
  { src: new URL('@/assets/background/c.png', import.meta.url).href, loaded: false },
  { src: new URL('@/assets/background/d.png', import.meta.url).href, loaded: false }
])

const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

/**
 * 图片加载完成处理
 */
const handleImageLoad = (index: number) => {
  if (images.value[index]) {
    images.value[index].loaded = true
  }
}

/**
 * 延迟加载图片（性能优化）
 * 使用 requestIdleCallback 在浏览器空闲时加载
 */
const lazyLoadImages = () => {
  // 跳过第一张（已在首屏加载）
  for (let i = 1; i < images.value.length; i++) {
    const img = document.querySelector(`.carousel-item:nth-child(${i + 1})`) as HTMLImageElement

    if (img && !images.value[i]?.loaded) {
      const src = img.dataset.src

      if (src) {
        // 使用 requestIdleCallback 在浏览器空闲时加载
        if ('requestIdleCallback' in window) {
          requestIdleCallback(
            () => {
              img.src = src
            },
            { timeout: 2000 }
          )
        } else {
          // 降级方案：使用 setTimeout
          setTimeout(() => {
            img.src = src
          }, i * 500) // 每张图片间隔 500ms
        }
      }
    }
  }
}

/**
 * 切换到下一张图片
 */
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

/**
 * 启动轮播
 */
const startCarousel = () => {
  // 4秒切换一次
  intervalId = setInterval(nextSlide, 4000)
}

/**
 * 停止轮播
 */
const stopCarousel = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  // 首屏渲染完成后延迟加载其他图片
  // 使用 setTimeout 确保首屏已经渲染
  setTimeout(() => {
    lazyLoadImages()
  }, 100)

  // 启动轮播
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.background-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  /* 使用 will-change 提示浏览器优化 */
  will-change: opacity, transform;
  /* 使用 transform 触发 GPU 加速 */
  transform: translateZ(0);
  transition: opacity 1s ease-in-out;
}

.carousel-item.active {
  opacity: 1;
}

/* 图片未加载时隐藏 */
.carousel-item:not(.loaded) {
  visibility: hidden;
}
</style>
