<template>
  <el-container :class="{hideSidebar:!sidebar.opened}" style="height:100%;">
    <el-header style="height: 50px;">
      <v-header></v-header>
    </el-header>
    <el-container style="height:calc(100% - 50px)">
      <sidebar class="sidebar-container"/>
      <el-container>
        <el-header class="main-header">
          <sticky :zIndex="zIndex">
            <tags-view></tags-view>
          </sticky>
        </el-header>
        <el-main>
          <div class="main-warpper">
            <app-main></app-main>
          </div>
          <el-footer class="footer-box">
            浙江钱兔网络科技有限公司 © 2018
          </el-footer>
        </el-main>
      </el-container>
    </el-container>
  </el-container>

  <!--  <div class="main-container">
     <v-header></v-header>
     <sidebar class="sidebar-container"></sidebar>
     <el-main>
       <sticky :zIndex="zIndex">
         <tags-view></tags-view>
       </sticky>
       <app-main></app-main>
     </el-main>
     <el-footer class="footer-box">浙江钱兔网络科技有限公司 © 2018</el-footer>
   </div> -->
</template>

<script>
  import {Navbar, Sidebar, AppMain, TagsView, VHeader} from './components'
  import Sticky from '@/components/Sticky'

  export default {
    name: 'layout',
    data() {
      return {
        zIndex: 100
      }
    },
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView,
      VHeader,
      Sticky
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

 .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 50px;
  }

  // .el-header {
  //   &.main-header {
  //     line-height: 1.5;
  //   }
  // }
  .main-header{
    padding: 11px !important;
    height: 69px !important;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }

  .el-main {
    min-height: calc(100% - 69px);
    height: 100%;
    // background-color: #E9EEF3;
    color: #333;
    @include scrollBar;
    text-align: center;
  }
  .main-warpper{
    padding: 0 11px 11px;
    min-height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  // .app-container {
  //   min-height: calc(100% - 50px);
  //   // flex: 1;
  // }

  // .el-container:nth-child(5) .el-aside,
  // .el-container:nth-child(6) .el-aside {
  //   line-height: 260px;
  // }

  // .el-container:nth-child(7) .el-aside {
  //   line-height: 320px;
  // }
  // .app-wrapper {
  //   @include clearfix;
  //   position: relative;
  //   width: 100%;
  //   /*height: calc(100%);*/
  // }
  .app-wrapper {
    @include clearfix;
    /*position: relative;*/
    width: 100%;
    /*height: calc(100%);*/
  }

  .footer-box {
    height: 50px !important;
    font-size: 13px;
    /*position: absolute;*/
    /*right: 0;*/
    /*left: 155px;*/
    /*bottom: 0;*/
    background-color: #f9f9f9;
  }
</style>
