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
  title: {
    text: '班级科目成绩分析饼状图',
    subtext: '0~59:不及格；60~69:较差；70~79:一般；80~89:良；90以上：优',
    x: 'center'
  },
  grid: {
    top: 10,
    left: '2%',
    right: '2%',
    bottom: '2%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    data: props.legendData
  },
  series: [
    {
      name: '数量',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: props.seriesData,
    },
  ],
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: {
        show: true,
        type: ['pie', 'funnel'],
        option: {
          funnel: {
            x: '25%',
            width: '50%',
            funnelAlign: 'left',
            max: 1548
          }
        }
      },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
}
let chart = null
watch(
  () => props.seriesData,
  (seriesData) => {
    options.series[0].data = seriesData
    chart.setOption(options, true)
  }
)
let hdResize = () => {
  chart && chart.resize()
}
onMounted(() => {
  chart = echarts.init(document.getElementById(props.id))
  chart.setOption(options, true)
  window.addEventListener('resize', hdResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', hdResize)
})
</script>

