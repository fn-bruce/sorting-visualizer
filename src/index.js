import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./index.css";

function Bar(props) {
  let style = {
    height: props.value * 10 + "px",
    backgroundColor: "#2782ff", // Blue
  };
  if (props.highlightBar === true) {
    style.backgroundColor = "#db0138"; // Red
    if (props.isSwap) {
      style.backgroundColor = "#000000"; // Green
    }
  }

  if (props.bar.isSorted) {
    style.backgroundColor = "#9b00b8"; // Purple
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
          currStep: 0,
        },
      ],
      resultBarVals: null,
      stepIndex: 0,
      maxStep: 0,
      isSwap: false,
      barLength: 10,
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
      isSwap: currBars.isSwap,
    });
  }

  bubbleSort(bars) {
    let sortingSteps = [];
    let isSwap = false;
    let currStep = 1;
    for (let i = 0; i < bars.length - 1; i++) {
      for (let j = 0; j < bars.length - i; j++) {
        isSwap = false;
        if (j === bars.length - 1 - i) {
          bars[j].isSorted = true;
          insertStep(getHighlightedBars(bars, j, j + 1), isSwap, currStep++);

          break;
        }

        if (bars[j].barVal > bars[j + 1].barVal) {
          insertStep(getHighlightedBars(bars, j, j + 1), isSwap, currStep++);

          let temp = bars[j];
          bars[j] = bars[j + 1];
          bars[j + 1] = temp;
          isSwap = true;
        }

        insertStep(getHighlightedBars(bars, j, j + 1), isSwap, currStep++);
      }
    }

    function getHighlightedBars(bars, index1, index2) {
      return JSON.parse(
        JSON.stringify(
          bars.map((bar, index) => {
            if (index === index1 || index === index2) {
              bar.isHighlighted = true;
            } else {
              bar.isHighlighted = false;
            }
            return bar;
          })
        )
      );
    }

    function getSortedBars(bars, index1, index2) {
      return JSON.parse(
        JSON.stringify(
          bars.map((value, index) => {
            if (index === index1 || index === index2) {
              value.isSorted = true;
            }
            return value;
          })
        )
      );
    }

    function insertStep(bars, isSwap, currStep) {
      sortingSteps.push({
        bars: bars,
        isSwap: isSwap,
        currStep: currStep,
      });
    }

    insertStep(getSortedBars(bars, 0, 1), false, currStep++);
    this.doSortingAnimation(sortingSteps, currStep);
    return sortingSteps;
  }

  doMergeSort(bars) {
    let sortingSteps = [];
    let currStep = 0;
    mergeSort(JSON.parse(JSON.stringify(bars)));

    function mergeSort(arr) {
      if (arr.length === 1) {
        return arr;
      }

      let arr1 = arr.slice(0, Math.ceil(arr.length / 2));
      let arr2 = arr.slice(Math.ceil(arr.length / 2), arr.length);

      arr1 = mergeSort(JSON.parse(JSON.stringify(arr1)));
      arr2 = mergeSort(JSON.parse(JSON.stringify(arr2)));

      return merge(
        JSON.parse(JSON.stringify(arr1)),
        JSON.parse(JSON.stringify(arr2))
      );
    }

    function merge(arr1, arr2) {
      const before = JSON.parse(JSON.stringify(arr1.concat(arr2)));
      let result = [];
      while (arr1.length > 0 && arr2.length > 0) {
        if (arr1[0].barVal > arr2[0].barVal) {
          result.push(arr2[0]);
          arr2.shift();
        } else {
          result.push(arr1[0]);
          arr1.shift();
        }
      }

      while (arr1.length > 0) {
        result.push(arr1[0]);
        arr1.shift();
      }

      while (arr2.length > 0) {
        result.push(arr2[0]);
        arr2.shift();
      }

      result = result.map((value, index) => ({
        index: before[index].index,
        barVal: value.barVal,
        isSorted: value.isSorted,
      }));

      sortingSteps.push({
        bars: JSON.parse(
          JSON.stringify(
            bars.map((value) => {
              for (let i = 0; i < result.length; i++) {
                if (value.index === result[i].index) {
                  return {
                    index: value.index,
                    barVal: result[i].barVal,
                    isSorted: value.isSorted,
                  };
                }
              }

              return value;
            })
          )
        ),
        currStep: currStep++,
      });

      return result;
    }

    return sortingSteps;
  }

  doSortingAnimation(sortingSteps, currStep) {
    // Reset all bars to default color
    sortingSteps.push({
      bars: JSON.parse(
        JSON.stringify(
          sortingSteps[sortingSteps.length - 1].bars.map((bar) => ({
            barVal: bar.barVal,
            isSorted: false,
          }))
        )
      ),
      isSwap: false,
      currStep: currStep++,
    });

    for (let i = 0; i < this.state.barLength; i++) {
      sortingSteps.push({
        bars: JSON.parse(
          JSON.stringify(
            sortingSteps[sortingSteps.length - 1].bars.map((bar, index) => {
              let isSorted = false;

              if (index <= i) {
                isSorted = true;
              }

              return {
                barVal: bar.barVal,
                isSorted: isSorted,
              };
            })
          )
        ),
        isSwap: false,
        currStep: currStep++,
      });
    }

    // Reset all bars to default color
    sortingSteps.push({
      bars: JSON.parse(
        JSON.stringify(
          sortingSteps[sortingSteps.length - 1].bars.map((bar) => ({
            barVal: bar.barVal,
            isSorted: false,
          }))
        )
      ),
      isSwap: false,
      currStep: currStep++,
    });
  }

  handleClick(sortType) {
    const unsortedBarVals = JSON.parse(
      JSON.stringify(this.state.sortingSteps[0].bars)
    );
    let sortingSteps = this.state.sortingSteps;
    if (sortType === "Bubble Sort") {
      sortingSteps = sortingSteps.concat(
        JSON.parse(JSON.stringify(this.bubbleSort(unsortedBarVals)))
      );
    } else if (sortType === "Merge Sort") {
      sortingSteps = sortingSteps.concat(
        JSON.parse(JSON.stringify(this.doMergeSort(unsortedBarVals)))
      );
    }

    const maxStep = sortingSteps[sortingSteps.length - 1].currStep;
    this.setState({
      sortingSteps: sortingSteps,
      maxStep: maxStep,
    });
  }

  render() {
    let resultBarVals = this.state.resultBarVals;
    let isSwap = this.state.isSwap;
    if (!resultBarVals) {
      resultBarVals = this.state.sortingSteps[0].bars;
    }
    const bars = resultBarVals.map((bar, index) => {
      return (
        <Bar
          key={"bar" + index}
          bar={bar}
          value={bar.barVal}
          highlightBar={bar.isHighlighted}
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
          bubbleSort={() => this.handleClick("Bubble Sort")}
          mergeSort={() => this.handleClick("Merge Sort")}
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
      <Button variant="contained" onClick={props.bubbleSort}>
        Bubble Sort
      </Button>
      <Button variant="contained" onClick={props.mergeSort}>
        Merge Sort
      </Button>
    </div>
  );
}

ReactDOM.render(<Sorter />, document.getElementById("root"));

function getRandomNums() {
  return [...Array(10)].map((_, index) => ({
    index: index,
    barVal: Math.floor(Math.random() * 15) + 1,
    isSorted: false,
    isHighlighted: false,
  }));
}
