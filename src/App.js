import React from "react";
import Mainplot from "./components/Mainplot";

import "./App.css";

function App() {
  const mainref = Mainplot();
  
  return (
    <div className="App">      
      <div class="splotContainer">
        <Mainplot />
      </div>    
    </div>
  );
}

export default App;
