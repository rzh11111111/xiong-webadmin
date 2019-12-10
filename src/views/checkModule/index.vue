<template>
  <div>
    <template v-if="type == 1">
      <goods ref="goods" :key="dialog.tableType +'goods'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></goods>
      <el-button @click="selectGoods" style="width: 104px;" :disabled="disabled">选择商品</el-button>
    </template>
    <template v-else-if="type == 2">
      <shop ref="shop" :key="dialog.tableType +'shop'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></shop>
      <el-button @click="selectShop" :disabled="disabled">选择线上店铺</el-button>
    </template>
    <template v-else-if="type == 3">
      <store ref="store" :key="dialog.tableType +'store'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></store>
      <el-button @click="selectStore" :disabled="disabled">选择线下店铺</el-button>
    </template>
    <template v-else-if="type == 4">
      <brand ref="brand" :key="dialog.tableType +'brand'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></brand>
      <el-button @click="selectBrand" :disabled="disabled">选择品牌</el-button>
      <template v-if="dialog.tableType === 'selection'">
        <el-tag v-for="(b, inx) in dialog.brand" closable :key="b.id" v-if="!!b && !!b.id" @close.stop="handleClose(b, inx)" style="margin-right: 5px;">{{b.names}}</el-tag>
      </template>
      <template v-else>
        <el-tag closable @close="handleClose" v-if="!!dialog.brand.id">{{dialog.brand.names}}</el-tag>
      </template>
    </template>
    <template v-else-if="type == 6">
      <activity ref="activity" :key="dialog.tableType +'activity'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></activity>
      <el-button @click="selectActivity" :disabled="disabled">选择活动</el-button>
      <template v-if="dialog.tableType === 'selection'">
        <el-tag v-for="(b, inx) in dialog.activity" :closable="!disabled" :key="b.id" v-if="!!b && !!b.id" @close.stop="handleClose(b, inx)" style="margin-right: 5px;">{{b.name}}</el-tag>
      </template>
      <template v-else>
        <el-tag :closable="!disabled" @close="handleClose" v-if="!!dialog.activity.id">{{dialog.activity.name}}</el-tag>
      </template>
    </template>
    <template v-else-if="type == 7">
      <goods-group ref="goodsGroup" :key="dialog.tableType +'goodsGroup'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></goods-group>
      <el-button @click="selectGoodsGroup" style="width: 104px;" :disabled="disabled">选择商品分组</el-button>
    </template>
    <template v-else-if="type == 8">
      <system-message ref="systemMessage" :key="dialog.tableType +'systemMessage'" :dialog="subDialog" :tableType="dialog.tableType" @submit="handleSelect"></system-message>
      <el-button @click="selectSystemMessage" style="width: 104px;" :disabled="disabled">选择系统消息</el-button>
      <template v-if="dialog.tableType === 'selection'">
        <el-tag v-for="(b, inx) in dialog.systemMessage" :closable="!disabled" :key="b.id" v-if="!!b && !!b.id" @close.stop="handleClose(b, inx)" style="margin-right: 5px;">{{b.title}}</el-tag>
      </template>
      <template v-else>
        <el-tag :closable="!disabled" @close="handleClose" v-if="!!dialog.systemMessage.id">{{dialog.systemMessage.title}}</el-tag>
      </template>
    </template>
    <el-input v-model="subDialog.names" :disabled="true" style="width: calc(100% - 121px);" v-if="type == 1 || type == 2 || type == 3 || type == 7"></el-input>
  </div>
