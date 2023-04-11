<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, onUnmounted, watch } from 'vue'
let props = defineProps({
  legendData: {
    type: Array,
    default: []
  },
  categoryData: {
    type: Array,
    default: []
  },
  seriesData: {
    type: Array,
    default: []
  },
  className: {
    type: String,
    default: 'chart',
  },
  config: {
    type: Object,
    default: () => { },
  },
  id: {
    type: String,
    default: 'chart',
  },
  width: {
    type: String,
    default: '200px',
  },
  height: {
    type: String,
    default: '200px',
  },
})
const options = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {
        show: true
      }
    }
  },
  legend: {
    data: props.legendData
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '2%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.categoryData,
  },
  yAxis: {
    type: 'value',
  },
  series: props.seriesData,

}

let chart = null;
watch([() => props.categoryData, () => props.seriesData], ([newCategoryData, newSeriesData]) => {
  options.series = newSeriesData
  options.xAxis.data = newCategoryData
  chart.setOption(options)
})
const hdReSize = () => {
  chart && chart.resize()
}
onMounted(() => {
  chart = echarts.init(document.getElementById(props.id))
  chart.setOption(options)
  window.addEventListener('resize', hdReSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', hdReSize)
})
</script>


