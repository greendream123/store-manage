<template>
  <el-dialog :title="title" v-model="visible" width="480px" modal @close="btnClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <ValidateInput ref="productCode" v-model:iValue="curPro.code" :label="$t('productCode')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
     :isDisabled="!isAdd" :validators=[codeValidator] />
    <ValidateSelect ref="productType" v-model:sValue="curPro.type" :label="$t('productType')" :lStyle="{width:'100px'}" :sStyle="{width:'308px'}" 
    :options="productTypes" :validators=[typeValidator] />
    <ValidateInput ref="productName" v-model:iValue="curPro.name" :label="$t('productName')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :validators=[nameValidator] />
    <ValidateInput ref="productCost" v-model:iValue="curPro.cost" :label="$t('productCost')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :validators=[priceValidator] />
    <ValidateInput ref="productPrice" v-model:iValue="curPro.price" :label="$t('productPrice')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :validators=[priceValidator] />
    <ValidateInput ref="productInventory" v-model:iValue="curPro.s_count" v-show="isAdd || userInfo.role === 'super'" :label="$t('productInventory')" 
    :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" :validators=[countValidator] />
    <ValidateInput ref="productUnit" v-model:iValue="curPro.unit" :label="$t('productUnit')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :validators=[unitValidator] />
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
import { isEmpty, clone, i18n, isGreaterZeroNumber } from '@/libs/common.js'
import ValidateInput from '@c/validate-input/validate-input.vue'
import ValidateSelect from '@c/validate-select/validate-select.vue'
  const emit = defineEmits(['on-add-edit'])
  const { t } = useI18n()
  let productTypes = ref([])
  let visible = ref(false)
  let title = ref('')
  let curPro = ref({})
  let isAdd = ref(true)
  let products = ref([])
  
  const show = (_products, _isAdd, editPro) => {
    products.value = _products.value
    isAdd.value = _isAdd
    title.value = i18n(t, 'addProduct')
    productTypes.value = [i18n(t, 'commodity'), i18n(t, 'foods'), i18n(t, 'drinks')]
    if (!_isAdd) {
      title.value = i18n(t, 'editProduct')
      curPro.value = clone(editPro)
    }
    visible.value = true
  }

  // 只有role==super才可以直接修改库存
  const store = useStore()
  const userInfo = computed(() => store.getters.loginedUser)

  onMounted(() => {
    title.value = i18n(t, 'editProduct')
  })

  const btnClose = () => {
    visible.value = false
    curPro.value = {}
  }
  const btnOk = () => {
    for (const input of [productCode, productType, productName, productCost, productPrice, productInventory, productUnit]) {
      if (!input.value.validate()) return
    }
    if (isAdd.value || userInfo.role === 'super') {
      for (const input of [productInventory]) {
        if (!input.value.validate()) return
      }
    }
    curPro.value.inTime = new Date().getTime()
    emit('on-add-edit', curPro, isAdd.value)
  }

  const productCode = ref(null)
  const codeValidator = (text) => {
    if (isEmpty(text)) {
      return i18n(t, 'notEmpty')
    } else {
      let isExist = products.value.filter(pro => pro.code == text)
      if (isAdd.value) {
        if (isExist.length > 0) return i18n(t, 'alreadyExist')
      } else {
        if (isExist.length > 1) return i18n(t, 'alreadyExist')
      }
    }
  }
  const productType = ref(null)
  const typeValidator = (text) => {
    if (isEmpty(text)) return i18n(t, 'notEmpty')
  }
  const productName = ref(null)
  const nameValidator = (text) => {
    if (isEmpty(text)) {
      return i18n(t, 'notEmpty')
    } else {
      let isExist = products.value.filter(pro => pro.name == text && pro.type == curPro.value.type)
      if (isAdd.value) {
        if (isExist.length > 0) return i18n(t, 'alreadyExist')
      } else {
        if (isExist.length > 1) return i18n(t, 'alreadyExist')
      }
    }
  }
  const productCost = ref(null)
  const productPrice = ref(null)
  const priceValidator = (text) => {
    if (isEmpty(text)) {
      return i18n(t, 'notEmpty')
    } else {
      if (!isGreaterZeroNumber(text)) {
        return i18n(t, 'inputValiPrice')
      }
    }
  }
  const productUnit = ref(null)
  const unitValidator = (text) => {
    if (!isEmpty(text)) {
      if (!isGreaterZeroNumber(text)) {
        return i18n(t, 'inputValiNumber')
      }
    }
  }
  const productInventory = ref(null)
  const countValidator = (text) => {
    if (isEmpty(text)) {
      curPro.value.s_count = 0
    } else {
      if (!isGreaterZeroNumber(text)) {
        return i18n(t, 'inputValiNumber')
      }
    }
  }
  defineExpose({
    show,
    btnClose
  })
</script>
<style scoped>
.dialog-footer {
  margin-right: 12px;
}
</style>