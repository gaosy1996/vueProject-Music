<template>
  <div class="footer">
    <router-link to="/home/music" tag="span">音乐</router-link>
    <router-link to="/home/discovery" tag="span">发现</router-link>
    <router-link to="/home/my" tag="span">我的</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.footer {
  width: 100%;
  height: 44px;
  background: #eee;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  font-size: 14px;
}

.active {
  color: red;
}
</style>
