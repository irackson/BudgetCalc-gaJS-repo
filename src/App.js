import React, { Component } from "react";
import "./App.css";
import Input from "./components/Input.js";
import Output from "./components/Output.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  updateData = (data) => {
    this.setState({ data: data });
  };

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1>Budget Advisor</h1>
        </header>
        <main>
          <Input updateData={this.updateData} />
          <Output data={this.state.data} />
        </main>
      </div>
    );
  }
}

export default App;
