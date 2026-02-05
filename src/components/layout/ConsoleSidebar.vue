<template>
  <div class="console-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo 区域 -->
    <div class="sidebar-header">
      <div class="logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
        </svg>
      </div>
      <span class="logo-text" v-show="!isCollapsed">用户平台</span>
    </div>

    <!-- 菜单列表 -->
    <div class="sidebar-menu">
      <!-- 主页 -->
      <div class="menu-item" :class="{ active: isActive('/console/dashboard') }" @click="navigateTo('/console/dashboard')">
        <div class="menu-title" title="主页">
          <div class="title-content">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span v-show="!isCollapsed">主页</span>
          </div>
        </div>
      </div>

      <!-- 权限管理 -->
      <div class="menu-item" :class="{ active: isActive('/console/permission') }">
        <div class="menu-title" title="权限管理" @click="toggleSubmenu('permission')">
          <div class="title-content">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span v-show="!isCollapsed">权限管理</span>
          </div>
          <svg v-show="!isCollapsed" class="submenu-arrow" :class="{ rotated: isSubmenuOpen('permission') }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <!-- 子菜单 -->
        <div class="submenu" v-show="isSubmenuOpen('permission') && !isCollapsed">
          <div class="submenu-item" :class="{ active: isActive('/console/permission/role') }" @click="navigateTo('/console/permission/role')">
            角色管理
          </div>
          <div class="submenu-item" :class="{ active: isActive('/console/permission/api') }" @click="navigateTo('/console/permission/api')">
            API管理
          </div>
          <div class="submenu-item" :class="{ active: isActive('/console/permission/menu') }" @click="navigateTo('/console/permission/menu')">
            菜单管理
          </div>
        </div>
      </div>

      <!-- 人员管理 -->
      <div class="menu-item" :class="{ active: isActive('/console/user') }" @click="navigateTo('/console/user')">
        <div class="menu-title" title="人员管理">
          <div class="title-content">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span v-show="!isCollapsed">人员管理</span>
          </div>
        </div>
      </div>

      <!-- 组织管理 -->
      <div class="menu-item" :class="{ active: isActive('/console/org') }" @click="navigateTo('/console/org')">
        <div class="menu-title" title="组织管理">
          <div class="title-content">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M4 21V7a2 2 0 012-2h3V3h6v2h3a2 2 0 012 2v14M9 21V9h6v12" />
            </svg>
            <span v-show="!isCollapsed">组织管理</span>
          </div>
        </div>
      </div>

      <!-- 我的团队 -->
      <div class="menu-item" :class="{ active: isActive('/console/team') }" @click="navigateTo('/console/team')">
        <div class="menu-title" title="我的团队">
          <div class="title-content">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-show="!isCollapsed">我的团队</span>
          </div>
        </div>
      </div>

      <!-- 设置 -->
      <div class="menu-item" :class="{ active: isActive('/console/settings') }" @click="navigateTo('/console/settings')">
        <div class="menu-title" title="设置">
          <div class="title-content">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span v-show="!isCollapsed">设置</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部收缩按钮 -->
    <div class="sidebar-footer" @click="toggleCollapse">
      <svg class="collapse-icon" :class="{ rotated: isCollapsed }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
      <span v-show="!isCollapsed">收起侧边栏</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isCollapsed = ref(false);
const openSubmenus = ref<Set<string>>(new Set(['permission'])); // 默认展开权限管理
const route = useRoute();
const router = useRouter();

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const toggleSubmenu = (key: string) => {
  if (isCollapsed.value) {
    isCollapsed.value = false;
    setTimeout(() => {
      if (openSubmenus.value.has(key)) {
        openSubmenus.value.delete(key);
      } else {
        openSubmenus.value.add(key);
      }
    }, 100);
    return;
  }
  
  if (openSubmenus.value.has(key)) {
    openSubmenus.value.delete(key);
  } else {
    openSubmenus.value.add(key);
  }
};

const isSubmenuOpen = (key: string) => {
  return openSubmenus.value.has(key);
};

const navigateTo = (path: string) => {
  router.push(path);
};

const isActive = (path: string) => {
  // 简单的全等匹配，如果需要支持子路由高亮可以使用 startsWith
  return route.path.startsWith(path);
};
</script>

<style scoped>
.console-sidebar {
  width: 240px;
  height: 100%;
  background: #ffffff; /* 改为白色背景 */
  color: #333; /* 改为深色文字 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  border-right: 1px solid #f0f0f0;
}

.console-sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: #ffffff; /* 保持一致 */
  font-size: 18px;
  font-weight: 600;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: padding 0.3s;
  overflow: hidden;
  white-space: nowrap;
}

.collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #1890ff; /* Logo 背景色改为主题色 */
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.logo-text {
  color: #333;
}

.sidebar-menu {
  padding: 16px 0;
  flex: 1;
  overflow-x: hidden;
}

.menu-item {
  margin-bottom: 4px;
}

.menu-title {
  padding: 0 24px;
  height: 44px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  font-size: 14px;
  justify-content: space-between;
}

.collapsed .menu-title {
  padding: 0;
  justify-content: center;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-title:hover {
  color: #1890ff;
  background-color: #f5f5f5;
}

.menu-item.active .menu-title {
  background: #e6f7ff;
  color: #1890ff;
  border-right: 3px solid #1890ff;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.submenu-arrow {
  width: 14px;
  height: 14px;
  color: #999;
  transition: transform 0.3s;
}

.submenu-arrow.rotated {
  transform: rotate(180deg);
}

.submenu {
  background: #fafafa;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.submenu-item {
  padding: 0 24px 0 52px;
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
}

.submenu-item:hover {
  color: #1890ff;
}

.submenu-item.active {
  color: #1890ff;
  background: #e6f7ff;
  border-right: 3px solid #1890ff;
}

/* 底部收缩按钮 */
.sidebar-footer {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid #f0f0f0;
  color: #666;
  font-size: 14px;
  gap: 8px;
  transition: all 0.3s;
  background: #fff;
}

.sidebar-footer:hover {
  color: #1890ff;
  background: #f9f9f9;
}

.collapse-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

/* Scrollbar styling */
.console-sidebar::-webkit-scrollbar {
  width: 6px;
}

.console-sidebar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.console-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
