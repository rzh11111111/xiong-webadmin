<template>
  <el-aside class="sidebar-container">
    <el-menu
      :show-timeout="200"
      class="el-menu-demo"
      mode="vertical"
      ref="navbar"
      :default-active="routePath"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="theme.color"
      @select="selectMenu"
      @open="openMenu"
      @close="closeMenu"
      unique-opened>
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
      <!--<sidebar-item :collapse="isCollapse" :routes="permission_routers"></sidebar-item>-->
    </el-menu>
    <!-- </scroll-bar>  -->
  </el-aside>
</template>

<script>
  import {mapGetters} from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    data(){
      return {
        routePath:this.$route.path
      }
    },
    components: {SidebarItem, ScrollBar},
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar',
        'theme'
      ]),
      routes() {
        return this.$router.options.routes
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          this.routePath = val.path;
        },
        // 深度观察监听
        deep: true
      }
    },
    methods: {
      // eslint-disable-next-line
      selectMenu(index, indexPath) {
        /**
         * 在选择父级菜单时自动关闭其下所有子菜单
         * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
         * 关闭位于当前打开菜单中该索引值之后的全部菜单
         */
          // 获取当前打开的所有菜单
        let openMenu = this.$refs.navbar.openedMenus.concat([])
        // 获取点击菜单的父级index，如果当前点击的是根节点，则直接关闭所有打开菜单
        let nowMenuPath = indexPath.length > 1 ? indexPath[indexPath.length - 2] : ""
        if (nowMenuPath) {
          // 获取父级index在数组中索引，关闭其后所有的菜单
          let menuIndex = openMenu.indexOf(nowMenuPath)
          openMenu = openMenu.slice(menuIndex + 1)
        }
        // 关闭菜单
        openMenu = openMenu.reverse()
        openMenu.forEach((ele) => {
          this.$refs.navbar.closeMenu(ele)
        })
      },
      openMenu() {
        if (this.navMode == 'horizontal') {
          this.navBgShow = true
        }
      },
      closeMenu() {
        if (this.navMode == 'horizontal') {
          this.navBgShow = false
        }
      },
    }
  }
</script>
