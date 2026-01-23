/**
 * 路由配置
 */

import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Auth/LoginView.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
      guest: true, // 标记为游客页面
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Auth/RegisterView.vue"),
    meta: {
      title: "注册",
      requiresAuth: false,
      guest: true, // 标记为游客页面
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: {
      title: "首页",
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: {
      title: "个人信息",
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // 恢复认证信息
  if (!authStore.isLoggedIn) {
    authStore.restoreAuth();
  }

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 个人助手`;
  }

  const requiresAuth = to.meta.requiresAuth;
  const isGuestRoute = to.meta.guest;
  const isLoggedIn = authStore.isLoggedIn;

  if (requiresAuth && !isLoggedIn) {
    // 需要登录但未登录，跳转到登录页
    next({
      path: "/login",
      query: { redirect: to.fullPath }, // 保存原始路径
    });
  } else if (isGuestRoute && isLoggedIn) {
    // 已登录用户访问游客页面，跳转到首页
    next("/home");
  } else {
    next();
  }
});

export default router;
