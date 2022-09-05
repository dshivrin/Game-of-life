import { useEffect } from "react";
import Controls from "./Controls";
import "./Canvas.css";

const Canvas = (props: any) => {
  const {
    width = 1400,
    height = 500,
    cellSize = 10,
    deadColor = `#a8a7a6`,
    aliveColor = `#912620`,
    borderColor = "black",
  } = props;

  let canvas: any, ctx: any, intervalId: number;

  let activeArray: Array<Array<boolean>> = [];
  let inactiveArray: Array<Array<boolean>> = [];

  const arrayInitialization = (): void => {
    for (let i = 0; i < width; i++) {
      activeArray[i] = []; //initialize array on each
      for (let j = 0; j < height; j++) {
        activeArray[i][j] = false;
      }
    }
    inactiveArray = activeArray;
  };

  const arrayRandomize = () => {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        activeArray[i][j] = Math.random() > 0.5 ? true : false;
      }
    }
  };

  const fillArray = () => {
    var borderWidth = 1;
    var offset = borderWidth * 2;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        let color;
        if (activeArray[i][j]) color = aliveColor;
        else color = deadColor;
        if (!ctx) return; //just so TS won't complain

        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x - borderWidth,
          y - borderWidth,
          cellSize + offset,
          cellSize + offset
        );

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  };

  const updateLifeCycle = () => {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let new_state = updateCellValue(i, j);
        inactiveArray[i][j] = new_state;
      }
    }
    activeArray = inactiveArray;
  };

  const updateCellValue = (row: number, col: number) => {
    const total = countNeighbours(row, col);
    // cell with more than 4 or less then 3 neighbours dies. 1 => 0; 0 => 0
    if (total > 4 || total < 3) {
      return false;
    }
    // dead cell with 3 neighbours becomes alive. 0 => 1
    else if (activeArray[row][col] === false && total === 3) {
      return true;
    }
    // or returning its status back. 0 => 0; 1 => 1
    else {
      return activeArray[row][col];
    }
  };

  //todo: see if array of numbers (0 and 1) will work better for counting alive neighboors
  const countNeighbours = (row: number, col: number) => {
    let totalNeighbours = 0;
    totalNeighbours += +setCellValueHelper(row - 1, col - 1);
    totalNeighbours += +setCellValueHelper(row - 1, col);
    totalNeighbours += +setCellValueHelper(row - 1, col + 1);
    totalNeighbours += +setCellValueHelper(row, col - 1);
    totalNeighbours += +setCellValueHelper(row, col + 1);
    totalNeighbours += +setCellValueHelper(row + 1, col - 1);
    totalNeighbours += +setCellValueHelper(row + 1, col);
    totalNeighbours += +setCellValueHelper(row + 1, col + 1);
    return totalNeighbours;
  };

  const setCellValueHelper = (row: number, col: number) => {
    try {
      return activeArray[row][col];
    } catch {
      return false;
    }
  };

  const StartRandom = () => {
    arrayRandomize();
    fillArray();

    intervalId = window.setInterval(() => {
      updateLifeCycle();
      fillArray();
    }, 300);
  };

  const Stop = (intervalId: number) => {
    arrayInitialization();
    window.clearInterval(intervalId);
  };

  useEffect(() => {
    canvas = document.querySelector("canvas");
    canvas!.width = width;
    canvas!.height = height;
    ctx = canvas?.getContext("2d");

    //just to show the grid
    arrayInitialization();
    fillArray();

    //todo: optimize
    return () => {
      Stop(intervalId);
    };
  });

  return (
    <div>
      <canvas id="canvas"></canvas>
      <Controls OnStartClick={StartRandom} OnStoptClick={Stop} />
    </div>
  );
};

export default Canvas;
