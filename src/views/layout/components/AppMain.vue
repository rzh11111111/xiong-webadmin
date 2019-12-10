<template>
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
</template>

<script>
  import bus from '@/utils/bus'
  import {mapGetters} from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapGetters([
      'theme'
    ]),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  updated() {
    // this.$nextTick(() => {
    //   bus.$emit('changeTheme', this.theme.color);
    //   let arr = document.getElementsByClassName('.el-dropdown-link');
    //   for (let i = 0; i < arr.length; i++) {
    //     arr[i].style.color = this.theme.color;
    //   }
    // })
  },
  mounted() {
    // this.$nextTick(() => {
    //   bus.$emit('changeTheme', this.theme.color);
    // })
  }
}
</script>
