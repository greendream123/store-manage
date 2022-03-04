<template>
  <div :style="divStyleInternal">
    <label class="left-label" :style="lStyle">{{ label }}</label>
    <el-tooltip v-model="error" class="item" effect="dark" :content="errInfo" :placement="tooltipPlace" :manual="true">
      <el-input ref="input" :model-value="iValue" :placeholder="placeholder" :type="iType" :style="iStyle" @input="changeInputValue"
      :show-password="password" :disabled="isDisabled" ></el-input>
    </el-tooltip>
    <label class="right-label">{{ rightLabel }} </label>
  </div>
</template>
<script>
import { reactive, toRefs, ref } from 'vue'
import { isEmpty } from '@/libs/common.js'

export default {
  props: {
    label: String,
    rightLabel: String,
    placeholder: String,
    iValue: [String, Number],
    lStyle: {}, // label style
    iStyle: {}, // input style
    validators: Array,
    password: { type: Boolean, default: false },
    tooltipPlace: { type: String, default: 'right' },
    isDisabled: { type: Boolean, default:false },
    customStyle: { type: Object, default: {} }
  },
  emits: ['update:iValue'],
  setup(props, ctx) {
    let divStyleInternal = reactive({marginBottom: '8px', marginTop: '8px'})
    let error = ref(false)
    let errInfo = ref('')
    let iType = ref('iType')

    const { password, validators, iValue, rightLabel, isDisabled, customStyle } = toRefs(props)

    if (password.value) {
      iType.value = 'password'
      divStyleInternal.value = { marginBottom: '8px', marginTop: '0px', display: 'inline-block' }
    } else {
      iType.value = 'text'
    }
    if (!isEmpty(customStyle.value)) {
      divStyleInternal = Object.assign(divStyleInternal, customStyle.value)
    }

    const reset = () => { error.value = false }

    const input = ref(null)

    const validate = () => {
      error.value = false
      if (validators.value == undefined || validators.value.length == 0) {
        return true
      }
      for (let validator of validators.value) {
        const _errInfo = validator(iValue.value)
        if (_errInfo && _errInfo != '') {
          error.value = true
          errInfo.value = _errInfo
          input.value.focus()
          setTimeout(() => { reset() }, 3000)
          return false
        }
      }
      return true
    }

    const changeInputValue = (e) => {
      ctx.emit('update:iValue', e)
    }

    return {
      divStyleInternal,
      error,
      errInfo,
      iType,
      iValue,
      rightLabel,
      validate,
      input,
      changeInputValue,
      isDisabled
    }
  }
}
</script>
<style scoped>
.left-label {
  padding-right: 20px;
  display: inline-block;
  text-align: right;
  font-size: 14px;
}
.right-label {
  padding-left: 12px;
}
</style>