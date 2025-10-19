import RenderWorker from "./worker/render-worker?worker";
import type { TfWorld } from "./transmission-format";

export default class Renderer {
  get isRendering(): boolean {
    return this.#isRendering;
  }

  get renderProgress(): number {
    return this.#progress;
  }

  constructor(renderCanvas: HTMLCanvasElement) {
    this.#renderWorker = new RenderWorker();
    this.#renderWorker.onmessage = (ev: MessageEvent) => {
      switch (ev.data.msg) {
        case "render-update":
          this.#progress = ev.data.progress;
          break;

        case "render-complete":
          this.#progress = 1.0;
          this.#isRendering = false;
      }
    };

    const offscreenCanvas = renderCanvas.transferControlToOffscreen();
    this.#renderWorker.postMessage({ msg: "init", canvas: offscreenCanvas }, [
      offscreenCanvas,
    ]);
  }

  render(world: TfWorld): void {
    this.#progress = 0;
    this.#isRendering = true;
    this.#renderWorker.postMessage({ msg: "render", world });
  }

  #renderWorker: Worker;
  #progress: number = 0;
  #isRendering: boolean = false;
}
