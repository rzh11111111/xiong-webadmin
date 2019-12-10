<template>
   <div class="app-container">
      <div class="filter-container wrapper-box">

        <el-button class="go-back" size="mini" @click="goBack">返回</el-button>
        <h2>添加生产企业</h2>
        <el-steps :active="active" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="账号信息"></el-step>
          <el-step title="对接人"></el-step>
          <el-step title="合同"></el-step>
        </el-steps>
        <div class="mfrs-form-box">
          <el-form :model="shopInfo" label-width="200px" :rules="rules" v-show="active === 0">
            <el-form-item label="类别：" required>
              <el-radio-group v-model="shopInfo.companyType">
                <el-radio :label="1">企业</el-radio>
                <el-radio :label="2">代理商</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="营业执照号：" prop="bcCode">
              <el-input v-model="shopInfo.bcCode"></el-input>
            </el-form-item>
            <el-form-item label="营业执照名称：" prop="name">
              <el-input v-model="shopInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="经营类型：" required>
              <el-radio-group v-model="shopInfo.bcRegisterType">
                <el-radio :label="1">个体商户</el-radio>
                <el-radio :label="2">企业</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="营业期限：" required>
              <el-form-item prop="bcStartTime">
                <el-date-picker
                  v-model="shopInfo.bcStartTime"
                  type="date"
                  value-format="yyyy/MM/dd"
                  placeholder="开始日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="bcEndtime">
                <el-date-picker
                  v-model="shopInfo.bcEndtime"
                  type="date"
                  value-format="yyyy/MM/dd"
                  placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="shopInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="营业执照：" prop="bcPicUrl">
              <selector key="img" :dialog="subDialogImg" @submit="handleSelectImg"></selector>
            </el-form-item>
            <el-form-item label="其他证件（选填）：">
              <selector key="imgs" :dialog="subDialogImgs" @submit="handleSelectImgs"></selector>
            </el-form-item>
          </el-form>
          <el-form :model="source" label-width="200px" :rules="rules2" v-show="active === 1">
            <el-form-item label="店铺名称：" prop="nickName">
              <el-input v-model="source.nickName" placeholder="省钱熊平台上展示的店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="登录账号：" prop="userName">
              <el-input v-model="source.userName" placeholder="字母+数字，长度至少6位"></el-input>
            </el-form-item>
            <el-form-item label="绑定手机：" prop="phone">
              <el-input v-model="source.phone"></el-input>
              <p class="tips-box">企业账号密码会发送至此手机</p>
            </el-form-item>
            <el-form-item label="经营品牌：" required>
              <check-module key="brand" :dialog="subDialog" @submit="handleSelect"></check-module>
            </el-form-item>
            <el-form-item label="店铺头像：" required>
              <selector key="avatar" :dialog="subDialogAvatar" @submit="handleSelectAvatar"></selector>
            </el-form-item>
            <el-form-item label="企业地址：" prop="area">
              <el-cascader
                 v-model="source.area"
                :options="treeDataList"
                @active-item-change="handleItemChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址：">
              <el-input v-model="shopInfo.address"></el-input>
            </el-form-item>
          </el-form>
          <div v-show="active === 2">
            <el-form label-width="100px" v-for="(m, inx) in shopCommunicationBookList" :key="m.role">
              <h4>{{m.role}}</h4>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：" :required="inx < 5">
                    <el-input v-model="m.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="微信：">
                    <el-input v-model="m.wechat"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手机号：" :required="inx < 5">
                    <el-input v-model="m.phone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="inx < 4">
                  <el-form-item label="邮箱：">
                    <el-input v-model="m.email"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-form :model="rateConfig" label-width="200px" :rules="rules4"  v-show="active === 3">
            <el-form-item label="合同类型：">
              <span>纸质合同</span>
            </el-form-item>
            <el-form-item label="平台服务费率（%）：" prop="storeRatePlatform">
              <el-input v-model="rateConfig.storeRatePlatform" required placeholder="平台服务费率(%)"></el-input>
            </el-form-item>
            <el-form-item label="结算方式：" prop="settleType">
              <el-radio-group v-model="source.settleType">
                <el-radio :label="1">确认收货后结算</el-radio>
                <el-radio :label="2">订单完成后结算</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <el-alert
          :title="errorTips"
          type="warning"
          close-text="知道了" v-if="!!errorTips" style="margin-top: 20px;">
        </el-alert>
        <el-form label-width="200px" style="margin-top: 50px;">
          <el-form-item label=" ">
            <el-button @click="prev" v-if="active !== 0">上一步</el-button>
            <el-button @click="next" v-if="active !== stepLength">下一步</el-button>
            <el-button @click="handleAdd" v-else>完成</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-dialog
          title="账号创建成功"
          :visible.sync="dialogVisible"
          width="750px"
          :before-close="handleClose">
            <el-form>
              <el-form-item label="账号名：">
                {{source.username}}
              </el-form-item>
              <el-form-item label="密码：">
                {{source.password}}
              </el-form-item>
            </el-form>
            <p>账号密码交付商家后，请提醒商家及时更新密码</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClose">确 定</el-button>
          </span>
        </el-dialog> -->
     </div>
   </div>
