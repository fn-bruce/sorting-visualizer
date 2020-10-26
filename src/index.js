import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Bar(props) {
  return <li className="bar" style={{ height: props.value + "px" }}></li>;
}

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unsortedBarVals: [...Array(10)].map(
        () => Math.floor(Math.random() * 25) * 10
      ),
      resultBarVals: null,
    };
  }

  handleClick() {
    let resultBarVals = this.state.unsortedBarVals.slice();
    resultBarVals = bubbleSort(resultBarVals);
    this.setState({
      resultBarVals: resultBarVals,
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

function bubbleSort(numList) {
  for (let i = 0; i < numList.length - 1; i++) {
    for (let j = i; j < numList.length - 1 - i; j++) {
      if (numList[j] > numList[j + 1]) {
        let temp = numList[j];
        numList[j] = numList[j + 1];
        numList[j + 1] = temp;
        i = -1;
      }
    }
  }
  return numList;
}
