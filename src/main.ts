import { render } from "./renderer";
const appEl = document.getElementById("app")!;

const statusEl = document.createElement("p");
appEl.appendChild(statusEl);

const renderCanvas = document.createElement("canvas") as HTMLCanvasElement;
renderCanvas.width = 480;
renderCanvas.height = 360;
appEl.appendChild(renderCanvas);

const canvasContext = renderCanvas.getContext("2d")!;
const renderData = canvasContext.createImageData(
  renderCanvas.width,
  renderCanvas.height,
);

render(renderData, (renderTarget: ImageData, progress: number) => {
  canvasContext.putImageData(renderData, 0, 0);
  statusEl.innerText = `Progress: ${(progress * 100).toFixed(1)}%`;
});
