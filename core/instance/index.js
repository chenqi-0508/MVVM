import {initMixin} from './init.js';

function Due(options){
    this._init(options);
}

//给Due原型上添加_init方法
initMixin(Due);

export default Due;
