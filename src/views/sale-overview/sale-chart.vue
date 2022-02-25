<!-- 销售额图表 -->
<template>
  <el-card class="parent-style">
    <span class="date-picker-style">{{ $t('searchYear') }}</span>
    <el-date-picker
      v-model="selectYear"
      type="year">
    </el-date-picker>
    <div v-show="dataIsEmpty" class="text-style">
      {{$t('noData')}}
    </div>
    <div v-show="!dataIsEmpty" class="content-style">
      <div id="year" class="box-style"></div>
      <div id="foods" class="box-style"></div>
    </div>
    <br>
    <div v-show="!dataIsEmpty" class="content-style">
      <div id="drinks" class="box-style"></div>
      <div id="commodity" class="box-style"></div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import APIs from '@/libs/api.js'
import { isEmpty, standardAPIRequest, showError, showSuccess, clone, i18n } from '@/libs/common.js'

const { t } = useI18n()

let selectYear = ref('')
if (isEmpty(selectYear.value)) {
  selectYear.value = new Date().getFullYear() + ''
}
watch(
  () => selectYear.value,
  (newVal, oldVal) => {
    selectCondition.year = newVal.getFullYear()
    repeatPaint()
  }
)
let selectCondition = {
  year: selectYear.value
}
let saleInfos = ref({})
const loadData = () => {
  return new Promise((res, rej) => {
    standardAPIRequest(APIs.getSaleInfos, selectCondition, (ok, desc, _infos) => {
      if (ok && !isEmpty(_infos)) {
        saleInfos.value = clone(_infos)
      } else {
        saleInfos.value = {}
      }
      res()
    })
  })
}
// 三类商品的数据及横坐标
const foodData = ref([])
const drinkData = ref([])
const commodityData = ref([])
const foodAbscissa = ref([])
const drinkAbscissa = ref([])
const commodityAbscissa = ref([])
// 数据空 展示文字  否则 展示数据图  （开关）
let dataIsEmpty = ref(false)

// 加工展示所需数据
const processDisplayData = () => {
  return new Promise((res, rej) => {
    if (isEmpty(saleInfos.value)) {
      dataIsEmpty.value = true
      return
      rej()
    } else {
      dataIsEmpty.value = false
    }
    for (const key in saleInfos.value) {
      if (key == i18n(t, 'foods')) {
        foodAbscissa.value = processAbscissa(saleInfos.value[key])
        foodData.value = processEchartData(foodAbscissa.value, saleInfos.value[key])
      } else if (key == i18n(t, 'drinks')) {
        drinkAbscissa.value = processAbscissa(saleInfos.value[key])
        drinkData.value = processEchartData(drinkAbscissa.value, saleInfos.value[key])
      } else {
        commodityAbscissa.value = processAbscissa(saleInfos.value[key])
        commodityData.value = processEchartData(commodityAbscissa.value, saleInfos.value[key])
      }
    }
    res()
  })
}
// 显示数据
const processEchartData = (abscissa, _arr) => {
  if (isEmpty(abscissa)) return []
  let returnData = []
  abscissa.forEach(_date => {
    let saleroom = 0
    _arr.forEach(item => {
      if (item.s_time == _date) saleroom += item.price * item.s_count
    })
    returnData.push(saleroom)
  })
  return returnData
}
// 显示的横坐标
const processAbscissa = (_arr) => {
  if (isEmpty(_arr)) return []
  let returnData = []
  _arr.forEach(item => {
    if (returnData.indexOf(item.s_time) < 0) returnData.push(item.s_time)
  });
  return returnData
}
// 绘图
const paintChart = (chartId, chartTitle, paintData, abscissa) => {
  const chartDom = document.getElementById(chartId)
  const myChart = echarts.init(chartDom)
  const defaultOption = {
    title: {
      text: chartTitle
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: abscissa
      }
    ],
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        formatter: function(value) {
          return value + i18n(t, 'yuan')
        }
      },
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: 'bar',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        data: paintData
      }
    ]
  }
  const yearOption = {
    title: {
      text: chartTitle
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: abscissa
      }
    ],
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return value + i18n(t, 'yuan')
        }
      },
    },
    series: [
      {
        name: i18n(t, 'foods'),
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: paintData['foods']
      },
      {
        name: i18n(t, 'drinks'),
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: paintData['drinks']
      },
      {
        name: i18n(t, 'commodity'),
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: paintData['commodity']
      },
    ]
  }
  if (chartId == 'year') {
    myChart.setOption(yearOption)
  } else {
    myChart.setOption(defaultOption)
  }
  window.addEventListener('resize', myChart.resize)
}

// 重复绘制动作
const repeatPaint = async () => {
  await loadData()
  await processDisplayData()
  for (const id of ['year', 'foods', 'drinks', 'commodity' ]) {
    const chartTitle = ref('')
    const allPaintData = {
      'foods': foodData.value,
      'drinks': drinkData.value,
      'commodity': commodityData.value
    }
    const paintData = ref([])
    if (id == 'year') {
      chartTitle.value = i18n(t, 'annualsales')
      paintData.value = allPaintData
    } else {
      chartTitle.value = i18n(t, id)
      paintData.value = allPaintData[id]
    }
    paintChart(id, chartTitle.value, paintData.value, foodAbscissa.value)
  }
}

onMounted(() => {
  repeatPaint()
})

</script>
<style scoped>
.parent-style {
  height: 99%;
  position: relative;
}

.parent-style >>> .el-card__body {
  height: 100%;
}

.date-picker-style {
  display: inline-block;
  margin-right: 6px;
}

.content-style {
  width: 100%;
  height: 42%;
  margin-top: 1%;
}

.box-style {
  width: 49%;
  height: 100%;
  margin: 0 0.5%;
  display: inline-block;
  box-sizing: border-box;
}

.text-style {
  font-size: 48px;
  color: #ddd;
  position: absolute;
  margin-left: calc(50% - 96px);
  margin-top: calc(22% - 24px);
}
</style>