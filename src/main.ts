import { RenderJob } from "./renderer";
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
job.execute();
let lastProgressRendered = 0;
requestAnimationFrame(function updateRender() {
  if (job.completed) {
    canvasContext.putImageData(job.renderTarget, 0, 0);
    statusEl.innerText = "Completed";

    return;
  }
  if (job.progress > lastProgressRendered) {
    canvasContext.putImageData(job.renderTarget, 0, 0);
    statusEl.innerText = `Progress: ${(job.progress * 100).toFixed(1)}%`;
    lastProgressRendered = job.progress;
  }

  requestAnimationFrame(updateRender);
});
