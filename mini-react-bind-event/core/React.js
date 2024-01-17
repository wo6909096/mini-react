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
// work in progress
let wipRoot = null
const render = (el, container) => {
    wipRoot = {
        dom: container,
        props: {
            children: [el]
        }
    }
    nextWorkOfUnit = wipRoot
}

let nextWorkOfUnit = null
const workLoop = (IdleDeadline) => {

    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = preformWorkOfUnit(nextWorkOfUnit)
        shouldYield = IdleDeadline.timeRemaining() < 1
    }
    if (!nextWorkOfUnit && wipRoot) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
/**
 * 统一提交：最后一步 再全部渲染
 */
function commitRoot() {
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) return
    let fiberParent = fiber.parent
    while(!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    switch (fiber.effectTag) {
        case 'update':
            updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
            break;
        case 'placement':
            if (fiber.dom) fiberParent.dom.append(fiber.dom)
            break;
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

const createDom = (type) => {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
const updateProps = (dom, nextProps, prevProps) => {
    // Object.keys(nextProps).forEach(key => {

    //     if (key !== 'children') {
    //         if (key.startsWith('on')) {
    //             const eventName = key.slice(2).toLocaleLowerCase()
    //             dom.addEventListener(eventName, nextProps[key])
    //         } else {
    //             dom[key] = nextProps[key]
    //         }
    //     }
    // })
    // 1. old 有 new 无 删除
    Object.keys(prevProps).forEach(key => {
        if (key !== 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key)
            }
        }
    })
    // 2. new 有 old 没有 添加
    // 3. new 有 old 有 修改
    Object.keys(nextProps).forEach(key => {
        if (key !== 'children') {
            if (prevProps[key] !== nextProps[key]) {
                if (key.startsWith('on')) {
                    const eventName = key.slice(2).toLocaleLowerCase()
                    dom.removeEventListener(eventName, prevProps[key])
                    dom.addEventListener(eventName, nextProps[key])
                } else {
                    dom[key] = nextProps[key]
                }
            }
        }
    })
}
// react 概念 reconcile 调和 协调一致
const reconcileChildren = (fiber, children) => {
    let oldFiber = fiber.alternate?.child

    let prevChild = null
    children.forEach((child, index) => {

        const isSameType = oldFiber && oldFiber.type === child.type
        let newFiber
        if (isSameType) {
            // update
            // newFiber.alternate = oldFiber
            // newFiber.dom = oldFiber.dom
            // newFiber.effectTag = 'update'
            newFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                dom: oldFiber.dom, // 当前节点的dom
                child: null, // 子节点
                sibling: null, // 兄弟节点
                alternate: oldFiber,
                effectTag: 'update'
            }
        } else {
            // create
            newFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                dom: null, // 当前节点的dom
                child: null, // 子节点
                sibling: null, // 兄弟节点
                effectTag: 'placement'
            }

        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling
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

            updateProps(dom, fiber.props, {})
        }
    }
    const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children

    // 建立关系，转换链表，创立指针
    reconcileChildren(fiber, children)
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
let currentRoot = null
const update = () => {
    wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot
    }
    nextWorkOfUnit = wipRoot
}
const React = {
    createTextNode,
    createElement,
    render,
    update
}

export default React;