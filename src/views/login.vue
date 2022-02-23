<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">{{ $t('pms') }}</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-icon class="el-icon-user"></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter="submitForm()">
            <template #prepend>
              <el-icon class="el-icon-lock"></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">{{$t('login')}}</el-button>
        </div>
        <div class="login-tips">
          <p>{{$t('loginTip')}}</p>
          <svg-icon :icon-class="langIcon" class="small-icon" @click="changeLang" />
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { standardAPIRequest, showError, showSuccess } from '@/libs/common.js'
import { clearLocalStorage, localSet, setCookies } from '@/libs/util.js'
import { useI18n } from 'vue-i18n'
import APIs from '@/libs/api.js'
  const { t } = useI18n()
  // vue
  const store = useStore()
  const setLoginedUser = (userInfo) => store.commit('setLoginedUser', userInfo)
  const router = useRouter()
  // custom
  const param = reactive({
    username: "admin",
    password: "admin",
  })
  const rules = {
    username: [
      {
        required: true,
        message: t('inputUsername'),
        trigger: "blur",
      },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
    ],
  }
  const login = ref(null)
  const submitForm = () => {
    login.value.validate((valid) => {
      if (valid) {
        userLogin()
      } else {
        showError("登录失败")
        return false
      }
    })
  }
  // 设置token
  const userLogin = () => {
    let flag = true
    if (!flag) return
    standardAPIRequest(APIs.adminLogin, param, (ok, desc, _userInfo) => {
      flag = false
      if (ok) {
        console.log(_userInfo)
        clearLocalStorage() // 登录后清空 localStorage ，因为不同账号带的信息可能不一样
        // 保存token
        if (_userInfo) {
          setCookies({ 'token': _userInfo.token })
          const { role, username } = _userInfo
          setLoginedUser({ role, username })
          showSuccess(t('loginSuccess'))
          router.push("/home")
        } else {
          showError(t('loginFailed'))
        }
      } else {
        showError(t('loginFailed'))
      }
      flag = true
    })
  }
  store.commit("clearTags")
  // 切换语言函数
  const setLanguage = (language) => store.commit('setLanguage', language)
  let { proxy } = getCurrentInstance()
  let langIcon = ref('chinese')
  const changeLang = () => {
    let languages = proxy.$i18n.availableLocales
    proxy.$i18n.locale = proxy.$i18n.locale == languages[0] ? languages[1] : languages[0]
    langIcon.value = proxy.$i18n.locale == 'zh-CN' ? 'chinese' : 'english'
    // 设置vuex lang
    setLanguage(proxy.$i18n.locale)
  }
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.small-icon :hover {
  cursor: pointer;
}
</style>