<template>
  <el-dialog :title="title" v-model="visible" width="480px" modal @close="btnClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <ValidateInput ref="username" v-model:iValue="curAccount.username" :label="$t('accountName')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
     :isDisabled="!isAdd" :validators=[usernameValidator] />
    <ValidateInput v-model:iValue="curAccount.nickname" :label="$t('nickName')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" />
    <ValidateInput v-show="isAdd" v-model:iValue="curAccount.password" :label="$t('password')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :password="true" />
    <ValidateSelect ref="role" v-model:sValue="curAccount.role" :label="$t('role')" :lStyle="{width:'100px'}" :sStyle="{width:'308px'}" 
    :options="roles" :validators=[roleValidator] />
    <ValidateInput ref="phone" v-model:iValue="curAccount.phone" :label="$t('phone')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :validators=[phoneValidator] />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnClose">{{$t('btnCancel')}}</el-button>
        <el-button type="primary" @click="btnOk">{{$t('btnOk')}}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ref, getCurrentInstance } from 'vue'
import { isEmpty, clone } from '@/libs/common.js'
import ValidateInput from '@c/validate-input/validate-input.vue'
import ValidateSelect from '@c/validate-select/validate-select.vue'
export default {
  components: {
    ValidateInput,
    ValidateSelect
  },
  emits: ['on-add-edit'],
  setup(props, ctx) {
    const { proxy } = getCurrentInstance()
    let title = ref('')
    let visible = ref(false)
    let roles = ref([])
    let curAccount = ref({})
    let isAdd = ref(true)
    let accounts = ref([])
    
    const show = (_accounts, _isAdd, _editAccount) => {
      roles.value = ['admin', proxy.$t('cashier'), proxy.$t('warehouseKeeper')]
      accounts.value = _accounts
      isAdd.value = _isAdd
      if (_isAdd) {
        title.value = proxy.$t('addAccount')
      } else {
        title.value = proxy.$t('editAccount')
        curAccount.value = clone(_editAccount)
      }
      visible.value = true
    }

    const btnClose = () => {
      visible.value = false
      curAccount.value = {}
    }
    const btnOk = () => {
      for (const input of [username, role, phone]) {
        if (!input.value.validate()) return
      }
      if (isAdd.value) curAccount.value.time = new Date().getTime()
      ctx.emit('on-add-edit', isAdd.value, curAccount.value)
      btnClose()
    }

    const username = ref(null)
    const role = ref(null)
    const phone = ref(null)
    const usernameValidator = (text) => {
      if (isEmpty(text)) {
        return proxy.$t('notEmpty')
      } else {
        let isExist = accounts.value.filter(item => item.username == text)
        if (isAdd.value) {
          if (isExist.length > 0) return proxy.$t('alreadyExist')
        } else {
          if (isExist.length > 1) return proxy.$t('alreadyExist')
        }
      }
    }
    const roleValidator = (text) => {
      if (isEmpty(text)) return proxy.$t('notEmpty')
    }
    const phoneValidator = (text) => {
      if (isEmpty(text)) {
        return proxy.$t('notEmpty')
      } else {
        if (text.length != 11) return proxy.$t('inputPhone')
      }
    }

    return {
      show,
      title,
      visible,
      roles,
      curAccount,
      isAdd,
      btnClose,
      btnOk,
      username,
      role,
      phone,
      usernameValidator,
      roleValidator,
      phoneValidator,
    }
  },
}
</script>
<style scoped>
.dialog-footer {
  margin-right: 12px;
}
</style>