import {setValue} from "../../util/ObjectUtil.js";

export function vmode(vm, elm, data) {
    //将data的值替换为真实元素elm中的值
    elm.oninput = function (event) {
        setValue(vm._data, data, elm.value);
    }
}
