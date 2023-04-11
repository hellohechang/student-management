<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;">
            <Histogram />
          </el-icon>班级科目成绩统计
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-select v-model="gradeClassId" placeholder="请选择班级" style="width: 100%;" @change="changeCourse">
                <el-option v-for="item in gradeClassOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="courseId" placeholder="请选择科目" style="width: 100%;" @change="changeCourse">
                <el-option v-for="item in courseOptions" :key="item.id" :label="item.course_name" :value="item.id" />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->

      </div>
    </template>
    <!--头部 end-->
    <!--echarts start-->
    <ScoreCensusPie :seriesData="seriesData" :legendData="legendData" height="400px" width="100%" id="pie" />
    <ScoreContrastCensusBar :categoryData="categoryData" :seriesData="seriesDataCol" :legendData="legendDataCol"
      height="400px" width="100%" id="pieCol" />
    <!--echarts end-->
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 定义班级下拉选择项
import { gradeClassListApi } from "../../api/student";
import { getAllCourseListApi } from "../../api/teacher";
import ScoreCensusPie from './components/ScoreCensusPie.vue'
import ScoreContrastCensusBar from './components/ScoreContrastCensusBar.vue'
import { getScoreCensusApi } from "../../api/census";
import { computed } from '@vue/reactivity';
// 定义班级ID
const gradeClassId = ref()
const gradeClassOptions = ref([])
// 获取所有班级列表
async function gradeClassList() {
  try {
    const { data } = await gradeClassListApi()
    if (data.status === 200) {
      gradeClassOptions.value = data.result
    }
  } catch (e) {
    console.log(e)
  }
}
// 定义科目ID
const courseId = ref()
// 定义课程下拉选择项
const courseOptions = ref([])
// 获取所有课程列表
async function getAllCourseList() {
  try {
    const { data } = await getAllCourseListApi()
    if (data.status === 200) {
      courseOptions.value = data.result
    }
  } catch (e) {
    console.log(e)
  }
}
const categoryData = computed(() => {
  let obj = gradeClassOptions.value.find(item => item.id == gradeClassId.value)
  obj = obj || {}
  return [obj.name || '未选择班级和科目']
})
const legendData = ref(["优", "良", "一般", "较差", "不及格"])
const legendDataCol = ref(['总人数', '总成绩', '平均成绩', '最高成绩', '最低成绩'])
const seriesData = ref([
  {
    name: '优', value: 0,
  }, {
    name: '良', value: 0,
  }, {
    name: '一般', value: 0,
  }, {
    name: '较差', value: 0,
  }, {
    name: '不及格', value: 0
  }
])
const seriesDataCol = ref([
  {
    name: '总人数',
    type: 'bar',
    data: [0]
  },
  {
    name: '总成绩',
    type: 'bar',
    data: [0]
  },
  {
    name: '平均成绩',
    type: 'bar',
    data: [0]
  },
  {
    name: '最高成绩',
    type: 'bar',
    data: [0]
  },
  {
    name: '最低成绩',
    type: 'bar',
    data: [0]
  }
])
// 统计班级科目成绩
const getScoreCensus = async () => {
  const { data } = await getScoreCensusApi({ courseId: courseId.value, gradeClassId: gradeClassId.value })
  if (data.status === 200) {
    let arr = [
      {
        name: '优', value: 0,
      }, {
        name: '良', value: 0,
      }, {
        name: '一般', value: 0,
      }, {
        name: '较差', value: 0,
      }, {
        name: '不及格', value: 0
      }
    ]
    data.result.forEach(item => {
      let { score } = item
      if (score < 60) {
        arr[0].value += 1
      } else if (score >= 60 && score < 70) {
        arr[1].value += 1
      } else if (score >= 70 && score < 80) {
        arr[2].value += 1
      } else if (score >= 80 && score < 90) {
        arr[2].value += 1
      } else if (score >= 90 && score < 100) {
        arr[4].value += 1
      }
    })
    seriesData.value = arr
    let colArr = [
      {
        name: '总人数',
        type: 'bar',
        data: [0]
      },
      {
        name: '总成绩',
        type: 'bar',
        data: [0]
      },
      {
        name: '平均成绩',
        type: 'bar',
        data: [0]
      },
      {
        name: '最高成绩',
        type: 'bar',
        data: [0]
      },
      {
        name: '最低成绩',
        type: 'bar',
        data: [0]
      }
    ]
    if (data.result.length > 0) {
      let scoreArr = data.result.map(item => +item.score)
      let max = Math.max(...scoreArr)
      let min = Math.min(...scoreArr)
      let totle = scoreArr.reduce((total, item) => {
        return total += item
      }, 0)
      colArr[0].data[0] = scoreArr.length
      colArr[1].data[0] = +totle
      colArr[2].data[0] = Math.round(totle / scoreArr.length)
      colArr[3].data[0] = +max
      colArr[4].data[0] = +min
      seriesDataCol.value = colArr
    }
  }
}

const changeCourse = async () => {
  if (gradeClassId.value !== null && gradeClassId.value !== "" && courseId.value !== null && courseId.value !== "") {
    await getScoreCensus()
  }
}

//挂载后加载数据
onMounted(() => {
  getAllCourseList()
  gradeClassList()
})

</script>

<style scoped>
.card-header {
  display: flex;
  /* 弹性布局 */
  justify-content: space-between;
  /*内容对齐方式 */
  align-items: center;
  /*设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式*/
}

.card-header h3 {
  display: inline-flex;
  /*行内块元素*/
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgb(238 238 238);
  color: #178557;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-card {
  border-radius: 0px;
  border: none;
}
</style>
