import {initMixin} from './init.js';
import {renderMixin} from "./render.js";

function Due(options){
    this._init(options);
    this._render();
}

//给Due原型上添加_init方法
initMixin(Due);
//给Due原型上添加_render方法
renderMixin(Due);

export default Due;
