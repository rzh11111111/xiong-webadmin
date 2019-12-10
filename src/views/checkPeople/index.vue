<template>
  <div>
    <template v-if="type == 1">
      <employee ref="employee" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect"></employee>
      <el-button @click="selectEmployee" style="width: 104px;" :disabled="disabled">选择员工</el-button>
    </template>

    <template v-else-if="type == 2">
      <partner ref="partner" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect"></partner>
      <el-button @click="selectPartner" :disabled="disabled" style="width: 104px;">选择合作商</el-button>
    </template>
    <template v-else-if="type == 3">
      <promoter ref="promoter" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect"></promoter>
      <el-button @click="selectPromoter" :disabled="disabled" style="width: 104px;">选择推广员</el-button>
    </template>
    <template v-else-if="type == 4">
      <province ref="province" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect"></province>
      <el-button @click="selectProvince" :disabled="disabled" style="width: 104px;">选择省区总</el-button>
    </template>
    <template v-else-if="type == 5">
      <member ref="member" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect"></member>
      <el-button @click="selectMember" :disabled="disabled" style="width: 104px;">选择会员</el-button>
    </template>

    <template v-else-if="type === 0">
      <employee ref="employee" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect" v-if="dialogType === 1"></employee>
      <partner ref="partner" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect" v-else-if="dialogType === 2"></partner>
      <promoter ref="promoter" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect" v-else-if="dialogType === 3"></promoter>
      <province ref="province" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect" v-else-if="dialogType === 4"></province>
      <member ref="member" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect" v-else-if="dialogType === 5"></member>
      <el-button @click="selectEmployee" :disabled="disabled">选择员工</el-button>
      <el-button @click="selectPartner" :disabled="disabled">选择合作商</el-button>
      <el-button @click="selectPromoter" :disabled="disabled">选择推广员</el-button>
      <el-button @click="selectProvince" :disabled="disabled">选择省区总</el-button>
      <el-button @click="selectMember" :disabled="disabled">选择会员</el-button>
    </template>
    <el-input v-model="subDialog.names" :disabled="true" style="width: calc(100% - 121px);"></el-input>
  </div>
</template>
<script>
  import employee from './employee';
  import promoter from './promoter';
  import partner from './partner';
  import province from './province';
  import member from './member';

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {
            nameVal: 'name',
            employee: {},
            promoter: {},
            partner: {},
            province: {},
            member: {}
          };
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false
        }
      },
      disabledPeople: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        types: ['employee', 'partner', 'promoter', 'province', 'member'],
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
      promoter,
      employee,
      partner,
      province,
      member
    },
    watch: {
      'dialog.type': function (val) {
        this.type = val;
        this.changeType(val);
      },
      'dialog.tableType': function(val) {
        this.subDialog.tableType = val;
      }
    },
    methods: {
      changeType(type) {
        let nameVal = this.dialog.nameVal instanceof Array ? this.dialog.nameVal[type - 1] : this.dialog.nameVal;
        let current = this.dialog[this.types[type - 1]];
        this.subDialog.tableType = this.dialog.tableType;

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
        this.subDialog.names = current[nameVal];
      },
      selectEmployee() {
        this.subDialog.titleText = '选择员工';
        this.dialogType = 1;
        this.subDialog.innerVisible = true;
        this.changeType(1);
      },
      selectPartner() {
        this.subDialog.titleText = '选择合作商';
        this.dialogType = 2;
        this.subDialog.innerVisible = true;
        this.changeType(2);
      },
      selectPromoter() {
        this.subDialog.titleText = '选择推广员';
        this.dialogType = 3;
        this.subDialog.innerVisible = true;
        this.changeType(3);
      },
      selectProvince() {
        this.subDialog.titleText = '选择省区总';
        this.dialogType = 4;
        this.subDialog.innerVisible = true;
        this.changeType(4);
      },
      selectMember() {
        this.subDialog.titleText = '选择会员';
        this.dialogType = 5;
        this.subDialog.innerVisible = true;
        this.changeType(5);
      },
      handleSelect(row, type) {
        let selectedData = null;
        let nameVal = this.dialog.nameVal instanceof Array ? this.dialog.nameVal[type - 1] : this.dialog.nameVal;
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
          selectedData = Object.assign({}, row);
          names = selectedData[nameVal];
        }
        this.subDialog.names = names;
        this.subDialog.ruleForm2 = {};
        this.subDialog.ruleForm2 = selectedData;
        this.$emit("submit", row, type);
      },
      clearSelect() {
        this.subDialog.ruleForm2 = null;
        this.$nextTick(()=>{
          this.$refs[this.types[this.dialog.type - 1]].clearSelect();
        });
        this.dialog.type = 1;
        this.type = 1;
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
