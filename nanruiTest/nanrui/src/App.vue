<template>
  <div id="app">
    <!-- 省市区 -->
    <!-- <CascaderSelector /> -->
    <!-- 组织机构树 -->
    <!-- <OrgTree /> -->
    <!-- 购物车 -->
    <!-- <ShoppingCart /> -->
    <!-- 固定列差旅表格 -->
    <!-- <FixedTable /> -->
    <!-- 固定列差旅表格 -->
    <Inspection />
  </div>
</template>

<script>
// @ is an alias to /src
// import CascaderSelector from '@/components/CascaderSelector.vue'
// import OrgTree from '@/components/OrgTree.vue'
// import ShoppingCart from '@/components/ShoppingCart.vue'
// import FixedTable from '@/components/FixedTable.vue'
import Inspection from '@/components/Inspection.vue'

export default {
  name: 'HomeView',
  components: {
    // CascaderSelector,
    // OrgTree,
    // ShoppingCart,
    // FixedTable,
    Inspection
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
