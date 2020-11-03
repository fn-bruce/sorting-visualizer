import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
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

  if (props.bar.isSorted) {
    style.backgroundColor = "#8332a8";
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
    const time = 100;
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

  bubbleSort(bars) {
    let sortingSteps = [];
    let isSwap = false;
    let currStep = -1;
    for (let i = 0; i < bars.length - 1; i++) {
      for (let j = 0; j < bars.length - i; j++) {
        if (j === bars.length - 1 - i) {
          bars[j].isSorted = true;
          currStep++;

          sortingSteps.push({
            bars: JSON.parse(JSON.stringify(bars)),
            pos1: j,
            pos2: j + 1,
            isSwap: isSwap,
            currStep: currStep,
          });
          break;
        }

        if (bars[j].barVal > bars[j + 1].barVal) {
          currStep++;
          sortingSteps.push({
            bars: JSON.parse(JSON.stringify(bars)),
            pos1: j,
            pos2: j + 1,
            isSwap: isSwap,
            currStep: currStep,
          });

          let temp = bars[j];
          bars[j] = bars[j + 1];
          bars[j + 1] = temp;
          isSwap = true;
        }

        currStep++;
        sortingSteps.push({
          bars: JSON.parse(JSON.stringify(bars)),
          pos1: j,
          pos2: j + 1,
          isSwap: isSwap,
          currStep: currStep,
        });

        isSwap = false;
      }
    }
    bars[0].isSorted = true;
    bars[1].isSorted = true;
    currStep++;
    sortingSteps.push({
      bars: JSON.parse(JSON.stringify(bars)),
      pos1: 0,
      pos2: 1,
      isSwap: false,
      currStep: currStep,
    });

    currStep++;
    sortingSteps.push({
      bars: JSON.parse(JSON.stringify(bars)),
      pos1: 0,
      pos2: 1,
      isSwap: false,
      currStep: currStep,
    });

    return sortingSteps;
  }

  handleClick() {
    const unsortedBarVals = JSON.parse(
      JSON.stringify(this.state.sortingSteps[0].bars)
    );
    const sortingSteps = this.state.sortingSteps.concat(
      JSON.parse(JSON.stringify(this.bubbleSort(unsortedBarVals)))
    );
    const maxStep = sortingSteps[sortingSteps.length - 1].currStep;
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
    const bars = resultBarVals.map((bar, index) => {
      if (stepIndex !== maxStep && (index === pos1 || index === pos2)) {
        highlightBar = true;
      } else {
        highlightBar = false;
      }

      return (
        <Bar
          key={"bar" + index}
          bar={bar}
          value={bar.barVal}
          highlightBar={highlightBar}
          isSwap={isSwap}
        />
      );
    });

    return (
      <div>
        <ContainedButtons
          onRandom={() =>
            this.setState({
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
            })
          }
          onRevert={() =>
            this.setState({
              resultBarVals: null,
              stepIndex: 0,
              maxStep: 0,
              isSwap: false,
            })
          }
          onClick={() => this.handleClick()}
        />
        <ul>{bars}</ul>
      </div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function ContainedButtons(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Button variant="contained" onClick={props.onRandom}>
        Random
      </Button>
      <Button variant="contained" onClick={props.onRevert}>
        Revert
      </Button>
      <Button variant="contained" onClick={props.onClick}>
        Sort
      </Button>
    </div>
  );
}

ReactDOM.render(<Sorter />, document.getElementById("root"));

function getRandomNums() {
  return [...Array(10)].map(() => ({
    barVal: Math.floor(Math.random() * 15) + 1,
    isSorted: false,
  }));
}
