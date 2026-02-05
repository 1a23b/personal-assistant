<template>
  <div class="console-page">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <div class="search-item">
        <span class="label">菜单名称：</span>
        <input
          v-model="searchQuery.name"
          type="text"
          placeholder="请输入"
          class="input-field"
        />
      </div>
      <div class="search-item">
        <span class="label">状态：</span>
        <select v-model="searchQuery.status" class="input-field select-field">
          <option value="">请选择</option>
          <option value="enabled">启用</option>
          <option value="disabled">禁用</option>
        </select>
      </div>
      <div class="search-actions">
        <button class="btn btn-primary" @click="handleSearch">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          搜索
        </button>
        <button class="btn btn-secondary" @click="resetSearch">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          重置
        </button>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="left-actions">
        <button
          class="btn btn-danger"
          :disabled="selectedIds.length === 0"
          :class="{ 'opacity-50 cursor-not-allowed': selectedIds.length === 0 }"
          @click="batchDelete"
        >
          批量删除 ({{ selectedIds.length }})
        </button>
      </div>
      <div class="right-actions">
        <button class="btn btn-primary" @click="openAddModal">
          新增菜单管理
        </button>
        <button class="btn btn-icon" @click="refreshData" title="刷新">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
          </svg>
          刷新
        </button>
        <div class="relative">
          <button class="btn btn-icon" @click="toggleColumnFilter" title="列筛选">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18M7 12h10M10 18h4" />
            </svg>
            列筛选
          </button>
          <!-- 列筛选弹窗 -->
          <div v-if="isColumnFilterOpen" class="column-filter-popover">
            <div class="filter-header">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="isAllColumnsSelected"
                  @change="toggleAllColumns"
                />
                全选
              </label>
            </div>
            <div class="filter-body">
              <label
                v-for="col in columns"
                :key="col.key"
                class="checkbox-label"
              >
                <input type="checkbox" v-model="col.visible" />
                {{ col.label }}
              </label>
            </div>
            <div class="filter-footer">
              <button class="btn btn-sm btn-secondary" @click="isColumnFilterOpen = false">取消</button>
              <button class="btn btn-sm btn-primary" @click="isColumnFilterOpen = false">筛选</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表内容 -->
    <div class="table-container">
      <table class="data-table table-fixed">
        <thead>
          <tr>
            <th class="w-10 text-center">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th v-if="isColumnVisible('id')" class="w-16">ID</th>
            <th v-if="isColumnVisible('name')" class="w-56">菜单名称</th>
            <th v-if="isColumnVisible('permission')" class="w-32">权限标识</th>
            <th v-if="isColumnVisible('type')" class="w-20">类型操作</th>
            <th v-if="isColumnVisible('routeName')" class="w-32">路由名称</th>
            <th v-if="isColumnVisible('routePath')" class="w-32">路由路径</th>
            <th v-if="isColumnVisible('componentPath')" class="w-32">组件路径</th>
            <th v-if="isColumnVisible('status')" class="w-16">状态</th>
            <th v-if="isColumnVisible('sort')" class="w-14">排序</th>
            <th v-if="isColumnVisible('actions')" class="w-32 text-center sticky-col header-sticky">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in displayRows" :key="row.id" class="hover:bg-gray-50">
            <td class="text-center">
              <input
                type="checkbox"
                :checked="selectedIds.includes(row.id)"
                @change="toggleSelection(row.id)"
              />
            </td>
            <td v-if="isColumnVisible('id')" class="truncate" :title="row.id.toString()">
              {{ row.id }}
            </td>
            <td v-if="isColumnVisible('name')">
              <div class="flex items-center" :style="{ paddingLeft: row.level * 20 + 'px' }">
                <button
                  v-if="row.hasChildren"
                  @click="toggleExpand(row.id)"
                  class="expand-btn mr-2 flex-shrink-0"
                >
                  <svg
                    v-if="expandedIds.has(row.id)"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                <span v-else class="w-6 inline-block flex-shrink-0"></span>
                <span class="truncate" :title="row.name">{{ row.name }}</span>
              </div>
            </td>
            <td v-if="isColumnVisible('permission')" class="truncate" :title="row.permission || '-'">
              {{ row.permission || '-' }}
            </td>
            <td v-if="isColumnVisible('type')">
              <span
                class="status-tag"
                :class="{
                  'bg-green-100 text-green-700 border-green-200': row.type === 'directory',
                  'bg-blue-100 text-blue-700 border-blue-200': row.type === 'menu',
                  'bg-red-100 text-red-700 border-red-200': row.type === 'button'
                }"
              >
                {{ row.type === 'directory' ? '目录' : row.type === 'menu' ? '菜单' : '权限' }}
              </span>
            </td>
            <td v-if="isColumnVisible('routeName')" class="truncate" :title="row.routeName || '-'">{{ row.routeName || '-' }}</td>
            <td v-if="isColumnVisible('routePath')" class="truncate" :title="row.routePath || '-'">{{ row.routePath || '-' }}</td>
            <td v-if="isColumnVisible('componentPath')" class="truncate" :title="row.componentPath || '-'">{{ row.componentPath || '-' }}</td>
            <td v-if="isColumnVisible('status')">
              <span
                class="status-text"
                :class="row.status === 'enabled' ? 'text-green-600' : 'text-gray-400'"
              >
                {{ row.status === 'enabled' ? '启用' : '禁用' }}
              </span>
            </td>
            <td v-if="isColumnVisible('sort')">{{ row.sort }}</td>
            <td v-if="isColumnVisible('actions')" class="text-center sticky-col cell-sticky">
              <div class="flex items-center justify-center gap-2">
                <button class="btn-action btn-edit" @click="openEditModal(row)">编辑</button>
                <button class="btn-action btn-delete" @click="deleteMenu(row)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="displayRows.length === 0">
            <td :colspan="visibleColumnCount + 1" class="text-center py-8 text-gray-400">
              暂无数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalType === 'add' ? '新增菜单管理' : '编辑菜单管理' }}</h3>
          <button class="close-btn" @click="closeModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="required">菜单名称：</label>
            <input type="text" v-model="editingForm.name" placeholder="请输入" />
          </div>
          <div class="form-group">
            <label class="required">菜单类型：</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="editingForm.type" value="directory" />
                目录
              </label>
              <label>
                <input type="radio" v-model="editingForm.type" value="menu" />
                菜单
              </label>
              <label>
                <input type="radio" v-model="editingForm.type" value="button" />
                按钮
              </label>
            </div>
          </div>
          <div class="form-group" v-if="editingForm.type !== 'button'">
            <label class="required">路由名称：</label>
            <input type="text" v-model="editingForm.routeName" placeholder="请输入" />
          </div>
          <div class="form-group" v-if="editingForm.type !== 'button'">
            <label class="required">路由路径：</label>
            <input type="text" v-model="editingForm.routePath" placeholder="请输入" />
          </div>
           <div class="form-group" v-if="editingForm.type === 'menu'">
            <label>组件路径：</label>
            <input type="text" v-model="editingForm.componentPath" placeholder="请输入" />
          </div>
          <div class="form-group" v-if="editingForm.type === 'button'">
             <label>权限标识：</label>
             <input type="text" v-model="editingForm.permission" placeholder="例如: system:user:add" />
          </div>
          <div class="form-group">
            <label>图标：</label>
            <input type="text" v-model="editingForm.icon" placeholder="请输入" />
          </div>
          <div class="form-group">
            <label class="required">状态：</label>
            <select v-model="editingForm.status">
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </div>
          <div class="form-group">
            <label>排序：</label>
            <input type="number" v-model="editingForm.sort" placeholder="1" />
          </div>
          <div class="form-group">
            <label>描述：</label>
            <textarea v-model="editingForm.description" placeholder="请输入" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveMenu">
            {{ modalType === 'add' ? '新增' : '更新' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { getMenuTree, createMenu, updateMenu, deleteMenu as removeMenu } from '@/services/permission.service';
import type { MenuItem, CreateMenuRequest, UpdateMenuRequest } from '@/types';

interface Menu {
  id: number;
  name: string;
  permission: string;
  type: 'directory' | 'menu' | 'button';
  routeName: string;
  routePath: string;
  componentPath: string;
  status: 'enabled' | 'disabled';
  sort: number;
  children?: Menu[];
  description?: string;
  icon?: string;
  parentId?: number;
}

const menus = ref<Menu[]>([]);
const searchQuery = ref({
  name: '',
  status: ''
});
const selectedIds = ref<number[]>([]);
const expandedIds = ref<Set<number>>(new Set());
const isColumnFilterOpen = ref(false);

const columns = reactive([
  { key: 'id', label: 'ID', visible: true },
  { key: 'name', label: '菜单名称', visible: true },
  { key: 'permission', label: '权限标识', visible: true },
  { key: 'type', label: '类型操作', visible: true },
  { key: 'routeName', label: '路由名称', visible: true },
  { key: 'routePath', label: '路由路径', visible: true },
  { key: 'componentPath', label: '组件路径', visible: true },
  { key: 'status', label: '状态', visible: true },
  { key: 'sort', label: '排序', visible: true },
  { key: 'actions', label: '操作', visible: true }
]);

const visibleColumnCount = computed(() => columns.filter(c => c.visible).length);

const isColumnVisible = (key: string) => {
  return columns.find(c => c.key === key)?.visible;
};

const isModalOpen = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const editingForm = reactive<Partial<Menu>>({
  type: 'directory',
  status: 'enabled',
  sort: 1
});

interface FlatMenu extends Menu {
  level: number;
  hasChildren: boolean;
}

const toStatus = (status?: number) => (status === 1 ? 'enabled' : 'disabled');

const mapMenuTree = (items: MenuItem[], parentId?: number): Menu[] => {
  return items.map(item => {
    const type = item.type === 1 ? 'directory' : item.type === 2 ? 'menu' : 'button';
    return {
      id: item.id,
      name: item.name,
      permission: item.code,
      type,
      routeName: item.code,
      routePath: item.route_path || '',
      componentPath: item.component_path || '',
      status: toStatus(item.status),
      sort: item.sort,
      children: item.children ? mapMenuTree(item.children, item.id) : [],
      description: item.desc,
      icon: item.icon,
      parentId: item.parent_id ?? parentId
    };
  });
};

const fetchMenus = async () => {
  const data = await getMenuTree({ skipTip: true });
  menus.value = mapMenuTree(data);
  if (expandedIds.value.size === 0 && menus.value.length > 0) {
    expandedIds.value.add(menus.value[0].id);
  }
};

const flattenMenus = (
  list: Menu[],
  level = 0,
  result: FlatMenu[] = []
): FlatMenu[] => {
  list.forEach(item => {
    const nameMatch = !searchQuery.value.name || item.name.toLowerCase().includes(searchQuery.value.name.toLowerCase());
    const statusMatch = !searchQuery.value.status || item.status === searchQuery.value.status;

    if (nameMatch && statusMatch) {
      const hasChildren = !!item.children && item.children.length > 0;
      result.push({ ...item, level, hasChildren });

      if (hasChildren && expandedIds.value.has(item.id)) {
        flattenMenus(item.children!, level + 1, result);
      }
    }
  });
  return result;
};

const displayRows = computed(() => {
  return flattenMenus(menus.value);
});

const allIds = computed(() => {
    const ids: number[] = [];
    const traverse = (items: Menu[]) => {
        items.forEach(item => {
            ids.push(item.id);
            if(item.children) traverse(item.children);
        });
    };
    traverse(menus.value);
    return ids;
});

const isAllSelected = computed(() => {
    return allIds.value.length > 0 && selectedIds.value.length === allIds.value.length;
});

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedIds.value = [];
    } else {
        selectedIds.value = [...allIds.value];
    }
};

