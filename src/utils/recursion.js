export class Recursion {

  constructor() {

  }

  //keyRoot 为 父组件的 属性,valRoot为根节点的值，
  //value 为显示的value label为显示的label
  treeData(data, keyRoot, valRoot, value, label) {
    let data2 = [];
    if (typeof(valRoot) == 'string') {
      valRoot = [valRoot];
    }
    for (let i = 0; i < data.length; i++) {
      valRoot.map(v => {
        if (data[i][keyRoot] === v) {
          let item = Object.assign({}, data[i], {
            id: data[i][value],
            value: data[i][value],
            label: data[i][label]
          });
          if(value !== 'id') {
            item.ids = data[i].id;
          }
          this.recursion(data, item, keyRoot, valRoot, value, label);
          data2.push(item);
        }
      })
    }
    return data2;
  }

  //递归便利数据
  recursion(data, item, keyRoot, valRoot, value, label) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][keyRoot] == item.value) {
        let itemChild = Object.assign({}, data[i], {
          id: data[i][value],
          value: data[i][value],
          label: data[i][label]
        });
        if(value !== 'id') {
          itemChild.ids = data[i].id;
        }
        if (!item.children || !item.children.length) {
          item.children = [];
        }
        item.children.push(itemChild);
        this.recursion(data, itemChild, keyRoot, valRoot, value, label);
      }
    }
  }
/**
  * data: 数据
  * keyRoot: 上一级的[value],
  * valRoot: 'id',
  * parentId: 关联的数据
  * value: value取的字段
  * label: label取的字段
  **/
  // recursionData(data, keyRoot, value, label, parentId) {
  //   parentId = parentId instanceof Array ? parentId : [parentId];
  //   let items = [];
  //   for (let i = 0; i < data.length; i++) {
  //     parentId.map(v => {
  //       if (data[i][keyRoot] == v) {
  //         let item = Object.assign({}, data[i], {
  //           value: data[i][value],
  //           label: data[i][label]
  //         });
  //         let itemChild = this.recursionData(data, keyRoot, value, label, item[value]);
  //         if (itemChild && itemChild.length) {
  //           item.children = itemChild;
  //         }
  //         items.push(item);
  //       }
  //     })

  //   }
  //   return items;
  // }
}
