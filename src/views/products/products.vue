<template>
  <el-card style="height: 99%">
    <TableActionBar ref="actionBar" @on-action="onBarAction" :actions="actions" />
    <el-table ref="productTable" :data="products" :max-height="tabMaxHeight" border stripe @selection-change="selectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" :label="$t('productCode')" width="240"></el-table-column>
      <el-table-column prop="img" :label="$t('productImage')" width="240"></el-table-column>
      <el-table-column prop="type" :label="$t('productType')" width="180"></el-table-column>
      <el-table-column prop="name" :label="$t('productName')" ></el-table-column>
      <el-table-column prop="cost" :label="$t('productCost')" width="180"></el-table-column>
      <el-table-column prop="price" :label="$t('productPrice')" width="180"></el-table-column>
      <el-table-column prop="s_count" :label="$t('productInventory')" width="180"></el-table-column>
      <el-table-column prop="inTime" :label="$t('storageTime')" width="180"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" class="page-style"
      :page-sizes="[30, 50, 100]" :page-size="currentPageSize" layout="prev, pager, next, sizes, total" :total="productCount">
    </el-pagination>
    <ProductAddEdit ref="productAddEdit" @on-add-edit="onAddEdit" />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance, toRefs, defineProps } from 'vue'
import { isEmpty, standardAPIRequest, showError, showSuccess, clone, i18n, getSingleSelection, getSelection, showConfirm } from '@/libs/common.js'
import APIs from '@/libs/api.js'
import TableActionBar from '@c/table-action-bar'
import ProductAddEdit from './products-add-edit.vue'
import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const props = defineProps({
    productType: { default: null, type: String }
  })
  const { proxy } = getCurrentInstance()
  // tabbar
  const actions = reactive({
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    refresh: 'refresh',
  })
  const productAddEdit = ref(null)
  const onBarAction = (action) => {
    if (action == 'add') {
      showAddEditDlg(products, true)
    } else if (action == 'edit') {
      let el = getSingleSelection(t, sels.value)
      if (isEmpty(el)) return
      showAddEditDlg(products, false, el)
    } else if (action == 'delete') {
      let els = ref(getSelection(t, sels.value))
      if (isEmpty(els)) return
      showConfirm(i18n(t, 'congfirmDelProducts'), i18n(t, 'confirmOperation'))
      .then(() => {
        delProducts(els)
      })
      .catch((err) => {
        console.log(err)
      })
    } else if (action == 'refresh') {
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
    let data = {}
    if (productType.value != null) data = { type: i18n(t, productType.value) }
    standardAPIRequest(APIs.getProductCount, data, (ok, desc, _count) => {
      if (!ok) {
        showError(desc)
      } else {
        productCount.value = _count
        // 根据页码及每页数量请求数据
        if (_count > 0) {
          let data = { currentPage: currentPage.value, currentPageSize:currentPageSize.value }
          if (productType.value != null) data.type = i18n(t, productType.value)
          standardAPIRequest(APIs.getProducts, data, (ok, desc, _products) => {
            if (ok) {
              products.value = clone(_products)
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
</style>