const toggleSelection = (id: number) => {
    const index = selectedIds.value.indexOf(id);
    if (index === -1) {
        selectedIds.value.push(id);
    } else {
        selectedIds.value.splice(index, 1);
    }
};

const toggleExpand = (id: number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
};

const handleSearch = () => {};

const resetSearch = () => {
  searchQuery.value.name = '';
  searchQuery.value.status = '';
};

const refreshData = async () => {
  await fetchMenus();
};

const batchDelete = async () => {
  if (confirm(`确定要删除选中的 ${selectedIds.value.length} 个菜单项吗？`)) {
    const ids = [...selectedIds.value];
    await Promise.all(ids.map(id => removeMenu(id)));
    selectedIds.value = [];
    await fetchMenus();
  }
};

const deleteMenu = async (row: Menu) => {
  if (confirm(`确定要删除菜单 "${row.name}" 吗？`)) {
    await removeMenu(row.id);
    await fetchMenus();
  }
};

const isAllColumnsSelected = computed(() => {
  return columns.every(c => c.visible);
});

const toggleAllColumns = () => {
  const newValue = !isAllColumnsSelected.value;
  columns.forEach(c => c.visible = newValue);
};

const toggleColumnFilter = () => {
  isColumnFilterOpen.value = !isColumnFilterOpen.value;
};

