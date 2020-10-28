import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Bar(props) {
  if (props.highlightBar === true) {
    return (
      <li style={{ float: "left" }}>
        <div>{props.value}</div>
        <div
          className="bar"
          style={{
            height: props.value * 10 + "px",
            backgroundColor: "#f54266",
          }}
        ></div>
      </li>
    );
  } else {
    return (
      <li style={{ float: "left" }}>
        <div>{props.value}</div>
        <div className="bar" style={{ height: props.value * 10 + "px" }}></div>
      </li>
    );
  }
}

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingSteps: [
        {
          bars: [],
        },
      ],
      unsortedBarVals: [...Array(10)].map(
        () => Math.floor(Math.random() * 15) + 1
      ),
      resultBarVals: null,
      currStep: 0,
      maxStep: 0,
      sortingStepsEmpty: true,
      currFirstPosition: 0,
      currSecondPosition: 0,
    };
  }

  componentDidMount() {
    if (this.sortingStepsEmpty !== []) {
      setInterval(() => this.nextStep(), 250);
    }
  }

  nextStep() {
    if (this.state.currStep < this.state.maxStep) {
      this.setState({
        currStep: this.state.currStep + 1,
        resultBarVals: this.state.sortingSteps[this.state.currStep + 1].bars,
        firstPosition: this.state.sortingSteps[this.state.currStep + 1]
          .firstPosition,
        secondPosition: this.state.sortingSteps[this.state.currStep + 1]
          .secondPosition,
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

    sortingSteps.push({
      bars: unsortedBarVals.slice(),
      firstPosition: 0,
      secondPosition: 1,
    });

    for (let i = 0; i < unsortedBarVals.length - 1; i++) {
      for (let j = i; j < unsortedBarVals.length - 1 - i; j++) {
        if (unsortedBarVals[j] > unsortedBarVals[j + 1]) {
          let temp = unsortedBarVals[j];
          unsortedBarVals[j] = unsortedBarVals[j + 1];
          unsortedBarVals[j + 1] = temp;
          i = -1;
        }
        maxStep++;
        sortingSteps.push({
          bars: unsortedBarVals.slice(),
          firstPosition: j,
          secondPosition: j + 1,
        });
      }
    }

    this.setState({
      sortingSteps: sortingSteps,
      maxStep: maxStep,
      sortingStepsEmpty: false,
    });
  }
  render() {
    let barVals = [];
    const firstPosition = this.state.firstPosition;
    const secondPosition = this.state.secondPosition;
    let highlightBar = false;
    if (this.state.resultBarVals) {
      barVals = this.state.resultBarVals;
    } else {
      barVals = this.state.unsortedBarVals;
    }
    const bars = barVals.map((value, index) => {
      if (index === firstPosition || index === secondPosition) {
        highlightBar = true;
      } else {
        highlightBar = false;
      }

      return (
        <Bar key={"bar" + index} value={value} highlightBar={highlightBar} />
      );
    });
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
