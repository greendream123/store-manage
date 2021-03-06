<template>
  <el-card style="height: 99%">
    <TableActionBar ref="actionBar" @on-action="onBarAction" :actions="actions" @on-search="onSearch" />
    <el-table ref="productTable" :data="products" :max-height="tabMaxHeight" border stripe @selection-change="selectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" :label="$t('productCode')"></el-table-column>
      <el-table-column prop="img" :label="$t('productImage')" width="240" align="center">
        <template #default="scope">
          <img class="img-style" :src="`${pictureBaseUrl}${scope.row.code}.png`" :alt="$t('samplePicture')">
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('productName')" align="center"></el-table-column>
      <el-table-column v-show="userInfo.role == 'admin'" prop="cost" :label="$t('productCost')" align="center"></el-table-column>
      <el-table-column v-show="userInfo.role == 'admin'" prop="price" :label="$t('productPrice')" align="center"></el-table-column>
      <el-table-column prop="s_count" :label="$t('productInventory')" align="center"></el-table-column>
      <el-table-column prop="unit" :label="$t('productUnit')" align="center"></el-table-column>
      <el-table-column prop="inTime" :label="$t('storageTime')" width="180"></el-table-column>
      <el-table-column prop="" :label="$t('upload')+$t('samplePicture')" align="center">
        <template #default="scope">
          <!-- 上传示例图片 -->
          <el-upload action="http://127.0.0.1:7001/uploadPicture" class="upload-style" :name="scope.row.code" accept=".png" :multiple="false" 
          :headers="{'Authorization': getCookies('token')}" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError">
            <el-button type="primary">{{$t('upload')}}</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="" :label="$t('bePutInStorage')" align="center">
        <template #default="scope">
          <!-- 入库商品 -->
          <el-button type="primary" @click="addInventory(scope.row)" >{{$t('bePutInStorage')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" class="page-style"
      :page-sizes="[30, 50, 100]" :page-size="currentPageSize" layout="prev, pager, next, sizes, total" :total="productCount">
    </el-pagination>
    <ProductAddEdit ref="productAddEdit" @on-add-edit="onAddEdit" />
    <BuyProduct ref="buyProduct" @on-reload="loadData" />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted, computed, toRefs } from 'vue'
import { useStore } from "vuex"
import { getCookies } from '@/libs/util.js'
import { isEmpty, standardAPIRequest, showError, showSuccess, clone, i18n, 
getSingleSelection, getSelection, showConfirm } from '@/libs/common.js'
import APIs from '@/libs/api.js'
import TableActionBar from '@c/table-action-bar'
import ProductAddEdit from './products-add-edit.vue'
import BuyProduct from './buy-products.vue'
import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const pictureBaseUrl='http://127.0.0.1:7001/public/images/'
  const props = defineProps({
    productType: { default: null, type: String }
  })
  
  const store = useStore()
  const userInfo = computed(() => store.getters.loginedUser)
  // tabbar
  const actions = reactive({
    add: i18n(t, 'add'),
    edit: i18n(t, 'edit'),
    delete: i18n(t, 'delete'),
    refresh: i18n(t, 'refresh'),
    search: i18n(t, 'search'),
  })
  const searchText = ref('')
  const productAddEdit = ref(null)
  const onBarAction = (action) => {
    if (action === 'add') {
      showAddEditDlg(products, true)
    } else if (action === 'edit') {
      let el = getSingleSelection(t, sels.value)
      if (isEmpty(el)) return
      showAddEditDlg(products, false, el)
    } else if (action === 'delete') {
      let els = ref(getSelection(t, sels.value))
      if (isEmpty(els)) return
      showConfirm(i18n(t, 'congfirmDelProducts'), i18n(t, 'confirmOperation'))
      .then(() => {
        delProducts(els)
      })
      .catch((err) => {
        console.log(err)
      })
    } else if (action === 'refresh') {
      loadData()
    }
  }
  const showAddEditDlg = (products, isAdd, el) => {
    productAddEdit.value.show(products, isAdd, el)
  }
  const addProduct = (el) => {
    standardAPIRequest(APIs.addProducts, el, (ok, desc) => {
      if (ok) {
        productAddEdit.value.btnClose()
        showSuccess(desc)
        loadData()
      } else {
        showError(desc)
      }
    })
  }
  const editProduct = (el) => {
    standardAPIRequest(APIs.editProducts, el, (ok, desc) => {
      if (ok) {
        productAddEdit.value.btnClose()
        showSuccess(desc)
        loadData()
      } else {
        showError(desc)
      }
    })
  }
  const delProducts = (els) => {
    let codes = []
    els.value.forEach(item => { codes.push(item.code) })
    standardAPIRequest(APIs.delProducts, codes, (ok, desc) => {
      if (ok) {
        showSuccess(i18n(t, 'delOk'))
        loadData()
      } else {
        showError(desc)
      }
    })
  }
  const onAddEdit = (curPro, isAdd) => {
    if (isEmpty(curPro)) return
    if (isAdd) {
      addProduct(curPro.value)
    } else {
      editProduct(curPro.value)
    }
  }
  const onSearch = (text) => {
    searchText.value = text
    loadData()
  }

  // table
  // height
  let tabMaxHeight = ref(document.body.clientHeight - 230)
  const calcTabMaxHeight = () => {
    tabMaxHeight.value = document.body.clientHeight - 230
  }
  let sels = ref([])
  const selectionChange = (_sels) => {
    sels.value = _sels
  }
  // 商品类型
  let { productType } = toRefs(props)
  // data
  let products = ref(null)
  const loadData = () => {
    // 请求商品总量（多少种商品
    standardAPIRequest(APIs.getProductCount, buildQueryParam(), (ok, desc, _count) => {
      if (!ok) {
        showError(desc)
      } else {
        productCount.value = _count
        // 根据页码及每页数量请求数据
        if (_count > 0) {
          standardAPIRequest(APIs.getProducts, buildQueryParam(), (ok, desc, _products) => {
            if (ok) {
              if (!isEmpty(_products)) {
                products.value = clone(_products)
              }
            } else {
              showError(desc)
            }
          })
        } else {
          products.value = []
        }
      }
    })
  }
  const buildQueryParam = () => {
    let query = { currentPage: currentPage.value, currentPageSize: currentPageSize.value }
    let hasWhere = false
    if (productType.value) {
      query.where = `type='${i18n(t, productType.value)}'`
      hasWhere = true
    }
    if (searchText.value) {
      if (hasWhere) {
        query.where += ' and '
      } else {
        query.where = ''
      }
      query.where += `name like '%${searchText.value}%'`
      hasWhere = true
    }
    return query
  }

  //page
  let currentPage = ref(1)
  let currentPageSize = ref(50)
  let productCount = ref(0)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    loadData()
  }
  const handleSizeChange = (val) => {
    currentPageSize.value = val
    loadData()
  }
  // 上传
  const uploadSuccess = (res) => {
    if (res.code == 0) {
      showSuccess(i18n(t, 'upload', 'success'))
    } else {
      showError(res.desc)
    }
  }
  const uploadError = (err, file) => {
    showError(err)
  }
  // 入库商品
  let buyProduct = ref(null)
  const addInventory = (proInfo) => { // 传递给子元素商品信息用以展示
    buyProduct.value.show(proInfo)
  }
  // loadData
  onMounted(() => { 
    loadData()
    window.onresize = calcTabMaxHeight
  })
  const productTable = ref(null)
</script>
<style scoped>
.card-content {
  height: 99%;
}

.page-style {
  margin-top: 16px;
}

.img-style {
  width: 100px;
  height: 100px;
}

.upload-style >>> .el-upload--text {
  width: auto;
  height: 40px;
  display: block;
  border: 0px;
}
</style>