</template>

<script>
  import {format, parseQueryString, randomPassword, fixedNum} from "../../utils";
  import MultiUpload from '@/components/Upload/multiUpload';
  import selector from '@/components/Selector/filesEntry';
  import checkModule from '../checkModule';

  export default {
    data() {
      let validatorAccount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('登录账号不能为空'));
        }
        if (value.length < 6) {
          return callback(new Error('登录账号长度至少6位'));
        }
        if (!(/\d/g.test(value) && /[a-zA-Z]/g.test(value))) {
          return callback(new Error('登录账号为字母+数字的组合'));
        }
      }
      return {
        formWidth: '250px',
        active: 0,
        stepLength: 3,
        val: '',
        errorTips: '',
        address: [],
        treeDataList: [],
        // dialogVisible: false,
        brandList: [],
        logoUrl: {},
        source: {
          phone: '',
          userName: '',
          nickName: '',
          settleType: 1,
        },
        sourceVals: {
          logoUrl: '请选择店铺头像',
          brand: '请选择经营品牌',
          phone: '请输入要绑定的手机号',
          userName: '请输入登录账号',
          nickName: '请输入店铺名称'
        },
        rules: {
          bcCode: [
            { required: true, message: '营业执照号不能为空', trigger: 'blur' }
          ],
          name: [
            {required: true, message: '营业执照名称不能为空', trigger: 'blur' }
          ],
          bcStartTime: [
            { required: true, message: '请选择营业期限开始日期', trigger: 'blur' }
          ],
          bcEndtime: [
            { required: true, message: '请选择营业期限结束日期', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: this.$plug.valid.isPhones, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          bcPicUrl: [
            { required: true, message: '营业执照不能为空', trigger: 'blur' }
          ]
        },
        rules2: {
          userName: [
            { required: true, message: '登录账号不能为空', trigger: 'blur' },
            { validator: validatorAccount, trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '店铺名称不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: this.$plug.valid.isPhones, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          name: [
            {required: true, message: '营业执照名称不能为空', trigger: 'blur' }
          ]
        },
        rules4: {
          storeRatePlatform: [
            { required: true, message: '请输入平台服务费', trigger: 'blur' }
          ],
          settleType: [{
            required: true, message: '请选择结算方式', trigger: 'blur'
          }]
        },
        shopInfo: {
          phone: '',
          bcPicUrl: {},
          bcCode: '',
          bcRegisterType: 2,
          bcStartTime: null,
          bcEndtime: null,
          companyType: 1,
          name: ''
        },
        shopInfoVals: {
          phone: '请输入正确的手机号',
          bcPicUrl: '请选择营业执照',
          bcCode: '请输入营业执照号',
          bcStartTime: '请输入营业期限的开始时间',
          bcEndtime: '请输入营业期限的结束时间',
          name: '请输入营业执照名称'
        },
        brandIdList: [],
        rateConfig: {
          storeRatePlatform: ''
        },
        shopCommunicationBookList: [{
          role: '项目负责人',
          name: '',
          phone: '',
          wechat: '',
          email: ''
        }, {
          role: '省钱熊平台对接人',
          name: '',
          phone: '',
          wechat: '',
          email: ''
        }, {
          role: '物流对接人',
          name: '',
          phone: '',
          wechat: '',
          email: ''
        }, {
          role: '财务对接人',
          name: '',
          phone: '',
          wechat: ''
        }, {
          role: '售后专员1',
          name: '',
          phone: '',
          wechat: ''
        }, {
          role: '售后专员2',
          name: '',
          phone: '',
          wechat: ''
        }],
        subDialog: {
          innerVisible: false,
          addBool: true,
          type: 4,
          nameVal: 'name',
          tableType: 'selection',
          brand: {}
        },
        subDialogImg: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {},
          fileCategoryCode: 'FILE19011293581108'
        },
        subDialogImgs: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'selection',
          files: [],
          fileCategoryCode: 'FILE19011293581108'
        },
        subDialogAvatar: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {},
          fileCategoryCode: 'FILE19011293581108'
        }
      }
    },
    components: {
      MultiUpload,
      checkModule,
      selector
    },
    methods: {
      // generatePassword() {
      //   this.$nextTick(function () {
      //     //DOM 更新了
      //     this.$refs.inputPassword.focus()
      //   })
      //   this.source.password = randomPassword(true, 6, 6, true);
      //   this.password = this.source.password;
      // },
      // async getSource() {
      //   let obj = parseQueryString(location.hash.split('?')[1]);
      //   if (obj.id) {
      //     let res = await this.Api.getShopInfo({id: obj.id});
      //     if (res.status == 1) {
      //       Object.assign(this.source, res.data);
      //       this.source.logoUrl = res.data.logoUrl ? [res.data.logoUrl] : [];
      //       if (this.source.province) {
      //         this.source.area = [this.source.province];
      //         if (this.source.city) {
      //           this.source.area.push(this.source.city);
      //           if (this.source.region) {
      //             this.source.area.push(this.source.region);
      //           }
      //         }
      //       }
      //       if (res.data.shopCommunicationBookList) {
      //         res.data.shopCommunicationBookList.forEach((item, inx) => {
      //           Object.assign(this.shopCommunicationBookList[inx], item);
      //         })
      //       }

      //       if (res.data.rateConfig) {
      //         Object.assign(this.rateConfig, res.data.rateConfig);
      //       }
      //       this.brandIdList = res.data.brandIdList || [];
      //       this.brandList = res.data.brand || [];
      //       Object.assign(this.shopInfo, res.data.shopInfo);
      //       if (res.data.shopInfo.bcStartime) {
      //         this.shopInfo.bcStartime = format(new Date(res.data.shopInfo.bcStartime));
      //       }
      //       if (res.data.shopInfo.bcEndtime) {
      //         this.shopInfo.bcEndtime = format(new Date(res.data.shopInfo.bcEndtime));
      //       }
      //       this.shopInfo.bcPicUrls = res.data.bcPicUrls ? res.data.bcPicUrls : [];
      //       this.shopInfo.bcPicUrl = res.data.bcPicUrl ? [res.data.bcPicUrl] : [];
      //     }
      //   }
      // },
      handleSelectImg(row, type) {
        this.shopInfo.bcPicUrl = Object.assign({}, this.shopInfo.bcPicUrl, row);
        this.subDialogImg.files = Object.assign({}, this.shopInfo.bcPicUrl);
      },
      handleSelectAvatar(row, type) {
        this.logoUrl = Object.assign({}, this.logoUrl, row);
        this.subDialogAvatar.files = Object.assign({}, this.logoUrl);
      },
      handleSelectImgs(row, type) {
        this.shopInfo.bcPicUrls = Object.assign([], this.shopInfo.bcPicUrls, row);
        this.subDialogImgs.files = Object.assign([], this.shopInfo.bcPicUrls, row);
      },
      goBack() {
        this.$router.push({path: '/seller/mfrs'});
      },
      next() {
        if (this.active++ > this.stepLength) this.active = 0;
      },
      prev() {
        if (this.active-- < 0) this.active = 0;
      },
      // uploadImg(fileList) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.adPicUrls = fileList;
      // },
      // uploadOtherImg(fileList) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.otherPicUrls = fileList;
      // },
      // uploadlogoUrl(filelist) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.logoUrl = fileList;
      // },
      async handleItemChange(val) {
        val = val instanceof Array ? val : [val];
        if (val && this.val !== val[val.length - 1]) {
          this.val = val[val.length - 1];
          if (val.length < 3) {
            for (var i = 0; i < this.address.length; i++) {
              if (this.address[i]) {
                var a = false;
                val.forEach(item => {
                  if (this.address[i].parentCode === '0' || item === this.address[i].parentCode) {
                    a = true;
                  }
                })
                if (!a) {
                  this.address.splice(i, 1);
                  i --;
                }
              }
            }
            await this.handleItemChanges(val[val.length - 1], val.length - 1);
            this.address = this.address.map(item => {
              if (item) {
                if (item.areaLevel !== 3) {
                  item.children = [];
                }
                return item;
              }
            })
            this.treeDataList = this.$plug.recursion.treeData(this.address, 'parentCode', ['0', null], 'code', 'name');
          }
        }
      },
      async handleItemChanges(item, inx) {
        let res = await this.Api.getAreaConfig({parentCode: item ? item : '0'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          let address = this.address;
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < address.length; j++) {
              if (list[i].id === address[j].id) {
                list.splice(i, 1);
                i --;
                break;
              }
            }
          }
          this.address = this.address.concat(list);
        }
      },
      handleSelect(row, type) {
        let isExist = false;
        row.map(item => {
          isExist = false;
          this.brandList.forEach(m => {
            if (m.id == item.id) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.brandList.push(item);
          }
        })
      },
      delBrand(brand, inx) {
        this.brandList.splice(inx, 1);
      },
      async handleAdd() {
        let shopInfoKey = Object.keys(this.shopInfo);
        for (let i = 0; i < shopInfoKey.length; i++) {
          let k = shopInfoKey[i];
          let v = this.shopInfo[k];
          if (!v) {
            this.errorTips = this.shopInfoVals[k];
            return false;
          } else if(k === 'bcPicUrl' && !v.id) {
            this.errorTips = this.shopInfoVals[k];
            return false;
          }
        }
        let sourceKey = Object.keys(this.source);
        for (let i = 0; i < sourceKey.length; i++) {
          if (!this.source[sourceKey[i]]) {
            this.errorTips = this.sourceVals[sourceKey[i]];
            return false;
          }
        }

        if (!this.brandList.length) {
          this.errorTips = '请选择经营品牌';
          return false;
        }
        if (!this.logoUrl.id) {
          this.errorTips = '请选择店铺头像';
          return false;
        }

        let communications = this.shopCommunicationBookList;
        for (var i = 0; i < communications.length; i++) {
          if (i < communications.length - 1) {
            if (!communications[i].phone) {
              this.errorTips = `请填写${communications[i].role}的手机号`;
              return false;
            } else if (!communications[i].name) {
              this.errorTips = `请填写${communications[i].role}的姓名`;
              return false;
            }
          }
        }
        if (!this.rateConfig.storeRatePlatform) {
          this.errorTips = '请填写平台服务费率';
          return false;
        }


        let brandList = this.brandList.map(item => {
          return {id: item.id, name: item.name};
        })
        let arr = [];
        let shopInfo = Object.assign({}, this.shopInfo);
        if (shopInfo.bcPicUrls) {
          arr = shopInfo.bcPicUrls.map(item => {
            return item.url;
          })
        }
        if (shopInfo.bcStartTime && shopInfo.bcEndtime) {
          // let startTime = format(new Date(shopInfo.bcStartTime), 'yyyy/MM/dd');
          // let endTime = format(new Date(shopInfo.bcEndtime), 'yyyy/MM/dd');
          shopInfo.bcEndtime = `${shopInfo.bcStartTime} —— ${shopInfo.bcEndtime}`;
        }
        let communication = [];
        this.shopCommunicationBookList.forEach(item => {
          if (item.name && item.phone ) {
            communication.push(item);
          }
        });
        let address = [];
        this.address.map(item => {
          this.source.area.forEach((t, inx) => {
            if (item.code == t) {
              address[inx] = item.name;
            }
          })
        })

        let params = Object.assign({
          shopInfo: Object.assign({}, shopInfo, {
            bcPicUrls: arr.join(','),
            bcPicUrl: shopInfo.bcPicUrl.url
          }),
          shopCommunicationBookList: communication,
          brandIdList: brandList,
          rateConfig: {
            storeRatePlatform: fixedNum(this.rateConfig.storeRatePlatform / 100, 8)
          },
          logoUrl: this.logoUrl.url,
          province: address[0],
          city: address[1],
          region: address[2],
        }, this.source);
        let res = await this.Api.addShop(params);
        if (res.status === 1) {
          this.$plug.prompt.saveTip('添加成功');
          this.$router.push({path: '/seller/mfrs'});
          // this.dialogVisible = true;
          return ;
        }
      },
      handleClose() {
        this.$router.push({path: '/seller/mfrs'});
      },
      async getServiceRate() {
        let res = await this.Api.findServiceRate({code: 'SYS19011480946691'});
        if (res.status === 1) {
          this.rateConfig.storeRatePlatform = fixedNum(res.message * 100);
        }
      }
    },
    mounted() {
      // this.getSource();
      this.handleItemChange(['0']);
      this.getServiceRate();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.wrapper-box{
  position: relative;
  padding-bottom: 50px;
  font-size: 14px;
  padding: 0 20px 20px;
  .operate-box{
    position: absolute;
    top: 0;
    right: 0;
    span{
      margin-right: 15px;
      font-size: 20px;
      color: #f0c;
    }
  }
  .go-back{
    position: absolute;
    top: 0;
    right: 10px;
  }
  h2{
    font-weight: 200;
  }
}
.tips-box{
      font-size: 12px;
      color: #bbb;
      margin: 5px 0;
      line-height: 1.2;
    }
.mfrs-form-box{
  margin-top: 30px;
}
</style>
