<template>
  <div :style="divStyleInternal">
    <label class="left-label" :style="lStyle">{{ label }}</label>
    <div class="inline" :style="sStyle">
      <el-tooltip :placement="tooltipPlace" :content="errInfo" v-model="error" :manual="true">
        <el-select :model-value="sValue" :placeholder="$t('pleaseSelect')" :multiple="multiple" :popper-append-to-body="true" @change="changeInputValue">
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-tooltip>
    </div>
    <label class="right-label">{{ rightLabel }} </label>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { isEmpty } from '@/libs/common.js'
export default {
  props: {
    label: String,
    rightLabel: String,
    sValue: [String, Array, Number],
    divStyle: Object,
    lStyle: Object, // label style
    sStyle: Object, // select style
    validators: Array,
    options: Array,
    multiple: { type: Boolean, default: false },
    tooltipPlace: { type: String, default: 'right' },
  },
  emits: ['update:sValue'],
  setup(props, ctx) {
    let divStyleInternal =  reactive({marginBottom: '8px', marginTop: '8px'})
    let error = ref(false)
    let errInfo = ref('')

    // props
    let { divStyle, validators, sValue, multiple, tooltipPlace, sStyle } = toRefs(props)
    if (!isEmpty(divStyle.value)) {
      divStyleInternal = divStyle.value
    }

    // func
    const reset = () => error.value = false
    const validate = () => {
      error.value = false
      if (validators.value == undefined || validators.value.length == 0) {
        return true
      }
      for (let validator of validators.value) {
        const _errInfo = validator(sValue.value)
        if (_errInfo && _errInfo != '') {
          error.value = true
          errInfo.value = _errInfo
          setTimeout(() => reset(), 3000)
          return false
        }
      }

      return true
    }

    const changeInputValue = (e) => {
      ctx.emit('update:sValue', e)
    }

    return {
      divStyleInternal,
      error,
      errInfo,
      multiple,
      sValue,
      sStyle,
      validate,
      tooltipPlace,
      changeInputValue
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
.inline {
  display: inline-block;
}
.el-select {
  width: 100%;
}
</style>
