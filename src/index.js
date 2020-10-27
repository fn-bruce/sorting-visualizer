import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Bar(props) {
  return (
    <li style={{ float: "left" }}>
      <div>{props.value}</div>
      <div className="bar" style={{ height: props.value * 10 + "px" }}></div>
    </li>
  );
}

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingSteps: [],
      unsortedBarVals: [...Array(10)].map(
        () => Math.floor(Math.random() * 15) + 1
      ),
      resultBarVals: null,
      currStep: 0,
      maxStep: 0,
    };
  }

  componentDidMount() {
    if (this.state.sortingSteps !== []) {
      setInterval(() => this.nextStep(), 250);
    }
  }

  nextStep() {
    if (this.state.currStep < this.state.maxStep) {
      this.setState({
        currStep: this.state.currStep + 1,
        resultBarVals: this.state.sortingSteps[this.state.currStep + 1],
      });
    }
  }

  handleClick() {
    let unsortedBarVals = this.state.unsortedBarVals.slice();
    let sortingSteps = this.state.sortingSteps.slice(
      0,
      this.state.sortingSteps.length - 1
    );
    let maxStep = this.state.maxStep;

    sortingSteps.push(unsortedBarVals.slice());

    for (let i = 0; i < unsortedBarVals.length - 1; i++) {
      for (let j = i; j < unsortedBarVals.length - 1 - i; j++) {
        if (unsortedBarVals[j] > unsortedBarVals[j + 1]) {
          let temp = unsortedBarVals[j];
          unsortedBarVals[j] = unsortedBarVals[j + 1];
          unsortedBarVals[j + 1] = temp;
          sortingSteps.push(unsortedBarVals.slice());
          maxStep++;
          i = -1;
        }
      }
    }

    this.setState({
      sortingSteps: sortingSteps,
      maxStep: maxStep,
    });
  }
  render() {
    let barVals = [];
    if (this.state.resultBarVals) {
      barVals = this.state.resultBarVals;
    } else {
      barVals = this.state.unsortedBarVals;
    }
    const bars = barVals.map((value, index) => (
      <Bar key={"bar" + index} value={value} />
    ));
    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              unsortedBarVals: [...Array(10)].map(
                () => Math.floor(Math.random() * 15) + 1
              ),
              resultBarVals: null,
            });
          }}
        >
          Random
        </button>
        <button
          onClick={() => {
            this.setState({
              resultBarVals: this.state.unsortedBarVals,
            });
          }}
        >
          Revert
        </button>
        <button
          onClick={() => {
            this.handleClick();
          }}
        >
          Sort
        </button>
        <ul>{bars}</ul>
      </div>
    );
  }
}

ReactDOM.render(<Sorter />, document.getElementById("root"));
