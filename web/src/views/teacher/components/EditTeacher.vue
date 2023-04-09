<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formTeacher" label-width="80px">
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-form-item prop="courseId" label="教授科目">
          <el-select v-model="formTeacher.courseId" placeholder="请选择科目" style="width: 100%;">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.course_name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="教师工号" prop="teach_no">
          <el-input v-model="formTeacher.teach_no" placeholder="请输入教师工号" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="formTeacher.name" placeholder="请输入教师姓名" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="性别" prop="sex">
          <el-input v-model="formTeacher.sex" placeholder="请输入性别" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formTeacher.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="formTeacher.qq" placeholder="请输入QQ号" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="备注">
          <el-input v-model="formTeacher.remarks" :rows="2" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button color="#178557" :loading="subLoading" type="success" @click="editTeacher(ruleFormRef)">保存</el-button>
  </div>
</template>


<script setup>
import { ref, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { editTeacherApi, getAllCourseListApi } from "../../../api/teacher"
import { deepClone } from '../../../utils/common';
const ruleFormRef = ref()
const subLoading = ref(false)
const data = reactive({
  formTeacher: {
    id: 0,
    name: '',
    teach_no: '',
    sex: '',
    phone: '',
    courseId: '',
    qq: '',
    remarks: ''
  }
})
const { formTeacher } = toRefs(data)
// 定义表单约束规则对象
const rules = reactive({
  name: [{ required: true, message: '教师姓名不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  qq: [{ required: true, message: 'qq号不能为空', trigger: 'blur' }],
  courseId: [{ required: true, message: '教授科目不能为空', trigger: 'change' }],
  teach_no: [{ required: true, message: '教师工号不能为空', trigger: 'blur' }],
})
const props = defineProps(['teacherInfo'])
const teacherInfo = ref(props.teacherInfo)
// 给表单填充数据
formTeacher.value = deepClone(teacherInfo.value)
// 编辑教师信息
const editTeacher = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } = await editTeacherApi(formTeacher.value)
      if (data.status === 200) {
        ElMessage.success(data.message)
        emit('success')
      } else {
        ElMessage.error(data.message)
      }
    } else {
      ElMessage.error('提交失败，你还有未填写的项！')
      console.log('error submit!', fields)
    }
    subLoading.value = false
  })
}
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
getAllCourseList()
const emit = defineEmits(['closeEditTeacherForm', 'success'])
// 取消表单
const close = () => {
  emit('closeEditTeacherForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
