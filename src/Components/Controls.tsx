/*
1.start/stop
2. Next iteration
3.default shapes selection
4.On click canvas
*/

const Controls = (props: any) => {
  const { OnStartClick, OnStoptClick } = props;

  return (
    <div>
      <button onClick={OnStartClick}>Start Random</button>
      <button onClick={OnStoptClick}>Stop</button>
    </div>
  );
};

export default Controls;
