/**@jsx CReact.createElement */
import CReact from "./core/React.js";
import App from './app.jsx';
import ReactDOM from './core/ReactDOM.js';

ReactDOM.createRoot(document.querySelector('#root')).render(<App />)