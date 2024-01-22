/**@jsx CReact.createElement */
import CReact from "./core/React.js";
let count = 10;
const props = {
    id: 'das'
}
function Counter ({ num }) {
    function addNum () {
        // console.log('addNum')
        count++
        props.id = 'ads' + count
        CReact.update()
    }
    return <div { ...props }>
                Counter: {count}
                <button onClick={addNum}>
                    点击
                </button>
            </div>
}
let num = 0
const App =function (){

  

    return <div>
        hello word!
        <Counter num={num}/>
    </div>
}
export default App;