<!--
  searchObj.searchBool 默认为false时 查询 组件显示，为true时隐藏
	searchObj.searchBtnBool 默认为false时 查询按钮 显示，为true时隐藏
	searchObj.addBool 默认为false时 新增按钮 显示，为true时隐藏
-->
<!--
  isText //输入框
  isSelect //搜索框
  isDate //日期时间框
  isRangeInput //区间输入 例 1 - 2
  isDateRangeList //左侧选择框， 右侧日期时间框
  isSelectList //左侧选择框，右侧输入框

  defaultSelectLabel   // 重置时左侧选中的默认值
  defaultSelect   // 置时右侧文本框默认值

  unclearable //不可清除
  multiple //多选
 -->
<!--
 quickSearch:
   isShow: 显示
   isHideAll: 隐藏全部这个键
   hideTime: 隐藏时间
   group: 要显示的查询条件 例： [{value: 1, label: null, selected: null, list: [{label: 'xxx', value: 'xxx'}]}]
-->
<template>
  <el-row>
    <el-col :span="24">
      <el-card shadow="never" class="card-box" v-if="!searchBool">
        <div class="search-text">
          <div class="search-left">
            <i class="el-icon-search"></i>
            <span>条件查询</span>
          </div>
          <el-button type="text" :icon="showSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="toggleSearch">{{showSearch ? '收起' : '更多'}}</el-button>
          <div class="search-btn">
            <el-button v-if="!dialog.searchBtnBool" size="mini" type="primary" icon="el-icon-search"
                       @click="handleSearch">查询
            </el-button>
            <el-button v-if="!dialog.refreshBool" size="mini" @click="onRefresh" icon="el-icon-refresh">重置
            </el-button>
          </div>
        </div>
        <div class="search-box-wrapper" :style="searchBox.height">
          <div ref="searchBoxWrapper">
            
            <div class="expand-search-box" ref="searchBoxAll">
              <el-form ref="form" :inline="true" label-width="110px" size="mini" @keyup.enter.native="handleSearch">
                  <!-- <slot name="search"></slot> -->
                  <div class="search-box">
                    <div class="search-box-input">
                      <el-form-item :label="(item.name ? (item.name+':') : '')" :key="item.value" v-for="item in searchObj" v-if="item.isInputList">
                        <div class="search-item-left">
                          <el-select size="mini" :multiple="item.multiple || false" :clearable="!item.unclearable" v-model="item.selectLabel" :placeholder="item.selectPlaceholder || '请选择'">
                            <template v-for="sitem in item.list">
                              <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                            </template>
                          </el-select>
                        </div>
                        <el-input size="mini"  :clearable="!item.unclearable" :placeholder="item.placeholder || '请输入'" v-model="item.label"></el-input>
                      </el-form-item>
                      <el-form-item :label="item.name+':'" :key="item.value" v-for="item in searchObj"
                                    v-if="item.isText">
                        <el-input size="mini"  :clearable="!item.unclearable" :placeholder="item.placeholder || '请输入'" :title="item.placeholder && item.placeholder.length > 14 ? item.placeholder : ''" v-model="item.label"></el-input>
                      </el-form-item>
                      <template v-for="item in searchObj"
                                      v-if="item.isSelect">
                        <template v-if="!item.fields">
                          <el-form-item :label="item.name+':'">
                            <el-select size="mini" :multiple="item.multiple || false"  :clearable="!item.unclearable" v-model="item.label" :placeholder="item.placeholder || '请选择'">
                              <template v-for="sitem in item.list">
                                <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                              </template>
                            </el-select>
                          </el-form-item>
                        </template>
                        <template v-else>
                          <el-form-item :label="item.name+':'" :key="sitem.value" v-for="sitem in searchObj"
                                        v-if="item.fields && sitem.value === item.fields.value &&  item.fields.selected.indexOf(sitem.label) !== -1">
                            <el-select size="mini" :multiple="item.multiple || false" :clearable="!item.unclearable" v-model="item.label" :placeholder="item.placeholder || '请选择'">
                              <template v-for="sitem in item.list">
                                <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                              </template>
                            </el-select>
                          </el-form-item>
                        </template>
                      </template>
                      <el-form-item :label="item.name+':'" :key="item.value" v-for="item in searchObj"
                                    v-if="item.isCascader">
                        <el-cascader
                          size="mini"
                          :options="item.list"
                          v-model="item.label"
                          :change-on-select="item.changeSelect || false"
                          :props="item.props"
                        >
                        </el-cascader>
                      </el-form-item>
                      <el-form-item :label="item.name+':'" :key="item.value" v-for="item in searchObj"
                                    v-if="item.isRangeInput">
                        <el-input size="mini"  :clearable="!item.unclearable" :placeholder="item.placeholder || '请输入'" v-model="item.label[0]" class="half-width"></el-input>
                        -
                        <el-input size="mini"  :clearable="!item.unclearable" :placeholder="item.placeholder || '请输入'" v-model="item.label[1]" class="half-width"></el-input>
                      </el-form-item>
                      <el-form-item :label="item.name+':'" :key="item.value" v-for="item in searchObj" v-if="item.isDate">
                        <el-date-picker
                          v-model="item.label"
                          type="datetime"
                          size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @change="handleChangeTimes"
                          editable
                          :clearable="!item.unclearable"
                          :placeholder="'请选择' + item.name">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item :label="(item.name ? (item.name+':') : '')" :key="item.value" v-for="item in searchObj" v-if="item.isDateRangeList">
                        <div class="search-item-left">
                          <el-select size="mini" :multiple="item.multiple || false" v-model="item.selectLabel" :placeholder="item.selectPlaceholder || '请选择'">
                            <template v-for="sitem in item.list">
                              <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                            </template>
                          </el-select>
                        </div>
                        <el-date-picker
                          v-model="item.label"
                          size="mini"
                          type="datetimerange"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @change="handleChangeTimes"
                          editable
                          :clearable="!item.unclearable"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>

                      <el-form-item :label="item.name+':'" :key="item.value" v-for="item in searchObj"
                      v-if="item.isTimeRange">
                        <el-date-picker
                        v-model="item.label"
                        size="mini"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="handleChangeTimes"
                        editable
                        :clearable="!item.unclearable"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>


                      <!-- <el-form-item :label="item.name+':'" :key="item.value" v-for="item in searchObj"
                      v-if="item.isDate">
                        <el-date-picker
                        v-model="item.label"
                        size="mini"
                        type="datetimerange"
                        :picker-options="pickerOptions2"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00']">
                        </el-date-picker>
                      </el-form-item> -->
                    </div>
                    <!-- <div class="search-btn">
                      <div class="btn-a">

                      </div>
                      <div class="btn-b">
                        <el-button v-if="!dialog.searchBtnBool" size="mini" type="primary" icon="el-icon-search"
                                   @click="handleSearch">查询
                        </el-button>
                        <el-button v-if="!dialog.refreshBool" size="mini" @click="onRefresh" icon="el-icon-refresh">重置
                        </el-button>
                      </div>
                    </div> -->
                  </div>
              </el-form>
            </div>
            <div class="retract-search-box" ref="searchBoxSmall">
                <el-form class="retract-search-content" @keyup.enter.native="handleSearch">
                  <template  :label="(searchObj[0].name ? (searchObj[0].name+':') : '')" v-if="searchObj[0].isInputList">
                    <div class="search-item-left">
                      <el-select size="small" :multiple="searchObj[0].multiple || false"  :clearable="!searchObj[0].unclearable" v-model="searchObj[0].selectLabel" :placeholder="searchObj[0].selectPlaceholder || '请选择'">
                        <template v-for="sitem in searchObj[0].list">
                          <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                        </template>
                      </el-select>
                    </div>
                    <el-input size="small"  :clearable="!searchObj[0].unclearable" :placeholder="searchObj[0].placeholder || '请输入'" v-model="searchObj[0].label"></el-input>
                  </template>
                  <template  :label="(searchObj[0].name ? (searchObj[0].name+':') : '')" v-else-if="searchObj[0].isDateRangeList">
                    <div class="search-item-left">
                      <el-select size="small" :multiple="searchObj[0].multiple || false" v-model="searchObj[0].selectLabel" :placeholder="searchObj[0].selectPlaceholder || '请选择'">
                        <template v-for="sitem in searchObj[0].list">
                          <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                        </template>
                      </el-select>
                    </div>
                    <el-date-picker
                      v-model="searchObj[0].label"
                      size="mini"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="handleChangeTimes"
                      editable
                      :clearable="!searchObj[0].unclearable"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </template>
                  <template v-else>
                    <span>{{searchObj[0].name}}:</span>
                    <label v-if="searchObj[0].isText">
                      <el-input size="small"  :clearable="!searchObj[0].unclearable" :placeholder="searchObj[0].placeholder || '请输入'"  :title="searchObj[0].placeholder && searchObj[0].placeholder.length > 14 ? searchObj[0].placeholder : ''" v-model="searchObj[0].label"></el-input>
                    </label>

                    <label v-else-if="searchObj[0].isSelect">
                      <el-select size="small" :multiple="searchObj[0].multiple || false"  :clearable="!searchObj[0].unclearable" v-model="searchObj[0].label" :readonly="dialog.readBool" :placeholder="searchObj[0].placeholder || '请选择'">
                        <template v-for="sitem in searchObj[0].list">
                          <el-option :label="sitem.label" :value="sitem.value" :key="sitem.value"></el-option>
                        </template>
                      </el-select>
                    </label>
                    <label v-else-if="searchObj[0].isCascader">
                      <el-cascader
                        size="small"
                        :options="searchObj[0].list"
                        v-model="searchObj[0].label"
                        :change-on-select="searchObj[0].changeSelect || false"
                        :props="searchObj[0].props"
                        :clearable="!searchObj[0].unclearable"
                      >
                      </el-cascader>
                    </label>
                    <label v-else-if="searchObj[0].isDate">
                      <el-date-picker
                        v-model="searchObj[0].label"
                        type="datetime"
                        size="small"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="handleChangeTimes"
                        editable
                        :clearable="!searchObj[0].unclearable"
                        :placeholder="'请选择' + searchObj[0].name">
                      </el-date-picker>
                    </label>
                    <label v-else-if="searchObj[0].isTimeRange">
                      <el-date-picker
                      v-model="searchObj[0].label"
                      size="small"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="handleChangeTimes"
                      editable
                      :clearable="!searchObj[0].unclearable"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                      </el-date-picker>
                    </label>
                  </template>

                  <!-- <div class="search-btn">
                    <el-button v-if="!dialog.searchBtnBool" size="small" type="primary" icon="el-icon-search"
                               @click="handleSearch">查询
                    </el-button>
                    <el-button v-if="!dialog.refreshBool" size="small" @click="onRefresh" icon="el-icon-refresh">重置
                    </el-button>
                  </div> -->
                </el-form>
            </div>
          </div>
        </div>
      </el-card>
      <div :class="'main-box-btn' + (isSidebar ? ' sidebar-box-btn' : '')" v-if="!dialog.addBool || quickSearch">
        <div class="btn-box">
          <div class="btn-left">
            <div>
              <el-button v-if="!dialog.addBool" size="mini" icon="el-icon-plus" type="primary" @click="handleAdd">
                {{dialog.btnText}}
              </el-button>
              <slot name="arrDel"></slot>
            </div>
          </div>
          <div class="btn-right">

            <div class="radio-group-text-box" v-if="quickSearch && quickSearch.isShow">
              <el-radio-group class="radio-group-text" v-model="rangeAll" fill="#fff" :text-color="theme.color" size="mini" @change="handleChangeAll" v-if="!quickSearch.isHideAll">
                <el-radio-button :label="1">全部</el-radio-button>
              </el-radio-group>
              <el-radio-group class="radio-group-text" v-model="timeRange" fill="#fff" :text-color="theme.color" size="mini" @change="handleChangeTime" v-if="!quickSearch.hideTime">
                <el-radio-button label="本周"></el-radio-button>
                <el-radio-button label="本月"></el-radio-button>
                <el-radio-button label="上月"></el-radio-button>
                <el-radio-button label="本年度"></el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="q.label" fill="#fff" :text-color="theme.color" size="mini" @change.native="handleChange(q)" v-for="q in quickSearch.group" :key="q.value">
                <el-radio-button :label="item.value" v-for="item in q.list" :key="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="btn-right-box">
              <slot name="right"></slot>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  import {mapGetters} from 'vuex'
  import bus from '@/utils/bus.js'
  import {format} from "@/utils";

  export default {
    props: {
      isSidebar: {
        type: Boolean,
        default() {
          return false;
        }
      },
      quickSearch: {
        type: Object,
        default() {
          return {
            isShow: false,
            group: []
          };
        }
      },
      searchBool: {
        type: Boolean,
        default() {
          return false
        }
      },
      searchObj: {
        type: Array,
        default() {
          return []
        }
      },
      tableTree: {
        type: Boolean,
        default() {
          return false
        }
      },
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      pagination: {
        type: Object,
        default() {
          return {}
        }
      },
      getDataList: {
        type: Function
      },
      timeRangeVal: {
        type: Array,
        default() {
          return ['starTime', 'endTime'];
        }
      }
    },
    data() {
      let rangeAll = 1;
      if (this.quickSearch && this.quickSearch.group) {
        let group = this.quickSearch.group;
        for (var i = 0; i < group.length; i++) {
          if (group[i].label || group[i].label === 0 || group[i].defaultChecked || group[i].defaultChecked === 0) {
            rangeAll = 0;
            break;
          }
        }

      }
      return {
        searchBox: {
          height: ''
        },
        timeRange: null,
        rangeAll,
        showSearch: true,
        search_radio: 0,
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    watch: {
      'quickSearch.isHideAll'(bool) {
        if (bool) {
          this.rangeAll = null;
        }
      }
    },
    computed: {
      ...mapGetters([
        'theme'
      ]),
      changeTimeRange: {
        get: function() {
          let t = {};
          this.searchObj.forEach(item => {
            if (this.quickSearch.isTimeRange) {
              if (item.value == this.timeRangeVal[0]) {
                t.starTime = item.label[0];
                t.endTime = item.label[1];
              }
            } else {
              if (item.value == this.timeRangeVal[0]) {
                t.starTime = item.label;
              }
              if (item.value == this.timeRangeVal[1]) {
                t.endTime = item.label;
              }
            }
          });
          return t;
        },
        set: function(obj) {
          this.rangeAll = null;
          this.searchObj.map((item, inx) => {
            if (this.quickSearch.isTimeRange) {
              if (item.value == this.timeRangeVal[0]) {
                let starTime = obj.starTime ? format(new Date(obj.starTime), 'yyyy-MM-dd hh:mm:ss') : '';
                let endTime =  obj.endTime ? format(new Date(obj.endTime), 'yyyy-MM-dd hh:mm:ss') : '';
                let arr = [];
                if (starTime) {
                  arr.push(starTime);
                }
                if (endTime) {
                  arr.push(endTime);
                }
                this.searchObj[inx].label = arr;
              }
            } else {
              if (item.value == this.timeRangeVal[0]) {
                this.searchObj[inx].label = obj.starTime ? format(new Date(obj.starTime), 'yyyy-MM-dd hh:mm:ss') : '';
              }
              if (item.value == this.timeRangeVal[1]) {
                this.searchObj[inx].label = obj.endTime ? format(new Date(obj.endTime), 'yyyy-MM-dd hh:mm:ss') : '';
              }
            }
            return item;
          });
          if (!obj.starTime || !obj.endTime) {
            this.timeRange = null;
          }
        }
      }
    },
    methods: {
      handleChangeAll() {
        this.changeTimeRange = {starTime: '', endTime: ''};
        if (this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            item.label = '';
            item.selected = '';
          })
        }
        this.rangeAll = 1;
        this.loadData();
      },
      handleChangeTime() {
        let date = new Date();
        let starTime = '', endTime = '';
        switch(this.timeRange) {
          case '本周':
            let day = 6 - date.getDay();
            date.setDate(date.getDate() - day);
            date.setHours(0,0,0,0);
            starTime = date.valueOf();
            date.setHours(23,59,59,999);
            date.setDate(date.getDate() + 6);
            endTime = date.valueOf();
          break;
          case '本月':
            date.setDate(1)
            date.setHours(0,0,0,0);
            starTime = date.valueOf();
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);
            date.setHours(23,59,59,999);
            endTime = date.valueOf();
          break;
          case '上月':
            let m = date.getMonth() - 1;
            date.setMonth(m, 1);
            date.setHours(0,0,0,0);
            starTime = date.valueOf();
            date.setMonth(date.getMonth() + 1, 0);
            date.setHours(23,59,59,999);
            endTime = date.valueOf();
          break;
          case '本年度':
            date.setMonth(0);
            date.setDate(1);
            date.setHours(0,0,0,0);
            starTime = date.valueOf();
            date.setMonth(12);
            date.setDate(0);
            date.setHours(23,59,59,999);
            endTime = date.valueOf();
          break;
        }
        this.changeTimeRange = {starTime, endTime};
        this.loadData();
      },
      handleChange(params) {
        this.rangeAll = null;
        let list = params.list;
        for (var i = 0; i < list.length; i++) {
          if (list[i].value === params.label) {
            params.selected = list[i].value;
            break;
          }
        }
        this.loadData();
      },
      handleAdd() { // 显示新增界面
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.$emit('add', this.dialog.ruleForm2); //调用父组件的add方法 需要自定义add时使用
      },
      handleChangeTimes() {
        this.timeRange = '';
      },
      handleSearch() {
        // if (this.quickSearch.isShow) {
        //   let t = this.changeTimeRange;
        // }
        this.loadData();
      },
      loadData() {
        this.pagination.page = 1;
        if (this.tableTree) {
          this.getDataList()
        } else {
          bus.$emit("loadDialogData");
        }
      },
      onRefresh() {
        this.searchObj.map(item => {
          if (item.unclearable) {
            return ;
          }

          if (item.selectLabel) {
            if (item.defaultSelectLabel) {
              item.selectLabel = item.defaultSelectLabel;
            } else {
              item.selectLabel = null;
            }
          }
          if (item.label instanceof Array) {
            if (item.defaultSelect) {
              item.label = item.defaultSelect;
              return ;
            }
            item.label = [];
          } else {
            if (item.defaultSelect) {
              item.label = item.defaultSelect;
              return ;
            }
            item.label = null
          }
        });
        let isAll = true;
        if (this.quickSearch.isShow) {
          this.timeRange = '';
          if (this.quickSearch.group) {
            this.quickSearch.group.map(item => {
              if (item.defaultChecked || item.defaultChecked === 0) {
                item.label = item.defaultChecked;
                item.selected = item.defaultChecked;
                isAll = false;
                return ;
              }
              item.label = null;
              item.selected = null;
            })
          }
          this.rangeAll = isAll ? 1 : null;
        }

        this.loadData()
      },
      toggleSearch() {
        this.showSearch = !this.showSearch;
        this.getHeight();
      },
      getHeight() {
        if (this.showSearch) {
          this.searchBox.height = `height: ${this.$refs.searchBoxAll.offsetHeight}px`;
          this.$refs.searchBoxWrapper.style = `top:0px`;
          this.$refs.searchBoxSmall.style = 'opacity: 0';
          this.$refs.searchBoxAll.style = 'opacity: 1';

          return false;
        }
        this.searchBox.height = `height: ${this.$refs.searchBoxSmall.offsetHeight}px`;
        this.$refs.searchBoxWrapper.style = `top:-${this.$refs.searchBoxAll.offsetHeight}px`;
          this.$refs.searchBoxAll.style = 'opacity: 0';
          this.$refs.searchBoxSmall.style = 'opacity: 1';
      }
    },
    mounted() {
      if (!this.searchBool) {
        window.addEventListener('resize', this.getHeight);
        this.$nextTick(() => {
          this.getHeight();
        })
      }
    },
    beforeDestroy() {
      if (!this.searchBool) {
        window.removeEventListener('resize', this.getHeight);
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.el-card{
  border-radius: 0 !important;
}
  .card-box {
    margin-bottom: 11px;
  }
  .retract-search-box{
    padding: 12px;
    &.search-text{
      border-bottom-width: 0;
    }
    .retract-search-content{
      flex: 1;
      label, &>div{
        display:inline-block;
      }
      .el-input--small /deep/ .el-input__inner {
        width: 220px;
        max-width: 220px;
      }

      .el-select /deep/ .el-input--small {
        width: 220px;
      }

      .el-form--inline /deep/ .el-form-item {
        margin-right: 0;
      }

      .el-form-item /deep/ .el-date-editor {
        width: 220px;
      }
      .search-item-left{
        display: inline-block;
        width: 136px;
        text-align: right;
        padding-right: 3px;
        .el-select--small {
          width: 120px;
          .el-input--small {
             width: 120px;
           }
        }
        .el-select  /deep/  .el-input.el-input--small.el-input--suffix{
            width: 120px;
        }
        .el-select--small /deep/ .el-input__inner {
             width: 120px;
        }
        &+.el-input--small{
          width: auto;
        }
      }
    }
  }
  .search-text {
    padding: 5px 12px;
    border-bottom: 1px solid #dfdfdf;
    background-color: #f3f3f3;
    display: flex;
    flex-direction: inherit;
    justify-content: space-between;
    &>.search-left{
      padding-top: 1px;
      flex: 1;
    }
    .search-btn {
      padding-left: 5px;
      .el-button{
        margin-left: 3px;
      }
    }
    span {
      font-size: 14px;
    }
  }

  .el-row /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 4px;
  }

  .el-input /deep/ .el-select .el-input.is-focus .el-input__inner {
    border: 1px solid #dcdfe6;
  }

  .el-input--mini /deep/ .el-input__inner {
    width: 210px;
  }

  .el-select /deep/ .el-input--mini {
    width: 210px;
  }

  .el-form--inline /deep/ .el-form-item {
    margin-right: 0;
  }

  .el-form-item /deep/ .el-date-editor {
    width: 210px;
  }

  .el-form-item /deep/ .el-form-item__label {
    padding-right: 6px;
  }
  .half-width{
    &.el-input--mini {
      width: 84px;
      .el-input__inner {
         width: 84px;
       }
    }
    &.el-input--mini /deep/ .el-input__inner {
         width: 84px;
    }
    // &.el-select--mini {
    //   width: 90px;
    //   .el-input--mini {
    //      width: 90px;
    //    }
    // }
    // &.el-select  /deep/  .el-input.el-input--mini.el-input--suffix{
    //     width: 90px;
    // }
    // &.el-select--mini /deep/ .el-input__inner {
    //      width: 90px;
    // }
  }

  .search-box {
    padding: 12px;
    .search-box-input {
      // padding: 3px 10px;
      display: flex;
      flex-flow: wrap;
      overflow: hidden;
    }

    .search-item-left{
      display: inline-block;
      width: 106px;
      text-align: right;
      padding-right: 3px;
      .el-select--mini {
        width: 90px;
        .el-input--mini {
           width: 90px;
         }
      }
      .el-select  /deep/  .el-input.el-input--mini.el-input--suffix{
        width: 90px;
        .el-input__suffix{
          right: 2px;
        }
      }
      .el-select--mini /deep/ .el-input__inner {
           width: 90px;
           padding: 0 8px;
           padding-right: 24px;
      }
      &+.el-input--mini{
        width: auto;
      }
    }
  }

  .main-box-btn {
    overflow: hidden;
    border: 1px solid #dfdfdf;
    border-bottom-width: 0;
    background-color: #f3f3f3;
    padding: 7px 12px 2px;
    text-align: right;
    &.sidebar-box-btn{
      // border-width: 0;
      // padding-left: 0;
      padding-bottom: 5px;
      .btn-box{
        padding-left: 0;
        display: flex;
        justify-content: space-between;
      }
    }
    .el-radio-group{
      margin-left: 5px;
      margin-bottom: 5px;
    }
    .btn-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      .btn-left {
        flex: 1;
        text-align: left;
        margin-bottom: 5px;
        .el-button--mini{
          height: 28px;
        }
      }
      .btn-right {
        font-size: 0;
      }
    }
  }

  .el-input--suffix /deep/ .el-input__inner {
    width: 180px;
    padding-right: 0;
  }

  .el-card /deep/ .el-card__body {
    padding: 0;
  }
  .btn-right-box{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 4px;
    // margin-left: 10px;
  }
  .search-box-wrapper{
    position:relative;
    overflow:hidden;
    transition: height .3s ease;
    &>div{
      position:absolute;
      left: 0;
      width: 100%;
      transition: top .3s ease;
      .retract-search-box, .expand-search-box{
        transition: opacity .3s ease;
      }
    }
  }

</style>
