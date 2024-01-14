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
            children: children.map(child => typeof child === 'string' ? createTextNode(child) : child)
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
const render = (el, container) => {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
}

let nextWorkOfUnit = null
const workLoop = (IdleDeadline) => {

    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = preformWorkOfUnit(nextWorkOfUnit)
        shouldYield = IdleDeadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
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
const initChildren = (fiber) => {
    const children = fiber.props.children
    let prevChild = null
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            parent: fiber,
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
    // 创建dom
    if (!fiber.dom) {
        const dom = fiber.dom = createDom(fiber.type)

        fiber.parent.dom.append(dom)

        updateProps(dom, fiber.props)
    }
    // 建立关系，转换链表，创立指针
    initChildren(fiber)
    // 返回子节点
    if (fiber.child) return fiber.child
    // 返回兄弟节点
    if (fiber.sibling) return fiber.sibling
    // 返回叔节点
    return fiber.parent?.sibling
}

requestIdleCallback(workLoop)
const React = {
    createTextNode,
    createElement,
    render
}

export default React;