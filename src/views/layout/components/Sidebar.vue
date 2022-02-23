<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.children">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <svg-icon :icon-class="item.icon" class="small-icon" />
                            <span>{{ $t(item.title) }}</span>
                        </template>
                        <template v-for="subItem in item.children" :key="subItem.index">
                          <!-- 二级菜单 -->
                          <el-menu-item :index="subItem.index" >
                            <template #title>
                              <svg-icon :icon-class="subItem.icon" class="small-icon" />
                              <span>{{ $t(subItem.title) }}</span>
                            </template>
                          </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <!-- <i :class="item.icon"></i> -->
                        <svg-icon :icon-class="item.icon" class="small-icon" />
                        <template #title>{{ $t(item.title) }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
    setup() {
      const store = useStore()
      const items = store.state.limitedFeatures

      const route = useRoute()
      
      const onRoutes = computed(() => { return route.path })

      const collapse = computed(() => store.state.collapse)

      return {
        items,
        onRoutes,
        collapse,
      }
    },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.el-menu-item.is-active {
  color: #fff !important;
  background-color: #1e9fff !important;
}
</style>
