/*
1.start/stop
2. Next iteration
3.default shapes selection
4.On click canvas
*/

const Controls = (props: any) => {
  const { OnStartClick, OnStoptClick, OnNextGenClick } = props;

  return (
    <div className="controls">
      <button onClick={() => OnStartClick(true)}>Start Random</button>
      <button onClick={() => OnStartClick(false)}>Start</button>
      <button onClick={OnNextGenClick}>Next Gen</button>
      <button onClick={OnStoptClick}>Stop</button>
    </div>
  );
};

export default Controls;
