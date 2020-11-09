import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./index.css";

const DEFAULT_COLOR = "#2782ff"; // Blue
const HIGHLIGHT_COLOR = "#db0138"; // Red
const SWAP_COLOR = "#000000"; // Green
const SORTED_COLOR = "#9b00b8"; // Purple

function Bar(props) {
  let style = {
    height: props.value * 10 + "px",
    backgroundColor: DEFAULT_COLOR,
  };
  if (props.bar.isSorted) {
    style.backgroundColor = SORTED_COLOR;
  } else if (props.highlightBar === true) {
    style.backgroundColor = HIGHLIGHT_COLOR;
    if (props.isSwap) {
      style.backgroundColor = SWAP_COLOR;
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

    const barsLength = 10;
    this.state = {
      sortingSteps: [
        {
          bars: getRandomNums(barsLength),
          currStep: 0,
        },
      ],
      barLength: barsLength,
      resultBarVals: null,
      stepIndex: 0,
      isSwap: false,
      doSort: false,
    };
  }

  componentDidMount() {
    const time = 100;
    this.animateSortID = setInterval(() => {
      if (this.state.doSort) {
        this.nextStep();
      }
    }, time);
  }

  componentWillMount() {
    clearInterval(this.animateSortID);
  }

  nextStep() {
    const stepIndex = this.state.stepIndex + 1;
    const currBars = this.state.sortingSteps[stepIndex];
    const numSortingSteps = this.state.sortingSteps.length;
    this.setState({
      stepIndex: stepIndex,
      resultBarVals: currBars.bars,
      isSwap: currBars.isSwap,
      doSort: stepIndex === numSortingSteps - 1 ? false : true,
    });
  }

  bubbleSort(bars) {
    let sortingSteps = [];
    let isSwap = false;
    let currStep = 1;
    const getHighlightedBars = (bars, index1, index2) => {
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
    };
    const getSortedBars = (bars, index1, index2) => {
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
    };

    for (let i = 0; i < bars.length - 1; i++) {
      for (let j = 0; j < bars.length - i; j++) {
        isSwap = false;
        if (j === bars.length - 1 - i) {
          bars[j].isSorted = true;
          sortingSteps.push({
            bars: getHighlightedBars(bars, j, j + 1),
            isSwap: isSwap,
            currStep: currStep++,
          });
          break;
        }

        if (bars[j].barVal > bars[j + 1].barVal) {
          sortingSteps.push({
            bars: getHighlightedBars(bars, j, j + 1),
            isSwap: isSwap,
            currStep: currStep++,
          });
          let temp = bars[j];
          bars[j] = bars[j + 1];
          bars[j + 1] = temp;
          isSwap = true;
        }
        sortingSteps.push({
          bars: getHighlightedBars(bars, j, j + 1),
          isSwap: isSwap,
          currStep: currStep++,
        });
      }
    }

    sortingSteps.push({
      bars: getSortedBars(bars, 0, 1),
      isSwap: false,
      currStep: currStep++,
    });
    this.doSortingAnimation(sortingSteps, currStep);
    return sortingSteps;
  }

  mergeSort(bars) {
    let sortingSteps = [];
    function mergeSort(bars) {
      if (bars.length === 1) {
        return bars;
      }

      let bars1 = bars.slice(0, Math.ceil(bars.length / 2));
      let bars2 = bars.slice(Math.ceil(bars.length / 2), bars.length);

      bars1 = mergeSort(bars1);
      bars2 = mergeSort(bars2);

      return merge(bars1, bars2);
    }

    function merge(bars1, bars2) {
      let result = [];
      while (bars1.length > 0 && bars2.length > 0) {
        if (bars1[0].barVal > bars2[0].barVal) {
          result.push(bars2[0]);
          bars2.shift();
        } else {
          result.push(bars1[0]);
          bars1.shift();
        }
      }

      while (bars1.length > 0) {
        result.push(bars1[0]);
        bars1.shift();
      }

      while (bars2.length > 0) {
        result.push(bars2[0]);
        bars2.shift();
      }

      return result;
    }

    sortingSteps.push({
      bars: mergeSort(bars),
      currStep: 1,
    });
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
        JSON.parse(JSON.stringify(this.mergeSort(unsortedBarVals)))
      );
    }

    this.setState({
      sortingSteps: sortingSteps,
      doSort: true,
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
                  bars: getRandomNums(this.state.barLength),
                  currStep: 0,
                },
              ],
              resultBarVals: null,
              stepIndex: 0,
              isSwap: false,
            })
          }
          onRevert={() =>
            this.setState({
              sortingSteps: this.state.sortingSteps.slice(0, 1),
              resultBarVals: null,
              stepIndex: 0,
              isSwap: false,
              doSort: false,
            })
          }
          bubbleSort={() => this.handleClick("Bubble Sort")}
          mergeSort={() => this.handleClick("Merge Sort")}
          disabled={this.state.doSort}
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
      <Button
        variant="contained"
        onClick={props.onRandom}
        disabled={props.disabled}
      >
        Random
      </Button>
      <Button
        variant="contained"
        onClick={props.onRevert}
        disabled={props.disabled}
      >
        Revert
      </Button>
      <Button
        variant="contained"
        onClick={props.bubbleSort}
        disabled={props.disabled}
      >
        Bubble Sort
      </Button>
      <Button
        variant="contained"
        onClick={props.mergeSort}
        disabled={props.disabled}
      >
        Merge Sort
      </Button>
    </div>
  );
}

ReactDOM.render(<Sorter />, document.getElementById("root"));

function getRandomNums(length) {
  return [...Array(length)].map((_, index) => ({
    index: index,
    barVal: Math.floor(Math.random() * 15) + 1,
    isSorted: false,
    isHighlighted: false,
  }));
}
