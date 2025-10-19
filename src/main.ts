import Renderer from "./renderer";
import { createTfDemoScene } from "./scenes";
const appEl = document.getElementById("app")!;

const statusEl = document.createElement("p");
appEl.appendChild(statusEl);

const renderCanvas = document.createElement("canvas") as HTMLCanvasElement;
renderCanvas.width = 480;
renderCanvas.height = 360;
appEl.appendChild(renderCanvas);

const renderer = new Renderer(renderCanvas);

const tfWorld = createTfDemoScene();
renderer.render(tfWorld);
requestAnimationFrame(function updateRender() {
  if (renderer.isRendering) {
    statusEl.innerText = `Progress: ${(renderer.renderProgress * 100).toFixed(2)}%`;
    requestAnimationFrame(updateRender);
  } else {
    statusEl.innerText = "Completed";
  }
});
