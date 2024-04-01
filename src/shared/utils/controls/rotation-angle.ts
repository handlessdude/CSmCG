class RotationAngle {
  #angle = 0;
  readonly #step: number; // todo: make editable in the future

  constructor(
    private readonly deltaTime: () => number,
    readonly stepFrac: number = 0.001, // 2*pi fraction
  ) {
    this.#step = 2 * Math.PI * stepFrac;
  }

  get value () {
    return this.#angle
  }

  decAngle = () => {
    this.#angle += -this.#step * this.deltaTime();
    if (this.#angle < 0) this.#angle = 2 * Math.PI + this.#angle;
  }

  incAngle = () => {
    this.#angle += this.#step * this.deltaTime();
    if (this.#angle > 2 * Math.PI) this.#angle = 0;
  }
}

export {
  RotationAngle,
}
