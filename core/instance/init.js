import {constructProxy} from "./proxy.js";
import {mount} from "./mount.js";

let uid = 0;

export function initMixin(Due){
    Due.prototype._init = function(options){
        const vm = this;//建立Due实例
        vm.uid = uid ++;//创建实例编号
        vm._isDue = true;//标记是否为Due实例
        //初始化数据data
        if (options && options.data) {
            vm._data = constructProxy(vm, options.data, "");
        }
        //初始化DOM并挂载
        if (options && options.el) {
            let rootDom = document.getElementById(options.el);
            mount(vm, rootDom);
        }
    }
}

