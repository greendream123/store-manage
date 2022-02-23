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
    <ValidateInput ref="productInventory" v-model:iValue="curPro.s_count" :label="$t('productInventory')" :lStyle="{width:'100px'}" :iStyle="{width:'308px'}" 
    :validators=[countValidator] />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnClose">{{$t('btnCancel')}}</el-button>
        <el-button type="primary" @click="btnOk">{{$t('btnOk')}}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEmpty, clone, i18n } from '@/libs/common.js'
import ValidateInput from '@c/validate-input/validate-input.vue'
import ValidateSelect from '@c/validate-select/validate-select.vue'
export default {
  components: {
    ValidateInput,
    ValidateSelect
  },
  emits: ['on-add-edit'],
  setup(props, ctx) {
    const { t } = useI18n()
    const { proxy } = getCurrentInstance()
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

    onMounted(() => {
      title.value = i18n(t, 'editProduct')
    })

    const btnClose = () => {
      visible.value = false
      curPro.value = {}
    }
    const btnOk = () => {
      for (const input of [productCode, productType, productName, productCost, productPrice, productInventory]) {
        if (!input.value.validate()) return
      }
      curPro.value.inTime = new Date().getTime()
      ctx.emit('on-add-edit', curPro, isAdd.value)
    }

    const productCode = ref(null)
    const productType = ref(null)
    const productName = ref(null)
    const productCost = ref(null)
    const productPrice = ref(null)
    const productInventory = ref(null)
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
    const typeValidator = (text) => {
      if (isEmpty(text)) return i18n(t, 'notEmpty')
    }
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
    const priceValidator = (text) => {
      if (isEmpty(text)) {
        return i18n(t, 'notEmpty')
      } else {
        if (text < 0) {
          return i18n(t, 'inputValiPrice')
        }
      }
    }
    const countValidator = (text) => {
      if (isEmpty(text)) {
        return i18n(t, 'notEmpty')
      } else {
        if (text < 0) {
          return i18n(t, 'inputValiStorage')
        }
      }
    }
    return {
      productTypes,
      visible,
      title,
      curPro,
      isAdd,
      show,
      btnOk,
      btnClose,
      productCode,
      productType,
      productName,
      productCost,
      productPrice,
      productInventory,
      codeValidator,
      typeValidator,
      nameValidator,
      priceValidator,
      countValidator
    }
  },
}
</script>
<style scoped>
.dialog-footer {
  margin-right: 12px;
}
</style>