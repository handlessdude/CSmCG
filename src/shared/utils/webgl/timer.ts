class Timer {
  #prevTick = 0;
  #delta = 0;

  get delta () { return this.#delta }
  get time () { return this.#prevTick }
  init = () => { this.#prevTick = performance.now(); }

  updateDelta = () => {
    const curTick = performance.now();
    this.#delta = curTick - this.#prevTick;
    this.#prevTick = curTick;
  }
}

export {
  Timer
}
