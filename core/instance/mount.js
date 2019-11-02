import VNode from "../vdom/vnode.js";
import {prepareRender, getTemplate2VNode, getVNode2Template} from "./render.js";

export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}

export function mount(vm, elm) {
    //进行挂载
    vm._vnode = constructVNode(vm, elm, null);
    //进行预备渲染
    prepareRender(vm, vm._vnode);
    // console.log(getTemplate2VNode());
    // console.log(getVNode2Template());
}

function constructVNode(vm, elm, parent) {
    let vnode = null;
    let tag = elm.nodeName;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType);

    let childs = vnode.ele.childNodes;
    for (let i = 0; i < childs.length; i++) {
        let childVNode = constructVNode(vm, childs[i], vnode);
        if (childVNode instanceof VNode) {//单一节点
            vnode.children.push(childVNode);
        } else {//节点数组（v-for的情况）
            vnode.children.concat(childVNode);
        }
    }
    return vnode;
}

function getNodeText(elm) {
    if (elm.nodeType == 3) {
        return elm.nodeValue;
    } else {
        return "";
    }
}
