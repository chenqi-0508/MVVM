import {renderData} from "./render.js";

const arrayProto = Array.prototype;//获取Array原型

function defArrayFunc(obj, func, namespace, vm) {//重新定义push，pop，shift，unshift方法
    Object.defineProperty(obj, func, {
        configurable: true,
        enumerable: true,
        value: function(...arg) {
            return arrayProto[func].apply(this, arg);
        }
    })
}

function proxyArr(vm, arr, namespace) {//在obj中重写数组部分方法，并将obj赋给arr的原型
    let obj = {
        eleType: 'Array',
        toString: () => {
            let result = '';
            for (let i = 0; i < arr.length; i ++) {
                result += arr[i] + ', ';
            }
            return result.substring(0, result.length - 2);
        },
        push() {},
        pop() {},
        shift() {},
        unshift() {}
    };
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    arr.__prototype__ = obj;
    return arr;
}

function constructObjectProxy(vm, obj, namespace){
    let proxyObj = {};
    for (let prop in obj) {
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get: () => obj[prop],
            set: v => {
                obj[prop] = v;
                renderData(vm, getNameSpace(namespace, prop));
            }
        });
        Object.defineProperty(vm, prop, {
            configurable: true,
            get: () => obj[prop],
            set: v => {
                obj[prop] = v;
                renderData(vm, getNameSpace(namespace, prop));
            }
        });
        if (obj[prop] instanceof Object){//对象中还有对象，则进项递归处理
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop));
        }
    }
    return proxyObj;
}

function getNameSpace(nowNameSpace, nowProp){
    if (nowNameSpace == null || nowNameSpace == ""){
        return nowProp;
    } else if (nowProp == null || nowProp == "") {
        return nowNameSpace;
    } else {
        return nowNameSpace + '.' + nowProp;
    }
}

export function constructProxy(vm, obj, namespace){
    let proxyObj = null;
    if (obj instanceof Array) {//当属性为数组
        proxyObj = new Array(obj.length);
        for (let i = 0; i < proxyObj.length; i ++) {//将数组中每个值进行代理
            proxyObj[i] = constructProxy(vm, obj[i], namespace);
        }
        proxyObj = proxyArr(vm, obj, namespace);//修改数组的部分方法
    } else if (obj instanceof Object) {//当属性为对象
        proxyObj = constructObjectProxy(vm, obj, namespace);//将对象中的每个值进行代理
    } else {
        throw new Error('error');
    }
    return proxyObj;
}
