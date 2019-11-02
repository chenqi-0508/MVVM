export function getValue(obj, name) {//key.a
    if (!obj) return obj;
    let nameList = name.split('.');//['key','a']
    let temp = obj;
    console.log(obj);
    console.log(temp);
    for (let i = 0 ; i < nameList.length; i ++) {
        if (temp[nameList[i]]) {
            // console.log(temp);
            // console.log(nameList[i]);
            console.log(temp[nameList[i]]);
            temp = temp[nameList[i]];
        } else {
            return undefined;
        }
    }
    return temp;
}
