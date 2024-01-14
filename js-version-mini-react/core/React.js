/**
 * 1. 使用object 描述 dom树
 * 2. 根据虚拟dom 创建 dom
 * 2. api对齐react
 * {
 *      type: string;
 *      props: {
 *          children?: [];
 *      };
 * }
 */
 function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}
 function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'string' ? createTextNode(child) : child),
        }
    }
}
// const textEl = createTextNode('hello word!')

// const el = createElement('div', {id: 'app'}, textEl)


 function render (el = {}, container) {
    const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

    // dom props
    const props = el.props || {}
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })
    // children
    if (props.children) {
        el.props.children.forEach(child => {
            render(child, dom)
        })
    }
    // append dom
    container.append(dom)
}

const React = {
    createTextNode,
    createElement,
    render
}
export default React