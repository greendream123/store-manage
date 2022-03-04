<template>
  <el-dialog :title="$t('bePutInStorage')" v-model="visible" width="480px" modal @close="btnClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <ValidateInput ref="productCode" v-model:iValue="curPro.code" :label="$t('productCode')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
     :isDisabled="true" />
    <ValidateSelect ref="productType" v-model:sValue="curPro.type" :label="$t('productType')" :lStyle="{width:'100px'}" :sStyle="{width:'308px'}" 
    :options="productTypes" :isDisabled="true" />
    <ValidateInput ref="productName" v-model:iValue="curPro.name" :label="$t('productName')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :isDisabled="true" />
    <ValidateInput ref="productCost" v-model:iValue="curPro.cost" v-show="userInfo.role == 'admin'" :label="$t('productCost')" :lStyle="{width:'100px'}" 
    :iStyle="{width:'308px'}" :isDisabled="true" />
    <ValidateInput ref="productPrice" v-model:iValue="curPro.price" v-show="userInfo.role == 'admin'" :label="$t('productPrice')" :lStyle="{width:'100px'}" 
    :iStyle="{width:'308px'}" :isDisabled="true" />
    <ValidateInput ref="productInventory" v-model:iValue="curPro.s_count" v-show="userInfo.role == 'admin'" :label="$t('productInventory')" 
    :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" :isDisabled="true" />
    <ValidateInput ref="productUnit" v-model:iValue="curPro.unit" :label="$t('productUnit')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :isDisabled="true" />
    <ValidateInput ref="boxNumberRef" v-model:iValue="boxNumber" :label="$t('count')" :rightLabel="$t('box')" :lStyle="{width:'100px'}" :iStyle="{width:'118px'}" 
    :customStyle="{display: 'inline-block'}" :validators=[numberValidator] />
    <ValidateInput ref="aunitNumberRef" v-model:iValue="aunitNumber" :rightLabel="$t('aUnit')" :iStyle="{width:'118px'}"
    :customStyle="{display: 'inline-block'}" :validators=[numberValidator] />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnClose">{{$t('btnCancel')}}</el-button>
        <el-button type="primary" @click="btnOk">{{$t('btnOk')}}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
import APIs from '@/libs/api.js'
import { isEmpty, clone, i18n, isNumber, standardAPIRequest, showError, showSuccess } from '@/libs/common.js'
import ValidateInput from '@c/validate-input/validate-input.vue'
import ValidateSelect from '@c/validate-select/validate-select.vue'
  const { t } = useI18n()
  let productTypes = ref([i18n(t, 'commodity'), i18n(t, 'foods'), i18n(t, 'drinks')])
  let visible = ref(false)
  let curPro = ref({})
  
  // 登录用户信息
  const store = useStore()
  const userInfo = computed(() => store.getters.loginedUser)
  // 展示事件
  const show = (_curPro) => {
    curPro.value = clone(_curPro)
    visible.value = true
  }
  // 关闭事件
  const btnClose = () => {
    visible.value = false
    curPro.value = {}
    boxNumber.value = 0
    aunitNumber.value = 0
  }
  // 保存事件
  const btnOk = () => {
    for (const input of [ boxNumberRef, aunitNumberRef ]) {
      if (!input.value.validate()) return
    }
    curPro.value.s_count = calcStorage(curPro.value)
    curPro.value.inTime = new Date().getTime()
    saveStorage(curPro.value)
  }
  // 保存库存
  const emit = defineEmits(['on-reload'])
  const saveStorage = (pro) => {
    standardAPIRequest(APIs.editProducts, pro, (ok, desc) => {
      if (ok) {
        showSuccess(i18n(t, 'bePutInStorage', 'success'))
        btnClose()
        emit('on-reload')
      } else {
        showError(desc)
      }
    })
  }
  // 
  let boxNumber = ref(0)
  let aunitNumber = ref(0)
  // 验证 boxNumber aunitNumber 是否为数字
  let boxNumberRef = ref(null)
  let aunitNumberRef = ref(null)
  const numberValidator = (text) => {
    if (!isNumber(text)) {
      return i18n(t, 'inputValiNumber')
    }
  }
  // 计算最终库存
  const calcStorage = (pro) => {
    let count = pro.s_count + boxNumber.value * pro.unit + parseInt(aunitNumber.value)
    return count
  }

  defineExpose({
    show
  })
</script>
<style scoped>
.dialog-footer {
  margin-right: 12px;
}
</style>