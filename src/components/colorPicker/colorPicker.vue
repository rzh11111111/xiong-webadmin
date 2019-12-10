<template>
  <ul class="colorPicker-list">
    <li v-for="(item, index) in predefineColors" :key="item" :style="{'background-color': item}" @click="() => {changeColor(item, index)}">
      <span>点击换肤</span>
    </li>
  </ul>
</template>

<script>
  import store from '../../store'
  import bus from '@/utils/bus'

  const version = require("element-ui/package.json").version; // 版本号
  const ORIGINAL_THEME = "#409EFF";

  export default {
    name: "colorPicker",
    data() {
      return {
        // visible: false,
        chalk: "",
        oldTheme: "#409EFF",
        theme: ORIGINAL_THEME,
        predefineColors: [
          "#1abc9c",
          "#3498db",
          "#ed6e4d",
          "#fabb3d",
          "#aa7ab3",
          "#9ad0b9",
          "#ea94be",
          "#c1374a"
        ]
      };
    },
    mounted() {
      // this.$nextTick(() => {
      //   if (localStorage.getItem('colorPicker')) {
      //     this.changeColor(localStorage.getItem('colorPicker'));
      //     return ;
      //   }
      //   this.changeColor(this.theme);
      // });
    },
    watch: {
      theme(val, oldVal) {
        if (typeof val !== "string") return;
        localStorage.setItem('colorPicker', val)
        const themeCluster = this.getThemeCluster(val.replace("#", ""));
        const originalCluster = this.getThemeCluster(oldVal.replace("#", ""));
        const getHandler = (variable, id) => {
          return () => {
            const originalCluster = this.getThemeCluster(
              ORIGINAL_THEME.replace("#", "")
            );
            const newStyle = this.updateStyle(
              this[variable],
              originalCluster,
              themeCluster
            );

            let styleTag = document.getElementById(id);
            if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.setAttribute("id", id);
              document.head.appendChild(styleTag);
            }
            styleTag.innerText = newStyle;
          };
        };

        const chalkHandler = getHandler("chalk", "chalk-style");
        if (!this.chalk) {
          const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
          this.getCSSString(url, chalkHandler, "chalk");
        } else {
          chalkHandler();
        }

        const styles = [].slice
          .call(document.querySelectorAll("style"))
          .filter(style => {
            const text = style.innerText;
            return (
              new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
            );
          });
        styles.forEach(style => {
          const {innerText} = style;
          if (typeof innerText !== "string") return;
          style.innerText = this.updateStyle(
            innerText,
            originalCluster,
            themeCluster
          );
        });

      }
    },

    methods: {
      changeColor(color, index) {
        this.oldTheme = this.oldTheme || this.theme;
        store.dispatch('getTheme', {color});
        this.theme = color;
      },
      CheckIsColor(bgVal) {
        var type = "^#[0-9a-fA-F]{6}$";
        var re = new RegExp(type);
        if (bgVal.match(re) == null) {
          type = "^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$";
          re = new RegExp(type);
          if (bgVal.match(re) == null) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      updateStyle(style, oldCluster, newCluster) {
        let newStyle = style;
        oldCluster.forEach((color, index) => {
          newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
        });
        return newStyle;
      },

      getCSSString(url, callback, variable) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "");
            callback();
          }
        };
        xhr.open("GET", url);
        xhr.send();
      },

      getThemeCluster(theme) {
        const tintColor = (color, tint) => {
          let red = parseInt(color.slice(0, 2), 16);
          let green = parseInt(color.slice(2, 4), 16);
          let blue = parseInt(color.slice(4, 6), 16);

          if (tint === 0) {
            // when primary color is in its rgb space
            return [red, green, blue].join(",");
          } else {
            red += Math.round(tint * (255 - red));
            green += Math.round(tint * (255 - green));
            blue += Math.round(tint * (255 - blue));

            red = red.toString(16);
            green = green.toString(16);
            blue = blue.toString(16);

            return `#${red}${green}${blue}`;
          }
        };

        const shadeColor = (color, shade) => {
          let red = parseInt(color.slice(0, 2), 16);
          let green = parseInt(color.slice(2, 4), 16);
          let blue = parseInt(color.slice(4, 6), 16);

          red = Math.round((1 - shade) * red);
          green = Math.round((1 - shade) * green);
          blue = Math.round((1 - shade) * blue);

          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);

          return `#${red}${green}${blue}`;
        };

        const clusters = [theme];
        for (let i = 0; i <= 9; i++) {
          clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
        }
        clusters.push(shadeColor(theme, 0.1));
        return clusters;
      }
    },
    mounted() {
      bus.$on('changeTheme', this.changeColor);
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../styles/variables.scss";
.colorPicker-list{
  width: 420px;
  list-style-type: none;
  margin: 0;
  padding-inline-start: 0;
  background-color: #fff;
  li{
    float: left;
    width: 90px;
    height: 90px;
    margin: 5px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: 90px;
    cursor: pointer;
    background-color: #1abc9c;
    span{
      display: none;
    }
    &:hover{
      span{
        display: inline;
      }
    }
  }
}
</style>
