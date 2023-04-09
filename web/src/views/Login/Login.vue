<template>
  <div class="login-container">
    <div class="login-box">
      <!--左背景图 -->
      <div class="login-left">
        <img src="../../assets/login/side-logo.png">
      </div>
      <!--登录表单-->
      <div class="login-form">
        <!--标题和logo-->
        <div class="login-title">
          <img class="icon" src="../../assets/logo2.png">
          <h2 class="title">学生管理系统</h2>
        </div>
        <!--登录表单组件-->
        <LoginForm />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import LoginForm from './components/LoginForm.vue'
</script>
  
<style lang="less" scoped>
.login-container {
  background-color: #f0f2f5;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  background-image: url("../../assets/login/login_bg.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  padding: 25px 25px;
  box-sizing: border-box;

  .login-box {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fffc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-left {
      width: 40%;

      img {
        width: 100%;
        max-width: 900px;
      }
    }

    .login-form {
      max-width: 480px;
      width: 60%;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      box-sizing: border-box;

      .login-title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;

        .title {
          margin: 0;
          font-size: 30px;
          white-space: nowrap;
        }

        .icon {
          width: 60px;
        }
      }
    }

    @media (max-width: 800px) {
      .login-left {
        display: none;
      }

      .login-form {
        width: 90%;
      }
    }
  }
}



// 给子组件设置样式
::v-deep(.el-input__wrapper) {
  padding: 8px 10px;
}
</style>
  