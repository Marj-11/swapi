<template>
  <div id="app">

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
 
  }
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)),
    url("./assets/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
