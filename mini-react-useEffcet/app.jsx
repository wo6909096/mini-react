import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  function handleClick() {
    setCount((c) => c + 1);
    // setBar((s) => s + "bar");
    setBar("xxx");
  }

  React.useEffect(() => {
    return () => {
      console.log("useEffect");
    };
  }, []);

  React.useEffect(() => {
    return () => {
      console.log("useEffect 22");
    };
  }, [count]);

  React.useEffect(() => {
    return () => {
      console.log("useEffect 333");
    };
  }, [count]);

  return (
    <div>
      <h1>foo</h1>
      <div>{count}</div>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div>
      hello mini-react
      <Foo />
    </div>
  );
}

export default App;