/**@jsx CReact.createElement */
import CReact from "./core/React.js";
function Counter ({ num }) {
    return <div>Counter: {num} </div>
}

const App =function (){
    return <div>
        hello word!
        <Counter num={10}/>
        <Counter num={20}/>
    </div>
}
export default App;