const openAddModal = () => {
  modalType.value = 'add';
  Object.assign(editingForm, {
    id: undefined,
    name: '',
    permission: '',
    type: 'directory',
    routeName: '',
    routePath: '',
    componentPath: '',
    status: 'enabled',
    sort: 1,
    description: '',
    icon: '',
    parentId: undefined
  });
  isModalOpen.value = true;
};

const openEditModal = (row: Menu) => {
  modalType.value = 'edit';
  Object.assign(editingForm, JSON.parse(JSON.stringify(row)));
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const buildMenuPayload = () => {
  const typeNumber = editingForm.type === 'directory' ? 1 : editingForm.type === 'menu' ? 2 : 3;
  const code = (editingForm.permission || editingForm.routeName || editingForm.name || '').trim();
  const payload = {
    parent_id: editingForm.parentId ?? 0,
    name: editingForm.name!,
    code,
    type: typeNumber,
    icon: editingForm.icon || undefined,
    route_path: editingForm.type === 'button' ? undefined : (editingForm.routePath || undefined),
    component_path: editingForm.type === 'menu' ? (editingForm.componentPath || undefined) : undefined,
    status: editingForm.status === 'enabled' ? 1 : 0,
    sort: editingForm.sort || 0,
    desc: editingForm.description || undefined
  };
  return payload;
};

const saveMenu = async () => {
  if (!editingForm.name || !editingForm.type) {
    alert('请填写必填项');
    return;
  }

  if (modalType.value === 'add') {
    const data = buildMenuPayload() as CreateMenuRequest;
    await createMenu(data);
  } else {
    const data = buildMenuPayload() as UpdateMenuRequest;
    await updateMenu(editingForm.id as number, data);
  }
  closeModal();
  await fetchMenus();
};

onMounted(fetchMenus);
</script>

<style scoped>
.console-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  padding: 24px;
  background-color: #f3f4f6;
  overflow: hidden;
}

