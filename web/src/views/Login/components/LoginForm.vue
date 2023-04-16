<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item prop="username">
      <el-input placeholder="请输入用户名" v-model="ruleForm.username">
        <template #prefix>
          <el-icon>
            <UserFilled />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input placeholder="请输入密码" v-model="ruleForm.password" :type="passwordType">
        <template #prefix>
          <el-icon>
            <GoodsFilled />
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="success" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup>
import md5 from 'md5'
import { ref, reactive } from 'vue'
import { ElNotification } from "element-plus";
import { useRouter } from 'vue-router'
import { loginApi } from '../../../api/login'
import { useUserStore } from '../../../store/modules/user'
const router = useRouter()
const ruleFormRef = ref()
const passwordType = ref('password')
const loading = ref(false)
const rules = reactive({
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
})
// 表单数据
const ruleForm = reactive({
  username: 'admin',
  password: '123456',
})
// 显示密码图标
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
}

const userStore = useUserStore()
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      let { username,
        password } = ruleForm
      password = md5(password)
      // 登录
      const { data } = await loginApi({ username, password });
      if (data.status === 200) {
        // 设置token
        userStore.setToken(data.result.token)
        userStore.setUserInfo({
          username: data.result.username,
          realname: data.result.realname,
          email: data.result.email,
          sex: data.result.sex,
          userIcon: data.result.userIcon,
          createTime: +data.result.create_time,
          role: data.result.role
        })
        await router.push({
          path: '/index',
        })
        ElNotification({
          title: '登录成功',
          message: "欢迎登录 学生信息管理系统",
          type: "success",
          duration: 3000
        })
      } else {
        loading.value = false
      }
    } else {
      loading.value = false
      return false
    }
  })
}
</script>

<style lang="less" scoped>
.login-btn {
  margin-top: 20px;
  width: 100%;
  height: 47px
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
</style>
