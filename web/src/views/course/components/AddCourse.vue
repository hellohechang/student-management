<template>
  <el-form ref="ruleFormRef" :rules="rules"  :model="formCourse"  label-width="80px">
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-form-item label="课程编号" prop="course_no">
          <el-input v-model="formCourse.course_no" placeholder="请输入课程编号" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="课程名称" prop="course_name">
          <el-input v-model="formCourse.course_name" placeholder="请输入课程名称" />
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="备注">
          <el-input
              v-model="formCourse.remarks"
              :rows="2"
              type="textarea"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button color="#178557" :loading="subLoading" type="success" @click="addCourse(ruleFormRef)">保存</el-button>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {addCourseApi} from "../../../api/course";
const ruleFormRef = ref()
const subLoading = ref(false)
const emit = defineEmits(['closeAddCourseForm','success'])
const formCourse = reactive({
  course_no: '',
  course_name: '',
  remarks: ''
})
// 定义表单约束规则对象
const rules = reactive({
  course_no: [{ required: true, message: '课程编号不能为空', trigger: 'blur' }],
  course_name: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }]
})

// 新增课程信息
const addCourse = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } =  await addCourseApi(formCourse)
      if(data.status===200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    } else {
      ElMessage.error('提交失败，你还有未填写的项！')
      console.log('error submit!', fields)
    }
    subLoading.value = false
  })
}
// 取消表单
const close = ()=> {
  emit('closeAddCourseForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
