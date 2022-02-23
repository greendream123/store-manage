<!-- 表头动作条，包括删除添加编辑等常用按钮及搜索 -->
<template>
  <div :style="{marginBottom: '10px'}">
    <el-button-group>
      <el-button v-if="hasAdd" size="mini" :title="title('add')" class="vertical-center" @click="doAction('add')">
        <svg-icon icon-class="add" />
        {{ $t('add') }}
      </el-button>
      <el-button v-if="hasDelete" size="mini" :title="title('delete')" class="vertical-center" @click="doAction('delete')">
        <svg-icon icon-class="trash" />
        {{ $t('delete') }}
      </el-button>
      <el-button v-if="hasEdit" size="mini" :title="title('edit')" class="vertical-center" @click="doAction('edit')">
        <svg-icon icon-class="edit" />
        {{ $t('edit') }}
      </el-button>
      <!-- 刷新前面可以有至多5个定制按钮 -->
      <slot name="custom1" />
      <slot name="custom2" />
      <slot name="custom3" />
      <slot name="custom4" />
      <slot name="custom5" />
      <el-button v-for="(action, key) of actions.slot" :key="key" class="vertical-center" size="mini" :title="title(action.title)" @click="doAction(action.name)">
        <svg-icon :icon-class="action.icon" />
        {{ $t(action.title) }}
      </el-button>
      <el-button v-if="hasImport" class="vertical-center" size="mini" :title="title('import')" @click="doAction('import')">
        {{ $t('importDepartment') }}
      </el-button>
      <el-button v-if="hasExport" class="vertical-center" size="mini" :title="title('export')" @click="doAction('export')">
        {{ $t('export') }}
      </el-button>
      <el-button v-if="hasPrint" class="vertical-center" size="mini" :title="title('print')" @click="doAction('print')" />
      <el-button v-if="hasClear" class="vertical-center" size="mini" :title="title('clear')" @click="doAction('clear')">
        {{ $t('resetPassword') }}
      </el-button>
      <el-button v-if="hasRefresh" class="vertical-center" size="mini" :title="title('refresh')" @click="doAction('refresh')">
        <svg-icon icon-class="refresh" />
        {{ $t('refresh') }}
      </el-button>
    </el-button-group>
    <div style="display: inline">
      <label :style="{display:'inline-block'}" />
      <el-button v-if="hasCustomQuery" :style="{float:'right',marginLeft:'8px'}" size="mini" :title="title('customQuery')" @click="doAction('customQuery')">
        <svg-icon icon-class="refresh" />
      </el-button>
      <el-input v-if="hasSearch" v-model="searchText" prefix-icon="el-icon-search" :style="{width:'240px',float:'right'}" size="mini" 
      :placeholder="title('search')" @change="doAction('search')" />
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRef } from 'vue'
export default {
  props: {
    actions: {
      type: Object,
      default: function() {
        return {
          add: 'add',
          delete: 'delete',
          edit: 'edit',
          import: 'import',
          export: 'export',
          print: 'print',
          clear: 'clear',
          refresh: 'refresh',
          search: 'input keyword to search',
          customQuery: 'custom query',
          slot: []
        }
      }
    },
    searchText: {
      type: String,
      default: ''
    }
  },
  emits: ['on-action', 'on-search'],
  setup(props, ctx) {
    let { actions } = reactive(props)
    let hasAdd = ref(true)
    let hasDelete = ref(true)
    let hasEdit = ref(true)
    let hasImport = ref(true)
    let hasExport = ref(true)
    let hasPrint = ref(true)
    let hasClear = ref(true)
    let hasRefresh = ref(true)
    let hasSearch = ref(true)
    let hasCustomQuery = ref(true)
    let searchText = ref('')
    const contains = (arr, item) => {
      for (const i in arr) {
        if (i === item) return true
      }
      return false
    }

    hasAdd = contains(actions, 'add')
    hasDelete = contains(actions, 'delete')
    hasEdit = contains(actions, 'edit')
    hasImport = contains(actions, 'import')
    hasExport = contains(actions, 'export')
    hasPrint = contains(actions, 'print')
    hasClear = contains(actions, 'clear')
    hasRefresh = contains(actions, 'refresh')
    hasSearch = contains(actions, 'search')
    hasCustomQuery = contains(actions, 'customQuery')

    const title = (i) => { return actions[i] }
    const doAction = (name) => {
      if (name !== 'search') {
        ctx.emit('on-action', name)
      } else {
        ctx.emit('on-search', searchText.value)
      }
    }

    return {
      hasAdd,
      hasDelete,
      hasEdit,
      hasImport,
      hasExport,
      hasPrint,
      hasClear,
      hasRefresh,
      hasSearch,
      hasCustomQuery,
      searchText,
      title,
      doAction
    }
  }
}
</script>

<style scoped>
.vertical-center {
  display: flex;
  align-items: center;
}
</style>
