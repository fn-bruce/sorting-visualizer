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
      sortedBarVals: null,
    };
  }

  handleClick() {
    let unsortedBarVals = this.state.unsortedBarVals;
    unsortedBarVals = bubbleSort(unsortedBarVals);
    this.setState({
      unsortedBarVals: unsortedBarVals,
    });
  }

  render() {
    let barVals = [];
    if (this.state.sortedBarVals) {
      barVals = this.state.sortedBarVals;
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
