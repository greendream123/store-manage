<!-- 付款dlg -->
<template>
  <el-dialog v-model="visible" :title="$t('confirmReceipt')" width="30%" :before-close="close" >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">{{$t('btnCancel')}}</el-button>
        <el-button type="primary" @click="onOk">{{$t('btnOk')}}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import { isEmpty } from '@/libs/common.js'
  const emit = defineEmits(['save-ok'])
  // dlg 展示控制器
  let visible = ref(false)
  // 应收金额
  let receivable = ref(0)
  // 实收金额
  let officialReceipts = ref(0)
  const show = (money) => {
    visible.value = true
    if (!isEmpty(money)) {
      receivable.value = money
      officialReceipts.value = money
    }
  }
  const onOk = () => {
    // 触发事件  父元素向后台发送订单
    emit('save-ok', '1111')
    close()
  }
  const close = () => {
    visible.value = false
    receivable.value = 0
    officialReceipts.value = 0
  }
  defineExpose({
    show
  })
</script>