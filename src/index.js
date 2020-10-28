import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Bar(props) {
  let style = {
    height: props.value * 10 + "px",
    backgroundColor: "#3492eb",
  };
  if (props.highlightBar === true) {
    style.backgroundColor = "#f54266";
    if (props.isSwap) {
      style.backgroundColor = "#42f575";
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
          bars: [],
          stepNum: 0,
          firstPosition: 0,
          secondPosition: 0,
        },
      ],
      unsortedBarVals: getRandomNums(),
      resultBarVals: null,
      currStep: 0,
      maxStep: 0,
      sortingStepsEmpty: true,
      currFirstPosition: 0,
      currSecondPosition: 0,
      isSwap: false,
    };
  }

  componentDidMount() {
    const time = 150;
    setInterval(() => {
      if (this.state.currStep < this.state.maxStep) {
        this.nextStep();
      }
    }, time);
  }

  nextStep() {
    const currStep = this.state.currStep + 1;
    const currBars = this.state.sortingSteps[currStep];
    this.setState({
      currStep: currStep,
      resultBarVals: currBars.bars,
      firstPosition: currBars.firstPosition,
      secondPosition: currBars.secondPosition,
      isSwap: currBars.isSwap,
    });
  }

  handleClick() {
    let unsortedBarVals = this.state.unsortedBarVals.slice();
    let sortingSteps = [];
    let maxStep = 0;
    let isSwap = false;

    sortingSteps.push({
      bars: unsortedBarVals.slice(),
      firstPosition: 0,
      secondPosition: 1,
      isSwap: isSwap,
    });

    for (let i = 0; i < unsortedBarVals.length - 1; i++) {
      for (let j = 0; j < unsortedBarVals.length - 1 - i; j++) {
        if (j === unsortedBarVals.length - 1 - i) {
          break;
        }

        if (unsortedBarVals[j] > unsortedBarVals[j + 1]) {
          maxStep++;
          sortingSteps.push({
            bars: unsortedBarVals.slice(),
            firstPosition: j,
            secondPosition: j + 1,
            isSwap: isSwap,
          });

          let temp = unsortedBarVals[j];
          unsortedBarVals[j] = unsortedBarVals[j + 1];
          unsortedBarVals[j + 1] = temp;
          isSwap = true;
        }

        maxStep++;
        sortingSteps.push({
          bars: unsortedBarVals.slice(),
          firstPosition: j,
          secondPosition: j + 1,
          isSwap: isSwap,
        });

        isSwap = false;
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
    let isSwap = this.state.isSwap;
    if (this.state.resultBarVals) {
      barVals = this.state.resultBarVals;
    } else {
      barVals = this.state.unsortedBarVals;
    }
    const bars = barVals.map((value, index) => {
      if (
        this.state.currStep !== this.state.maxStep &&
        (index === firstPosition || index === secondPosition)
      ) {
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
              currStep: 0,
              maxStep: 0,
              sortingStepsEmpty: true,
              currFirstPosition: 0,
              currSecondPosition: 0,
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
              currStep: 0,
              maxStep: 0,
              sortingStepsEmpty: true,
              currFirstPosition: 0,
              currSecondPosition: 0,
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
