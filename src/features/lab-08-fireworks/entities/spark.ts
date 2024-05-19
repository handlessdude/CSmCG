class Spark {
  static sparksCount =200;

  // задаём направление полёта искры в градусах, от 0 до 360
  angle = Math.random() * 360;
  // радиус - это расстояние, которое пролетит искра
  radius = Math.random();

  // у каждой искры своя скорость. multiplier подбирается эмпирически
  multiplier = 125 + Math.random() * 125;

  // время создания искры
  timeFromCreation = performance.now();

  xMax = 0;
  yMax = 0;

  dx = 0;
  dy = 0;

  x = 0;
  y = 0;

  init(){
    // отмеряем точки на окружности - максимальные координаты искры
    this.xMax = Math.cos(this.angle) * this.radius;
    this.yMax = Math.sin(this.angle) * this.radius;

    // dx и dy - приращение искры за вызов отрисовки, то есть её скорость,
    this.dx = this.xMax / this.multiplier;
    this.dy = this.yMax / this.multiplier;

    // Для того, чтобы не все искры начинали движение из начала координат,
    // делаем каждой искре свой отступ, но не более максимальных значений.
    this.x = (this.dx * 1000) % this.xMax;
    this.y = (this.dy * 1000) % this.yMax;
  }

  move(time: number) {
    // находим разницу между вызовами отрисовки, чтобы анимация работала
    // одинаково на компьютерах разной мощности
    const timeShift = time - this.timeFromCreation;
    this.timeFromCreation = time;
    // приращение зависит от времени между отрисовками
    const speed = timeShift;
    this.x += this.dx * speed;
    this.y += this.dy * speed;
    // если искра достигла конечной точки, запускаем её заново из начала координат
    if (Math.abs(this.x) > Math.abs(this.xMax) || Math.abs(this.y) > Math.abs(this.yMax)) {
      this.init();
      return;
    }
  }
}

export {
  Spark
}
