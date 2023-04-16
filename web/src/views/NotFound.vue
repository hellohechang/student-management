<template>
  <div class="notFound">
    <a href="/">
      <img src="../../src/assets/404_images/404_bg.png" alt="">
    </a>
  </div>
</template>

<style lang="less" scoped>
.notFound {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    width: 90%;
    max-width: 900px;
    margin: auto;
  }

  a img {
    width: 100%;
    height: 100%;
  }
}
</style>