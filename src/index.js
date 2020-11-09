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
    backgroundColor: props.color,
  };
  return (
    <li>
      <div>{props.value}</div>
      <div className="bar" style={style}></div>
    </li>
  );
}

function Bars(props) {
  const bars = props.bars.map((bar, index) => {
    return (
      <Bar key={"bar" + index} bar={bar} value={bar.barVal} color={bar.color} />
    );
  });
  return bars;
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
      doSort: false,
    };
  }

  componentDidMount() {
    const time = 100;
    this.animateSortID = setInterval(() => {
      if (this.state.doSort) {
        const stepIndex = this.state.stepIndex + 1;
        const currBars = this.state.sortingSteps[stepIndex];
        const numSortingSteps = this.state.sortingSteps.length;
        this.setState({
          stepIndex: stepIndex,
          resultBarVals: currBars.bars,
          doSort: stepIndex === numSortingSteps - 1 ? false : true,
        });
      }
    }, time);
  }

  componentWillUnmountMount() {
    clearInterval(this.animateSortID);
  }

  bubbleSort(bars) {
    let sortingSteps = [];
    let isSwap = false;
    let currStep = 1;
    const getHighlightedBars = (bars, index1, index2, isSwap) => {
      return JSON.parse(
        JSON.stringify(
          bars.map((bar, index) => {
            if (index === index1 || index === index2) {
              if (isSwap) {
                bar.color = SWAP_COLOR;
              } else {
                bar.color = HIGHLIGHT_COLOR;
              }
            } else if (bar.color !== SORTED_COLOR) {
              bar.color = DEFAULT_COLOR;
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
              value.color = SORTED_COLOR;
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
          bars = bars.map((bar, index) => {
            if (index < j) {
              bar.color = DEFAULT_COLOR;
            } else {
              bar.color = SORTED_COLOR;
            }
            return bar;
          });
          sortingSteps.push(
            JSON.parse(
              JSON.stringify({
                bars: bars,
                currStep: currStep++,
              })
            )
          );
          break;
        }

        if (bars[j].barVal > bars[j + 1].barVal) {
          sortingSteps.push({
            bars: getHighlightedBars(bars, j, j + 1, isSwap),
            currStep: currStep++,
          });
          let temp = bars[j];
          bars[j] = bars[j + 1];
          bars[j + 1] = temp;
          isSwap = true;
        }
        sortingSteps.push({
          bars: getHighlightedBars(bars, j, j + 1, isSwap),
          currStep: currStep++,
        });
      }
    }

    sortingSteps.push({
      bars: getSortedBars(bars, 0, 1),
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
      let bars = JSON.parse(JSON.stringify(bars1.concat(bars2)));

      // Bubble Sort
      for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
          if (bars[j].barVal > bars[j + 1].barVal) {
            let temp = JSON.parse(JSON.stringify(bars[j]));
            bars[j] = bars[j + 1];
            bars[j + 1] = temp;
          }
        }
      }
      return bars;
    }

    sortingSteps.push({
      bars: mergeSort(bars),
      currStep: 1,
    });
    return sortingSteps;
  }

  doSortingAnimation(sortingSteps, currStep) {
    const defaultBars = JSON.parse(
      JSON.stringify(
        sortingSteps[sortingSteps.length - 1].bars.map((bar) => ({
          barVal: bar.barVal,
          color: DEFAULT_COLOR,
        }))
      )
    );

    // Reset all bars to default color
    sortingSteps.push({
      bars: defaultBars,
      currStep: currStep++,
    });

    for (let i = 0; i < this.state.barLength; i++) {
      sortingSteps.push({
        bars: JSON.parse(
          JSON.stringify(
            sortingSteps[sortingSteps.length - 1].bars.map((bar, index) => {
              let color = DEFAULT_COLOR;

              if (index <= i) {
                color = SORTED_COLOR;
              }
              return {
                barVal: bar.barVal,
                color: color,
              };
            })
          )
        ),
        currStep: currStep++,
      });
    }

    // Reset all bars to default color
    sortingSteps.push({
      bars: defaultBars,
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
    if (!resultBarVals) {
      resultBarVals = this.state.sortingSteps[0].bars;
    }
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
            })
          }
          onRevert={() =>
            this.setState({
              sortingSteps: this.state.sortingSteps.slice(0, 1),
              resultBarVals: null,
              stepIndex: 0,
              doSort: false,
            })
          }
          bubbleSort={() => this.handleClick("Bubble Sort")}
          mergeSort={() => this.handleClick("Merge Sort")}
          disabled={this.state.doSort}
        />
        <ul>
          <Bars bars={resultBarVals} />
        </ul>
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
    color: DEFAULT_COLOR,
  }));
}
