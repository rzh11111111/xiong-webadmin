<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb style="float: left" :image="touxiang">
        <span>你的角色:</span>
        <span class="pan-info-roles">{{roles}}</span>
      </pan-thumb>
      <div class="info-container">
        <span class="display_name">{{username}}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">欢迎你 : {{name}}</span>
      </div>
    </div>
    <div>
      <img class="emptyGif" :src="emptyGif">
    </div>
    <!--<el-upload-->
      <!--class="avatar-uploader"-->
      <!--:http-request="httpRequest"-->
      <!--:action="actionUrl"-->
      <!--name='bankimg'-->
      <!--:show-file-list="false">-->
      <!--<img v-if="ruleForm.bankimg" :src="ruleForm.bankimg" class="avatar">-->
      <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
    <!--</el-upload>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'dashboard-editor',
  components: { PanThumb },
  data() {
    return {
      touxiang: require('../../../assets/images/touxiang.png'),
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      // emptyGif: require('../../../assets/images/home-banner')
      actionUrl: '',
      ruleForm: {
        bankimg: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'username'
    ])
  },
  methods: {
    httpRequest (options) {
      var that = this
      // 获取文件对象
      let file = options.file
      //判断图片类型
      if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/JPG') {
        var  isJPG =  true
      } else {
        isJPG =  false
      }
      // 判断图片大小
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传产品图片只能是 JPG/PNG/JPEG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传产品图片大小不能超过 2MB!')
      }
      // 创建一个HTML5的FileReader对象
      var reader = new FileReader();
      //创建一个img对象
      var  img = new Image();
      let filename = options.filename
      if (file) {
        reader.readAsDataURL(file)
      }
      if (isJPG && isLt2M) {
        reader.onload = (e) => {
          let base64Str = reader.result.split(',')[1]
          img.src = e.target.result
          // base64地址图片加载完毕后执行
          img.onload = function () {
            // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            var maxWidth = 300,
              maxHeight = 300;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过最大尺寸的限制
            if(originWidth > maxWidth || originHeight > maxHeight) {
              if(originWidth / originHeight > maxWidth / maxHeight) {
                // 更改宽度，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }
            //对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
            //压缩后的base64文件
            var newUrl = canvas.toDataURL('image/jpeg', 0.5);
            let para = {
              fileCategoryCode: 'FILE19011273541704',
              baseSixFourName: newUrl,
              oldFileName:options.file.name
            }
            that.Api.baseUploadResource(para).then(res => {

              console.log('aaa', res)
            })
          }
        }
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #e3e3e3;
  padding: 50px 60px 0px;

  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
    padding-top: 5px;
  }

  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;

    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
