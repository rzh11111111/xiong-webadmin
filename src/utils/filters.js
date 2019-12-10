

export class Filters {

	constructor() {

	}

  filterEmptyProperty (obj){
    for(let key in obj){
      if(obj[key]==='' || obj[key]===null){
        delete obj[key]
      }
    }
  }

  filterSameItem (arrAll,arrPart,idAll,idPart){
    let arr=[];
    arrAll.forEach((itemAll, index) => {
      let sameBool=false;
      arrPart.forEach((item) => {
        if(itemAll[idAll] === item[idPart]) {
          sameBool=true;
        }
      })
      if(!sameBool){
        arr.push(itemAll);
      }
    })
    return arr;
  }

}
