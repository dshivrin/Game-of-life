import { useEffect } from "react";
import Controls from "./Controls";
import "./Canvas.css";

const Canvas = (props: any) => {
  const {
    width = 1400,
    height = 700,
    cellSize = 30,
    deadColor = `#a8a7a6`,
    aliveColor = `#912620`,
    borderColor = "black",
    borderWidth = 1,
  } = props;

  let canvas: any, ctx: any, intervalId: number, isRunning: boolean;

  let activeArray: Array<Array<number>> = [];
  let inactiveArray: Array<Array<number>> = [];

  const arrayInitialization = (): void => {
    for (let i = 0; i < width; i++) {
      activeArray[i] = []; //initialize array on each
      for (let j = 0; j < height; j++) {
        activeArray[i][j] = 0;
      }
    }
    inactiveArray = activeArray;
  };

  const arrayRandomize = () => {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        activeArray[i][j] = Math.random() > 0.5 ? 1 : 0;
      }
    }
  };

  const fillArray = () => {

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        let color;
        if (activeArray[i][j]) color = aliveColor;
        else color = deadColor;
        if (!ctx) return; //just so TS won't complain

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize-borderWidth, cellSize-borderWidth);
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
      return 0;
    }
    // dead cell with 3 neighbours becomes alive. 0 => 1
    else if (activeArray[row][col] === 0 && total === 3) {
      return 1;
    }
    // or returning its status back. 0 => 0; 1 => 1
    else {
      return activeArray[row][col];
    }
  };

  //todo: see if array of numbers (0 and 1) will work better for counting alive neighboors
  const countNeighbours = (row: number, col: number) => {
    let totalNeighbours = 0;
    totalNeighbours += setCellValueHelper(row - 1, col - 1);
    totalNeighbours += setCellValueHelper(row - 1, col);
    totalNeighbours += setCellValueHelper(row - 1, col + 1);
    totalNeighbours += setCellValueHelper(row, col - 1);
    totalNeighbours += setCellValueHelper(row, col + 1);
    totalNeighbours += setCellValueHelper(row + 1, col - 1);
    totalNeighbours += setCellValueHelper(row + 1, col);
    totalNeighbours += setCellValueHelper(row + 1, col + 1);
    return totalNeighbours;
  };

  const setCellValueHelper = (row: number, col: number) => {
    try {
      return activeArray[row][col];
    } catch {
      return 0;
    }
  };

  const start = (isRandom: boolean) => {
    isRunning = true;

    if (isRandom) {
      arrayRandomize();
      fillArray();
    }

    intervalId = window.setInterval(() => {
      nextGen();
    }, 300);
  };

  const nextGen = () => {
    updateLifeCycle();
    fillArray();
  };

  const stop = (intervalId: number) => {
    arrayInitialization();
    window.clearInterval(intervalId);
    isRunning = false;
  };

  useEffect(() => {
    isRunning = false;
    canvas = document.querySelector("canvas");
    //TODO: adjust width and cell size so there are no half cells on the grid
    canvas!.width = width;
    canvas!.height = height;
    ctx = canvas?.getContext("2d");

    //just to show the grid
    arrayInitialization();
    fillArray();

    //todo: optimize
    return () => {
      stop(intervalId);
    };
  });

  const onClickCanvas = (event: any) => {
    if(isRunning) return;//todo: unbind the event
    event.preventDefault();

    const mouseX = Math.floor((event.clientX - canvas.offsetLeft) / cellSize);
    const mouseY = Math.floor((event.clientY - canvas.offsetTop) / cellSize);

    activeArray[mouseY][mouseX] = +!activeArray[mouseY][mouseX];
    fillArray();
  };

  return (
    <div>
      <div className="canvas-container">
        <canvas onClick={(event) => onClickCanvas(event)} id="canvas"></canvas>
      </div>
      <Controls
        OnStartClick={start}
        OnstoptClick={stop}
        OnNextGenClick={nextGen}
      />
    </div>
  );
};

export default Canvas;
