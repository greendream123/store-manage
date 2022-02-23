<template>
<div></div>
</template>

<script>
import { checkToken } from '@/libs/common.js'

export default {
  mounted() {
    checkToken(ok => {
      if (ok) { // token 验证通过去 home ，否则去 login
        this.$router.push({path: '/home'})
      } else {
        this.$router.push({path: '/login'})
      }
    })
  }
}
</script>
