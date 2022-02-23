<template>
  <el-card style="height: 99%">
    <TableActionBar ref="actionBar" @on-action="onBarAction" :actions="actions" />
    <el-table ref="productTable" :data="accounts" :max-height="tabMaxHeight" border stripe @selection-change="selectionChange">
      <el-table-column type="selection" width="55" :selectable="disabledCheckbox"></el-table-column>
      <el-table-column prop="username" :label="$t('accountName')" width="180"></el-table-column>
      <el-table-column prop="nickname" :label="$t('nickName')" width="180"></el-table-column>
      <el-table-column prop="role" :label="$t('role')" width="180"></el-table-column>
      <el-table-column prop="phone" :label="$t('phone')" width="180"></el-table-column>
      <el-table-column prop="time" :label="$t('registerTime')" width="180"></el-table-column>
    </el-table>
    <AccountAddEdit ref="accountAddEdit" @on-add-edit="onAddEdit" />
  </el-card>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { standardAPIRequest, isEmpty, clone, getSingleSelection, getSelection, showError, showSuccess } from '@/libs/common.js'
import APIs from '@/libs/api.js'
import TableActionBar from '@c/table-action-bar'
import AccountAddEdit from './account-add-edit.vue'
export default {
  components: {
    TableActionBar,
    AccountAddEdit
  },
  setup() {
    const proxy = getCurrentInstance()
    const accountAddEdit = ref(null)
    // tabbar
    const actionBar = ref(null)
    const actions = reactive({
      add: 'add',
      edit: 'edit',
      delete: 'delete',
      refresh: 'refresh',
    })
    const onBarAction = (action) => {
      if (action == 'add') {
        accountAddEdit.value.show(accounts.value, true)
      } else if (action == 'edit') {
        let el = getSingleSelection(proxy, sels.value)
        if (isEmpty(el)) return
        accountAddEdit.value.show(accounts.value, false, el)
      } else if (action == 'delete') {
        let els = ref(getSelection(proxy, sels.value))
        if (isEmpty(els)) return
        let ids = []
        els.value.forEach(account => {
          ids.push(account.id)
        });
        delAccount(ids)
      } else if (action == 'refresh') {
        loadData()
      } else if (action == 'resetPassword') {
        let el = getSingleSelection(proxy, sels.value)
        if (isEmpty(el)) return
        refreshAccount(el)
      }
    }
    const addAccount = (el) => {
      standardAPIRequest(APIs.addAccount, el, (ok, desc) => {
        if (ok) {
          showSuccess(desc)
          loadData()
        } else {
          showError(desc)
        }
      })
    }
    const editAccount = (el) => {
      standardAPIRequest(APIs.editAccount, el, (ok, desc) => {
        if (ok) {
          showSuccess(desc)
          loadData()
        } else {
          showError(desc)
        }
      })
    }
    const delAccount = (ids) => {
      standardAPIRequest(APIs.delAccount, ids, (ok, desc) => {
        if (ok) {
          showSuccess(desc)
          loadData()
        } else {
          showError(desc)
        }
      })
    }
    const refreshAccount = () => {
      loadData()
    }
    // table
    let tabMaxHeight = ref(document.body.clientHeight - 230)
    const calcTabMaxHeight = () => {
      tabMaxHeight.value = document.body.clientHeight - 230
    }
    let sels = ref([])
    const selectionChange = (_sels) => {
      sels.value = _sels
    }
    let accounts = ref([])
    const loadData = () => {
      standardAPIRequest(APIs.getAccounts, null, (ok, desc, _accounts) => {
        if (ok) {
          if (!isEmpty(_accounts)) {
            accounts.value = clone(_accounts)
          }
        } else {
          showError(desc)
        }
      })
    }
    const disabledCheckbox = (row) => {
      return row.role == 'admin' ? 0 : 1
    }
    // loadData
    onMounted(() => { 
      loadData()
      window.onresize = calcTabMaxHeight
    })
    // emit
    const onAddEdit = (isAdd, account) => {
      if (isAdd) {
        addAccount(account)
      } else {
        editAccount(account)
      }
    }
    return {
      accountAddEdit,
      actionBar,
      actions,
      onBarAction,
      accounts,
      tabMaxHeight,
      selectionChange,
      disabledCheckbox,
      onAddEdit
    }
  }
}
</script>

<style>

</style>