/* 搜索栏 */
.search-bar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
}

.input-field {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  width: 200px;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.select-field {
  background-color: white;
}

.search-actions {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: white;
  border-color: #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-icon {
  padding: 8px;
  background: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 4px;
}

.btn-icon:hover {
  color: #374151;
  border-color: #9ca3af;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.data-table th {
  background-color: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.expand-btn {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
}

.expand-btn:hover {
  color: #374151;
}

/* 标签样式 */
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid transparent;
}

.btn-action {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: white;
  border: none;
}

.btn-edit {
  background-color: #3b82f6;
}
.btn-edit:hover {
  background-color: #2563eb;
}

.btn-delete {
  background-color: #ef4444;
}
.btn-delete:hover {
  background-color: #dc2626;
}

/* 列筛选弹窗 */
.column-filter-popover {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  width: 200px;
  z-index: 50;
  padding: 12px;
}

.filter-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 8px;
}

.filter-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.filter-footer {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.form-group label {
  width: 100px;
  font-size: 14px;
  color: #374151;
  text-align: right;
  margin-right: 12px;
}

.form-group label.required::before {
  content: '*';
  color: #ef4444;
  margin-right: 4px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-group label {
  width: auto;
  text-align: left;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.sticky-col {
  position: sticky;
  right: 0;
  z-index: 10;
  background-color: white; /* Default background for sticky cells */
}

.header-sticky {
  z-index: 20; /* Ensure header is above body cells */
  background-color: #f9fafb; /* Match the header background color */
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05); /* Add shadow for separation */
}

.cell-sticky {
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05); /* Add shadow for separation */
}

/* Ensure hover state background works on sticky cells */
.hover\:bg-gray-50:hover .cell-sticky {
  background-color: #f9fafb; /* Match hover color */
}

/* Responsive adjustment if needed */
@media (max-width: 640px) {
  /* On very small screens, maybe disable sticky if it causes issues, but usually fine */
}
</style>
