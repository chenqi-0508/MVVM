import {getValue} from "../util/ObjectUtil.js";

let template2VNode = new Map();
let vnode2Template = new Map();

export function renderMixin(Due) {
    Due.prototype._render = function() {
        renderNode(this, this._vnode);
    }
}

function renderNode(vm, vnode) {
    if (vnode.nodeType == 3) {//文本节点
        let templateNameArr = vnode2Template.get(vnode);

        if (templateNameArr) {
            let result = vnode.text;
            let templateValue = null;
            for (let i = 0; i < templateNameArr.length; i ++) {
                templateValue = getTemplateValue([vm._data, vm.env], templateNameArr[i].trim());
                if (templateValue) {
                    result = result.replace('{{' + templateNameArr[i] + '}}', templateValue);
                }
            }
            vnode.ele.nodeValue = result;
        }
    } else if (vnode.nodeType == 1 && vnode.tag == 'INPUT') {
        //根据当前vnode搜索在之前绑定的映射中是否存在v-model的属性值（如果有，返回数组，且长度为1）
        let nameList = vnode2Template.get(vnode);
        if (nameList) {
            //根据v-model上的属性值去data中搜索对应值，并返回到input元素中
            let templateValue = getTemplateValue([vm._data, vnode.env], nameList[0]);
            vnode.ele.value = templateValue;
        }
    } else {
        if (vnode.children.length > 0) {
            for (let i = 0 ; i < vnode.children.length; i ++) {
                renderNode(vm, vnode.children[i]);
            }
        }
    }
}

export function renderData(vm, data) {
    let vnodes = template2VNode.get(data);
    if (vnodes != null) {
        for (let i = 0 ; i < vnodes.length; i ++) {
            renderNode(vm, vnodes[i]);
        }
    }
}

function getTemplateValue(objs, templateName) {
    for (let i = 0 ; i < objs.length; i ++) {
        let templateValue = getValue(objs[i], templateName);
        if (templateValue != null) {
            return templateValue;
        }
    }
    return null;
}

export function prepareRender(vm, vnode) {
    if (vnode == null) return;
    //判断是否为元素节点
    if (vnode.nodeType == 1) {
        //解析元素节点是否有v-model
        analysisAttr(vm, vnode);
        for (let i = 0; vnode.children && i < vnode.children.length; i ++) {
            prepareRender(vm, vnode.children[i]);
        }
    } else if (vnode.nodeType == 3) {//判断是否为文本节点
        //解析模板
        analysisTemplateString(vnode);
    }
}

//解析模板字符串
function analysisTemplateString(vnode) {
    //判断是否有{{}}
    let templateList = vnode.text.match(/{{[a-zA-Z0-9_. ]+}}/g);
    if (templateList){
        for (let i = 0; i < templateList.length; i ++) {
            //去掉{{}}
            let templateName = getTemplateName(templateList[i]);
            //设置模板与虚拟节点的映射
            setTemplate2VNode(templateName, vnode);
            //设置虚拟节点与模板的映射
            setVNode2Template(templateName, vnode);
        }
    }
}

function setTemplate2VNode(templateName, vnode) {
    if (template2VNode.get(templateName)) {
        template2VNode.get(templateName).push(vnode);
    } else {
        template2VNode.set(templateName, [vnode]);
    }
}

function setVNode2Template(templateName, vnode) {
    if (vnode2Template.get(vnode)){
        vnode2Template.get(vnode).push(templateName);
    }else {
        vnode2Template.set(vnode, [templateName]);
    }
}

export function getTemplate2VNode() {
    return template2VNode;
}

export function getVNode2Template() {
    return vnode2Template;
}

//判断是否有花括号，有则去掉，没有则返回
function getTemplateName(template) {
    if (template.substring(0,2) == '{{' && template.substring(template.length - 2, template.length) == '}}') {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }
}

function analysisAttr(vm, vnode) {
    let attrNames = vnode.ele.getAttributeNames();
    if (attrNames.indexOf('v-model') > -1) {
        setTemplate2VNode(vnode.ele.getAttribute('v-model'), vnode);
        setVNode2Template(vnode.ele.getAttribute('v-model'), vnode);
    }
}
