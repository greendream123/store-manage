import {createStore} from 'vuex'
import { getTagNavListFromLocalstorage, setTagNavListInLocalstorage, } from '@/libs/util.js'
import fullFeatures from './features.js'
import user from './user.js'

export default createStore({
  state: {
    tagsList: [],
    collapse: false,
    limitedFeatures: fullFeatures, // 最终给当前登录账户显示哪些功能菜单
    language: '',
  },
  mutations: {
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1);
      setTagNavListInLocalstorage([...state.tagsList])
    },
    setTagsItem(state, data) {
      if (data) {
        state.tagsList.push(data)
      } else {
        state.tagsList = getTagNavListFromLocalstorage() || []
      }
      setTagNavListInLocalstorage([...state.tagsList])
    },
    clearTags(state) {
      state.tagsList = []
    },
    closeTagsOther(state, data) {
      state.tagsList = data;
    },
    closeCurrentTag(state, data) {
        for (let i = 0, len = state.tagsList.length; i < len; i++) {
            const item = state.tagsList[i];
            if (item.path === data.$route.fullPath) {
                if (i < len - 1) {
                    data
                        .$router
                        .push(state.tagsList[i + 1].path);
                } else if (i > 0) {
                    data
                        .$router
                        .push(state.tagsList[i - 1].path);
                } else {
                    data
                        .$router
                        .push("/");
                }
                state
                    .tagsList
                    .splice(i, 1);
                break;
            }
        }
    },
    // 侧边栏折叠
    handleCollapse(state, data) {
      state.collapse = data;
    },
    setLanguage(state, data) {
      state.language = data
    }
  },
  getters: {
    features: state => state.limitedFeatures,
    getLanguage: state => state.language,
    getTagsList: state => state.tagsList
  },
  modules: {
    user
  }
})