</template>
<script>
  import goods from './goods';
  import shop from './shop';
  import store from './store';
  import brand from './brand';
  import activity from './activity';
  import goodsGroup from './goodsGroup';
  import systemMessage from './systemMessage';

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {
              files: null,
              store: null,
              shop: null,
              goods: null,
              activity: null,
              goodsGroup: null
          };
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        types: ['goods', 'shop', 'store', 'brand', '', 'activity', 'goodsGroup', 'systemMessage'],
        subDialog: {
          innerVisible: false,
          addBool: true,
          names: '',
          ruleForm2: {}
        },
        selectedData: {},
        type: '',
        dialogType: ''
      }
    },
    components: {
      shop,
      goods,
      store,
      brand,
      activity,
      goodsGroup,
      systemMessage
    },
    watch: {
      'dialog.type': function (val) {
        this.type = val;
        this.changeType(val);
      },
      'dialog.goods'(data) {
        this.changeType(this.dialog.type);
      },
      'dialog.shop'(data) {
        this.changeType(this.dialog.type);
      },
      'dialog.store'(data) {
        this.changeType(this.dialog.type);
      },
      'dialog.brand'(data) {
        this.changeType(this.dialog.type);
      },
      'dialog.activity'(data) {
        this.changeType(this.dialog.type);
      },
      'dialog.goodsGroup'(data) {
        this.changeType(this.dialog.type);
      },
      'dialog.systemMessage'(data) {
        this.changeType(this.dialog.type);
      }
    },
    methods: {
      changeType(type) {
        let nameVal = '';
        if (!this.dialog.nameVal) {
          nameVal = 'name';
        } else {
          nameVal = this.dialog.nameVal instanceof Array ? this.dialog.nameVal[type - 1] : this.dialog.nameVal;
        }
        let current = this.dialog[this.types[type - 1]];
        let t = [this.types[type - 1]] + 'Type';
        this.subDialog[t] = this.dialog[t];

        if (type === 5) {
          this.subDialog.fileCategoryCode = this.dialog.fileCategoryCode;
        }
        if (this.dialog.tableType === 'selection') {
          if (!current) {
            current = [];
          } else if(!(current instanceof Array)) {
            current = [current];
          }
          this.subDialog.ruleForm2 = Object.assign([], current);
          let names = current.map(item => {
            return item[nameVal];
          });
          this.subDialog.names = names.join(',');
          return ;
        }
        this.subDialog.ruleForm2 = Object.assign({}, current);
        this.subDialog.names = current ? current[nameVal] : '';
      },
      selectGoods() {
        this.subDialog.titleText = '选择商品';
        this.dialogType = 1;
        this.subDialog.innerVisible = true;
        this.changeType(1);
      },
      selectShop() {
        this.subDialog.titleText = '选择线上店铺';
        this.dialogType = 2;
        this.subDialog.innerVisible = true;
        this.changeType(2);
      },
      selectStore() {
        this.subDialog.titleText = '选择线下店铺';
        this.dialogType = 3;
        this.subDialog.innerVisible = true;
        this.changeType(3);
      },
      selectBrand() {
        this.subDialog.titleText = '选择品牌';
        this.dialogType = 4;
        this.subDialog.innerVisible = true;
        this.changeType(4);
      },
      selectActivity() {
        this.subDialog.titleText = '选择活动';
        this.dialogType = 6;
        this.subDialog.innerVisible = true;
        this.changeType(6);
      },
      selectGoodsGroup() {
        this.subDialog.titleText = '选择商品分组';
        this.dialogType = 7;
        this.subDialog.innerVisible = true;
        this.changeType(7);
      },
      selectSystemMessage() {
        this.subDialog.titleText = '选择系统消息';
        this.dialogType = 8;
        this.subDialog.innerVisible = true;
        this.changeType(8);
      },
      handleSelect(row, type) {
        let selectedData = null;
        let nameVal = '';
        if (!this.dialog.nameVal) {
          nameVal = 'name';
        } else {
          nameVal = this.dialog.nameVal instanceof Array ? this.dialog.nameVal[type - 1] : this.dialog.nameVal;
        }
        let names = '';
        if (row instanceof Array) {
          this.dialog[this.types[type - 1]] = Object.assign([], this.dialog[this.types[type - 1]], row);
          let namesArr = [];
          selectedData = row.map(item => {
            namesArr.push(item[nameVal]);
            return Object.assign({names: item[nameVal]}, item);
          });
          names = namesArr.join(',');
        } else {
          this.dialog[this.types[type - 1]] = Object.assign({}, this.dialog[this.types[type - 1]], row);
          names = row[nameVal];
          selectedData = Object.assign({}, row);
        }
        this.subDialog.ruleForm2 = selectedData;
        this.subDialog.names = names;
        this.dialog[this.types[type - 1]] = selectedData;
        this.$emit("submit", selectedData, type);
      },
      handleClose(params, inx) {
        if (this.dialog.tableType === 'selection') {
          let para = [];
          this.subDialog.ruleForm2.forEach(item => {
            if (item.id !== params.id) {
              para.push(item);
            }
          });
          this.subDialog.ruleForm2 = Object.assign([], para);
          this.dialog[this.types[this.type - 1]] = Object.assign([], para);
        } else {
          this.subDialog.ruleForm2 = {};
          this.dialog[this.types[this.type - 1]] = {};
        }
      },
      clearSelect() {
        this.subDialog.ruleForm2 = null;
        let n = this.types[this.dialog.type - 1];
        if (n && this.$refs[n]) {
          this.$refs[n].clearSelect();
        }
        // this.dialog.type = 1;
        // this.type = 1;
        this.dialog.employee = {};
        this.dialog.promoter = {};
        this.dialog.partner = {};
        this.dialog.province = {};
        this.changeType(this.type);
      }
    },
    mounted() {
      this.type = this.dialog.type;
      this.changeType(this.type);
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .files-tag{
    &.el-tag--small{
      position: relative;
      width: 66px;
      height: 74px !important;
      overflow: hidden;
      text-align: center;
      margin-right: 5px;
      padding:0;
      text-overflow: ellipsis;
    a{
      position:relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .files-tag-img{
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .files-tag-icon{
      position: relative;
      line-height: 55px;
      width: 100%;
      height: 100%;
    }
    .files-tag-title{
      background: rgba(0,0,0,0.5);
      display: block;
      width: 100%;
      font-size: 12px;
      position: absolute;
      height: 20px !important;
      color: #fff;
      bottom: 0;
      left: 0;
      padding: 0 2px;
    }
    img{
      display: block;
      max-width: 100%;
      max-height: 100%;
      margin: 0 auto;
    }
    .el-icon-document{
      display: block;
      font-size: 40px;
      line-height: 50px;
      height: 50px;
    }
  }
  }


</style>
