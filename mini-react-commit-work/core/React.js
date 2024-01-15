/**
import { render } from '../../mini-react-v01/core/React';
 * 1. 描述 dom结构
 * 2. 创建dom
 * 3. 对齐reactapi
 */
const createTextNode = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}
const createElement = (type, props, ...children) => {
    return {
        type: type,
        props: {
            ...props,
            children: children.map(child => ['string', 'number'].indexOf(typeof child) > -1 ? createTextNode(child) : child)
        }
    }
}
/**
 * v01 问题：递归调用会阻塞逻辑执行，dom结构过多会造成栈溢出
 * @param {*} el 
 * @param {*} container 
 */
// const render = (el = {}, container) => {
//     const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
//     const props = el.props || {}
//     Object.keys(props).forEach(key => {

//         if (key !== 'children') {
//             console.log(key, props[key])
//             dom[key] = props[key]
//         }
//     })
//     if (props.children) {
//         props.children.forEach(child => {
//             render(child, container)
//         })
//     }
//     container.append(dom)
// }
/**
 * v02 任务调度器
 * 把task拆分，大task 拆分为小task
 * 采用requestIdleCallback分帧运算
 */
// let taskId = 1
// const workLoop = (IdleDeadline => {
//     taskId ++
//     IdleDeadline.timeRemaining() // 任务剩余时间
//     // 执行任务逻辑
//     let shouldYield = false
//     while (!shouldYield) {
//         shouldYield = IdleDeadline.timeRemaining() < 1
//     }
//     // 执行下一个任务
//     requestIdleCallback(workLoop)
// }

// window.requestIdleCallback(workLoop)
/**
 * 实现febie架构
 * 使用链表结构，控制dom的渲染
 */
let root = null
const render = (el, container) => {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    root = nextWorkOfUnit
}

let nextWorkOfUnit = null
const workLoop = (IdleDeadline) => {

    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = preformWorkOfUnit(nextWorkOfUnit)
        shouldYield = IdleDeadline.timeRemaining() < 1
    }
    if (!nextWorkOfUnit && root) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
/**
 * 统一提交：最后一步 再全部渲染
 */
function commitRoot() {
    commitWork(root.child)
    root = null
}

function commitWork(fiber) {
    if (!fiber) return
    let fiberParent = fiber.parent
    while(!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.dom) fiberParent.dom.append(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

const createDom = (type) => {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
const updateProps = (dom, props) => {
    Object.keys(props).forEach(key => {

        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}
const initChildren = (children, parent) => {
    let prevChild = null
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            parent,
            dom: null, // 当前节点的dom
            child: null, // 子节点
            sibling: null // 兄弟节点
        }
        if (index === 0) {
            newFiber.parent.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }

        prevChild = newFiber
    })
}
/**
 * 当前的rander逻辑
 * @returns 
 */
const preformWorkOfUnit = (fiber) => {
    const isFunctionComponent = typeof fiber.type === 'function'
    if (!isFunctionComponent) {
        // 创建dom
        if (!fiber.dom) {
            const dom = fiber.dom = createDom(fiber.type)

            updateProps(dom, fiber.props)
        }
    }
    const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children

    // 建立关系，转换链表，创立指针
    initChildren(children, fiber)
    // 返回子节点
    if (fiber.child) return fiber.child
    // 返回兄弟节点
    // if (fiber.sibling) return fiber.sibling
    // 返回叔节点
    let nextFiber = fiber
    while(nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
    // return fiber.parent?.sibling
}

requestIdleCallback(workLoop)
const React = {
    createTextNode,
    createElement,
    render
}

export default React;