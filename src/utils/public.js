
export class Public {

  constructor() {

  }

  transformArr(arr){//将数组的每一项的 label value 以对象的形式 [value:label]
    let targetObj={};
    for(let obj of arr){
      if (obj.selectValue) {
        if ((obj.selectLabel || obj.selectLabel === 0) && (obj.label || obj.label === 0)) {
          targetObj[obj.selectValue]=obj.selectLabel;
          targetObj[obj.value]=obj.label;
        }
      } else {
        targetObj[obj.value]=obj.label;
      }
    }
    return targetObj;
  }

  transformList(arr,keyid,keyname){//将对象的keyid keyname属性，赋值给一个新对象let obj={value: arr[keyid], label: arr[keyname]}
    let targetArr=[];
    for(let obj of arr){
      obj.value=obj[keyid];
      obj.label=obj[keyname];
      targetArr.push(obj);
    }
    return targetArr;
  }

  transformSelect(arr){//将数组的值 添加 value label
    let targetArr=[];
    arr.forEach((item)=>{
      targetArr.push({
        value:item,
        label:item
      })
    })
    return targetArr;
  }

  transformDatetime(now){
    if(now) {
      var year = now.getFullYear();
      var month = (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
      var date = (now.getDate()) >= 10 ? (now.getDate()) : '0' + (now.getDate());
      var hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours();
      var minute = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes();
      var second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    } else {
      return "";
    }
  }

  transformSearchData(searchObj){//整理searchObj数据
    //取出searchObj中的value label字段
    let queryPo = this.$plug.public.transformArr(searchObj);
    this.$plug.filters.filterEmptyProperty(queryPo);
    return queryPo;
  }

  priceSave(value){
    let val=value.toString();
    let price=val.split('.');
    if(price.length===1){
      return val*100;
    }else{
      let float=price[1];
      if(price[1].length==1){
        float=price[1]*10;
      }
      return Number(`${price[0]}${float}`);
    }
  }

  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }

  exportExcel(title,columns,optionsObj,listData){
    require.ensure([], () => {
      const {
        export_json_to_excel
      } = require('@/vendor/Export2Excel')
      let tHeader = [];
      let filterVal = [];
      columns.forEach((item)=>{
        tHeader.push(item.label);
        filterVal.push(item.value);
        if(item.slotBool && !item.priceBool){
          listData.map((list)=>{
            if(optionsObj[item.value][list[item.value]]){
              list[item.value]=optionsObj[item.value][list[item.value]];
            }else{
              list[item.value]='';
            }
            return list;
          })
        }else if(item.priceBool){
          listData.map((list)=>{
            list[item.value]=list[item.value]/100;
            return list;
          })
        }
      })
      const list = listData;
      const data = this.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, title);
    })
  }

}
