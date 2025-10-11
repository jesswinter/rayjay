import { RenderJob, type RenderUpdateEvent } from "./renderer";
import { createTfDemoScene } from "./scenes";
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

const tfWorld = createTfDemoScene();
const job = new RenderJob(renderData, tfWorld);
job.addEventListener("render-update", (event) => {
  console.log("render job updated");
  const renderUpdateEvent = event as RenderUpdateEvent;
  canvasContext.putImageData(renderUpdateEvent.target.renderTarget, 0, 0);
  statusEl.innerText = `Progress: ${(renderUpdateEvent.detail.progress * 100).toFixed(1)}%`;
});
job.execute();
