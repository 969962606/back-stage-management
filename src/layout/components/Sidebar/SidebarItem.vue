<template>
<!-- 测导航栏内容 -->
  <div v-if="!item.hiddle" class="menu-wrapper">
    <!-- 只有一个目录元素，或者子元素不存在，或者子元素的子元素不存在时，或者不是设置一直显示时 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
        
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          ></item>
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu
      v-else-if="hasPermissions(item.children, item)"
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
     <!-- 一级导航栏 -->
      <template slot="title">
        <item v-if="item.title" :icon="item.meta && item.meta.icon" :title="item.title"></item>
        <item v-else-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 子导航栏 -->
      <sidebar-item
        v-for="child in hasPermisstionChildren"
        :key="child.path"
        :is-nest="false"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>
<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import { all } from "q";
export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    this.onlyOneChild = null;
    return {
      hasPermisstionChildren: [],
    };
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      if (parent.title) {
        return false;
      }
      const showingChildren = children.filter((item) => {
        if (item.hiddle) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      //Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    hasPermissions(children = [], parent) {
      let allPermissions = JSON.parse(
        localStorage.getItem("resultData")
      ).permissions.split(";");
      this.hasPermisstionChildren = children.filter((item) => {
        if (allPermissions.includes(item.auth)) {
          return true;
        }
      });
      if (this.hasPermisstionChildren.length === 0) {
        return false;
      }
      return true;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return this.basePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
