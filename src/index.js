import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Bar(props) {
  let style = {
    height: props.value * 10 + "px",
    backgroundColor: "#3492eb", // Blue
  };
  if (props.highlightBar === true) {
    style.backgroundColor = "#f54266"; // Red
    if (props.isSwap) {
      style.backgroundColor = "#42f575"; // Green
    }
  }

  return (
    <li>
      <div>{props.value}</div>
      <div className="bar" style={style}></div>
    </li>
  );
}

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingSteps: [
        {
          bars: getRandomNums(),
          pos1: 0,
          pos2: 1,
          currStep: 0,
        },
      ],
      resultBarVals: null,
      stepIndex: 0,
      maxStep: 0,
      isSwap: false,
    };
  }

  componentDidMount() {
    const time = 150;
    setInterval(() => {
      if (this.state.stepIndex < this.state.maxStep) {
        this.nextStep();
      }
    }, time);
  }

  nextStep() {
    const stepIndex = this.state.stepIndex + 1;
    const currBars = this.state.sortingSteps[stepIndex];
    this.setState({
      stepIndex: stepIndex,
      resultBarVals: currBars.bars,
      pos1: currBars.pos1,
      pos2: currBars.pos2,
      isSwap: currBars.isSwap,
    });
  }

  bubbleSort(barVals) {
    let sortingSteps = [];
    let isSwap = false;
    let currStep = -1;
    for (let i = 0; i < barVals.length - 1; i++) {
      for (let j = 0; j < barVals.length - 1 - i; j++) {
        if (j === barVals.length - 1 - i) {
          break;
        }

        if (barVals[j] > barVals[j + 1]) {
          currStep++;
          sortingSteps.push({
            bars: barVals.slice(),
            pos1: j,
            pos2: j + 1,
            isSwap: isSwap,
            currStep: currStep,
          });

          let temp = barVals[j];
          barVals[j] = barVals[j + 1];
          barVals[j + 1] = temp;
          isSwap = true;
        }

        currStep++;
        sortingSteps.push({
          bars: barVals.slice(),
          pos1: j,
          pos2: j + 1,
          isSwap: isSwap,
          currStep: currStep,
        });

        isSwap = false;
      }
    }
    return sortingSteps;
  }

  handleClick() {
    let isSwap = false;
    let maxStep = 0;
    let sortingSteps = this.state.sortingSteps.slice();
    sortingSteps = this.bubbleSort(sortingSteps[0].bars);
    maxStep = sortingSteps[sortingSteps.length - 1].currStep;

    this.setState({
      sortingSteps: sortingSteps,
      maxStep: maxStep,
    });
  }
  render() {
    const stepIndex = this.state.stepIndex;
    const maxStep = this.state.maxStep;
    const pos1 = this.state.pos1;
    const pos2 = this.state.pos2;
    let resultBarVals = this.state.resultBarVals;
    let highlightBar = false;
    let isSwap = this.state.isSwap;
    if (!resultBarVals) {
      resultBarVals = this.state.sortingSteps[0].bars;
    }
    const bars = resultBarVals.map((value, index) => {
      if (stepIndex !== maxStep && (index === pos1 || index === pos2)) {
        highlightBar = true;
      } else {
        highlightBar = false;
      }

      return (
        <Bar
          key={"bar" + index}
          value={value}
          highlightBar={highlightBar}
          isSwap={isSwap}
        />
      );
    });

    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              unsortedBarVals: getRandomNums(),
              resultBarVals: null,
              stepIndex: 0,
              maxStep: 0,
              isSwap: false,
            });
          }}
        >
          Random
        </button>
        <button
          onClick={() => {
            this.setState({
              resultBarVals: null,
              stepIndex: 0,
              maxStep: 0,
              isSwap: false,
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

function getRandomNums() {
  return [...Array(10)].map(() => Math.floor(Math.random() * 15) + 1);
}
