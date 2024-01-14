import React from "../core/React.js"
import { it, expect, describe } from 'vitest'

describe('createElement', () => {
    it('should return vdom for element', () => {
        const el = React.createElement('div', { id: 'el' }, 'Hello word!')
        expect(el).toMatchFileSnapshot(`
        {
            type: 'div',
            props: {
                id: 'el',
                children: [
                    {
                        type: 'TEXT_ELEMENT',
                        props: {
                            children: [
                                {
                                    nodeValue: 'Hello word!',
                                    children: []
                                }
                            ]
                        }
                    }
                ]
            }
        }
        `)
        // expect(el).toEqual({
        //     type: 'div',
        //     props: {
        //         id: 'el',
        //         children: [
        //             {
        //                 type: 'TEXT_ELEMENT',
        //                 props: {
        //                     children: [
        //                         {
        //                             nodeValue: 'Hello word!',
        //                             children: []
        //                         }
        //                     ]
        //                 }
        //             }
        //         ]
        //     }            
        // })
    })
})