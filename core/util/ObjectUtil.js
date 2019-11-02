export function getValue(obj, name) {//key.a
    if (!obj) return obj;
    let nameList = name.split('.');//['key','a']
    let temp = obj;
    for (let i = 0 ; i < nameList.length; i ++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]];
        } else {
            return undefined;
        }
    }
    return temp;
}

export function setValue(obj, data, value) {
    if (!obj) return;
    let nameList = data.split('.');//['key','a']
    let temp = obj;
    for (let i = 0; i < nameList.length - 1; i++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]];
        } else {
            return;
        }
    }
    if (temp[nameList[nameList.length - 1]] != null) {
        temp[nameList[nameList.length - 1]] = value;
    }
}
