<template>
  <div v-if="!item.hidden&&item.children" class="menu-wrapper">

    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :background-color="theme.color" :index="resolvePath(onlyOneChild.path)"
                      :class="{'submenu-title-noDropdown':!isNest}" :style="getStyles(onlyOneChild)">

          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                    :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>

        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="submenu" :index="resolvePath(item.path)">
      <template slot="title">
        <div :style="getStyles(item, true)">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </div>
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"/>

        <app-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :background-color="theme.color" :index="resolvePath(child.path)" :style="getStyles(child, true)">
            <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
            <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
  import path from 'path'
  import {isExternal} from '@/utils'
  import AppLink from './Link'
  import {mapGetters} from 'vuex'

  export default {
    name: 'SidebarItem',
    components: {AppLink},
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        onlyOneChild: null
      }
    },
    computed: {
      ...mapGetters([
        'theme'
      ])
    },
    methods: {
      getStyles(item, isTitle) {
        let path = this.resolvePath(item.path);
        let arr = path.split('/').length;
        if (isTitle === true && item.children && item.children.length > 0) {
          return {'margin-left': - 10 + 'px'}
        }
        if (arr > 2) {
          return {'padding-left': 10　* arr + 'px'}
        }
        return {'padding-left': 10　* (arr - 1) + 'px'}
      },
      hasOneShowingChild(children, parent) {
        const showingChildren = children.filter(item => {
          if (item.name === 'dashboard') {
            this.onlyOneChild = item
            return true
          }
        })
        if (showingChildren.length === 1) {
          return true
        }
        return false
      },
      resolvePath(routePath) {
        if (this.isExternalLink(routePath)) {
          return routePath
        }
        return path.resolve(this.basePath, routePath)
      },
      isExternalLink(routePath) {
        return isExternal(routePath)
      }
    }
  }
</script>
