import React from "./React.js";
// const dom = document.createElement(el.type);
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// render(App, document.querySelector('#root'))

// 对齐react api
const ReactDOM = {
    createRoot(container) {
        return {
            render (el) {
                React.render(el, container)
            }
        }
    }
}
export default ReactDOM;
