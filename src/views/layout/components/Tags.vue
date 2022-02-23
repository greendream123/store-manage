<template>
    <div class="tags" v-if="showTags">
      <el-tag v-for="(item,index) in tagsList" :key="index" :closable="item.title == 'dashboard' ? false : true " @close="closeTags(index)" 
      :class="{'active': isActive(item.path)}" class="tag-style" @click="handleTag(item.path)">
        {{ $t(item.title) }}
      </el-tag>
        <!-- <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">{{ $t(item.title) }}</router-link>
                <span v-show="item.title != 'dashboard'" class="tags-li-icon" @click="closeTags(index)">
                    <i class="el-icon-close"></i>
                </span>
            </li>
        </ul> -->
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                  {{ $t('tagsOptions') }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu size="small">
                        <el-dropdown-item command="other">{{ $t('closeOther') }}</el-dropdown-item>
                        <el-dropdown-item command="all">{{ $t('closeAll') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const isActive = (path) => {
        return path === route.fullPath;
      };

      const store = useStore();
      store.commit("setTagsItem")
      const tagsList = computed(() => store.state.tagsList);
      const showTags = computed(() => tagsList.value.length > 0);
      // 点击标签
      const handleTag = (path) => {
        router.push(path)
      }
      // 关闭单个标签
      const closeTags = (index) => {
        const delItem = tagsList.value[index];
        store.commit("delTagsItem", { index });
        const item = tagsList.value[index]
          ? tagsList.value[index]
          : tagsList.value[index - 1];
        if (item) {
          delItem.path === route.fullPath && router.push(item.path);
        } else {
          router.push("/home");
        }
      };

      // 设置标签
      const setTags = (route) => {
        const isExist = tagsList.value.some((item) => {
          return item.path === route.fullPath;
        });
        if (!isExist) {
          if (tagsList.value.length >= 14) {
            store.commit("delTagsItem", { index: 0 });
          }
          store.commit("setTagsItem", {
            name: route.name,
            title: route.meta.title,
            path: route.fullPath,
          });
        }
      };
      setTags(route);
      watch(route, (_newRoute, prevRoute) => {
        setTags(_newRoute);
      })

      // 关闭全部标签
      const closeAll = () => {
        store.commit("clearTags");
        // 跳转首页
        router.push("/home");
        if (route.name == 'dashboard') setTags(route)
      };
      // 关闭其他标签
      const closeOther = () => {
        const curItem = tagsList.value.filter((item) => {
          return item.path === route.fullPath || item.name == 'dashboard'
        });
        store.commit("closeTagsOther", curItem);
      };
      const handleTags = (command) => {
        command === "other" ? closeOther() : closeAll();
      };

      return {
        isActive,
        tagsList,
        showTags,
        closeTags,
        handleTags,
        handleTag
      };
    },
};
</script>


<style>
.tags {
  /* position: relative; */
  height: 32px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 2px 3px 2px 5px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 2px;
  box-sizing: border-box;
  text-align: center;
  width: 110px;
  z-index: 10;
}

.active {
  color: #fff !important;
  background-color: #73c5c5;
}

.tag-style {
  margin-left: 5px;
}

.el-tag {
  margin-top: 4px;
  height: 24px !important;
  line-height: 24px !important;
}
</style>
