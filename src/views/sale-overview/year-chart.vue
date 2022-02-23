<!-- 年收入比较图表 -->
<template>
  <el-card class="parent-style">
    <div>
      <ValidateSelect v-model:sValue="firstYear" :label="$t('comparisonYear')" :divStyle="{ display: 'inline-block' }" :lStyle="{width:'70px'}" 
      :sStyle="{width:'100px'}" :options="yearOptions" />
      <ValidateSelect v-model:sValue="lastYear" :label="$t('comparisonYear')" :divStyle="{ display: 'inline-block' }" :lStyle="{width:'70px'}" 
      :sStyle="{width:'100px'}" :options="yearOptions" />
    </div>
    <br>
    <div v-show="dataIsEmpty" class="text-style">
      {{$t('noData')}}
    </div>
    <div v-show="!dataIsEmpty" id="year" class="box-style"></div>
    <div v-show="!dataIsEmpty" id="profit" class="box-style"></div>
  </el-card>
</template>
<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, watch } from 'vue'
import { isEmpty, standardAPIRequest, clone, i18n } from '@/libs/common.js'
import APIs from '@/libs/api.js'
import { useI18n } from 'vue-i18n'
import ValidateSelect from '@c/validate-select'

const { t } = useI18n()
// 可对比的年 []
let yearOptions = ref([])
const loadYearOptions = () => {
  standardAPIRequest(APIs.getSaleYears, null, (ok, desc, _options) => {
    if (ok && !isEmpty(_options)) {
      yearOptions.value = clone(_options)
    } else {
      yearOptions = []
    }
    if (yearOptions.value.length == 1) {
      yearOptions.value.unshift(yearOptions.value[0] - 1)
    }
  })
}
// 作对比的两年的数据
let firstYear = ref('')
let lastYear = ref('')
let firstYearData = ref([])
let lastYearData = ref([])
// 默认对比当年与前一年
lastYear.value = new Date().getFullYear()
firstYear.value = new Date().getFullYear() - 1
// 监听对比年变化 事实变化展示图表
watch(firstYear, () => {
  displayChart()
})
watch(lastYear, () => {
  displayChart()
})
// 加载前一年数据
const loadFirstYearData = () => {
  return new Promise((res, rej) => {
    standardAPIRequest(APIs.getYearSale, { selectYear: firstYear.value }, (ok, desc, _infos) => {
      if (ok) {
        if (!isEmpty(_infos)) firstYearData.value = clone(_infos)
        dataIsEmpty.value = false
      } else {
        firstYearData.value = []
        dataIsEmpty.value = true
        rej()
      }
      res()
    })
  })
}
// 加载后一年数据
const loadLastYearData = () => {
  return new Promise((res, rej) => {
    standardAPIRequest(APIs.getYearSale, { selectYear: lastYear.value }, (ok, desc, _infos) => {
      if (ok) {
        if (!isEmpty(_infos)) lastYearData.value = clone(_infos)
        dataIsEmpty.value = false
      } else {
        lastYearData.value = []
        dataIsEmpty.value = true
        rej()
      }
      res()
    })
  })
}
// 销售额，利润的数据及横坐标
const saleData = ref({})
const profitData = ref({})
// 数据空 展示文字  否则 展示数据图  （开关）
let dataIsEmpty = ref(false)

// 显示数据
const processEchartData = (abscissa, _arr, isProfit) => {
  if (isEmpty(abscissa)) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  let returnData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  abscissa.forEach(_date => {
    let saleroom = 0
    _arr.forEach(item => {
      if (isProfit) { // 累加利润
        if (item.s_time == _date) saleroom += item.profit
      } else { // 累加实际销售额
        if (item.s_time == _date) saleroom += item.officialreceipts
      }
    })
    returnData[_date-1] = saleroom
  })
  return returnData
}
// 数据的横坐标
const processAbscissa = (_arr) => {
  if (isEmpty(_arr)) return []
  let returnData = []
  _arr.forEach(item => {
    if (returnData.indexOf(item.s_time) < 0) returnData.push(item.s_time)
  });
  return returnData
}
// 图表横坐标
const chartAbscissa = []
for (let i = 1; i < 13; i++) {
  chartAbscissa.push(`${i}${i18n(t, 'month')}`)
}
// 绘图
const paintChart = (chartId, chartTitle, paintData) => {
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
        data: chartAbscissa
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
    series: [
      {
        name: firstYear.value,
        type: 'bar',
        data: paintData[firstYear.value],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      },
      {
        name: lastYear.value,
        type: 'bar',
        data: paintData[lastYear.value],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      }
    ]
  }
  myChart.setOption(defaultOption)
  window.addEventListener('resize', myChart.resize)
}
// 展示数据图表
const displayChart = async () => {
  saleData.value = []
  profitData.value = []
  // 查询展示数据
  await loadFirstYearData()
  await loadLastYearData()
  // 组织数据横坐标
  const firstYearAbscissa = processAbscissa(firstYearData.value)
  const lastYearAbscissa = processAbscissa(lastYearData.value)
  // 组织展示数据
  saleData.value[firstYear.value] = processEchartData(firstYearAbscissa, firstYearData.value)
  saleData.value[lastYear.value] = processEchartData(lastYearAbscissa, lastYearData.value)
  profitData.value[firstYear.value] = processEchartData(firstYearAbscissa, firstYearData.value, true)
  profitData.value[lastYear.value] = processEchartData(lastYearAbscissa, lastYearData.value, true)
  // 绘制图表
  for (const id of [ 'year', 'profit' ]) {
    let chartTitle = ''
    let paintData = {}
    if (id == 'year') {
      chartTitle = i18n(t, 'yearSaleContrast')
      paintData = saleData.value
    } else if (id == 'profit') {
      chartTitle = i18n(t, 'yearProfitContrast')
      paintData = profitData.value
    }
    paintChart(id, chartTitle, paintData)
  }
}

onMounted(() => {
  // 查询yearOption
  loadYearOptions()
  // 显示图表
  displayChart()
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
.content-style {
  height: 46%
}

.box-style {
  /* border: 1px solid green; */
  width: 47%;
  height: 90%;
  margin: 0 1%;
  padding-right: 1%;
  display: inline-block;
}

.text-style {
  font-size: 48px;
  color: #ddd;
  position: absolute;
  margin-left: calc(50% - 96px);
  margin-top: calc(20% - 24px);
}
</style>