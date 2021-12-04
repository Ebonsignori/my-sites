// Adapted from: https://codepen.io/0_vortex/pen/WdEKOq

const Eye = {
  size: 500,
  point: 15,
  speed: 100,
  pupil: { x: 12, y: 72 },
  eye: { x: 200, y: 130 },
  data: [],
  stopped: true,

  Add(val) {
    return val + Eye.size / 2;
  },

  Interval(color, distance, value) {
    const s = Math.abs((color.a - color.b) / (distance.b - distance.a));
    const v = value - distance.a;
    const c = color.a > color.b ? color.a - v * s : color.a + v * s;
    return Math.round(c);
  },

  Color(percent) {
    if (percent < 5)
      return Eye.Interval({ a: 255, b: 180 }, { a: 0, b: 2 }, percent);
    else if (percent < 10)
      return Eye.Interval({ a: 180, b: 100 }, { a: 2, b: 5 }, percent);
    else if (percent < 40)
      return Eye.Interval({ a: 100, b: 0 }, { a: 5, b: 30 }, percent);
    else if (percent < 70)
      return Eye.Interval({ a: 0, b: 100 }, { a: 30, b: 70 }, percent);
    else if (percent < 75)
      return Eye.Interval({ a: 100, b: 180 }, { a: 70, b: 80 }, percent);
    else return Eye.Interval({ a: 180, b: 255 }, { a: 80, b: 100 }, percent);
  },

  Pifagor(x, y) {
    return Math.sqrt(x * x + y * y);
  },

  Remove(radius, max, i) {
    if (radius > max) {
      Eye.data.splice(i, 1);
    }
  },

  Write(x, y, color, opacity) {
    Eye.ctx.fillStyle = `rgba(255,${color},0,${opacity})`;
    Eye.ctx.fillRect(Eye.Add(x), Eye.Add(y), 1, 1);
  },

  Style(point, i) {
    const radius = Eye.Pifagor(point.x, point.y);
    const percent = ((radius - point.min) / (point.max - point.min)) * 100;
    const color = Eye.Color(percent);
    const opacity = percent > 70 ? 1 - (percent - 70) / 30 : 1;

    Eye.Write(point.x, point.y, color, opacity);
    Eye.Remove(radius, point.max, i);
  },

  Move(i) {
    const point = Eye.data[i];
    point.x += point.X;
    point.y += point.Y;
    Eye.Style(point, i);
  },

  Update() {
    Eye.Fill(0.02);
    for (let i = 0; i < Eye.point; i++) {
      Eye.Point();
    }
    for (let j = 0; j < Eye.data.length; j++) {
      Eye.Move(j);
    }
  },

  Draw() {
    if (Eye.stopped) {
      return;
    }
    Eye.Update();
    requestAnimationFrame(Eye.Draw, Eye.canvas);
    // Draw pupil
    Eye.ctx.fillStyle = `black`;
    Eye.ctx.beginPath();
    Eye.ctx.ellipse(
      Eye.size / 2,
      Eye.size / 2,
      Eye.pupil.x - 4,
      Eye.pupil.y - 6,
      0,
      0,
      2 * Math.PI
    );
    Eye.ctx.fill();
  },

  Noise(value) {
    return Math.random() * value - value / 2;
  },

  Radius(start, end) {
    return {
      max: Eye.Pifagor(end.x, end.y),
      min: Eye.Pifagor(start.x, start.y),
    };
  },

  Step(start, end) {
    return {
      x: (end.x - start.x) / Eye.speed,
      y: (end.y - start.y) / Eye.speed,
    };
  },

  Position(type, angel, noise) {
    return {
      x: Eye[type].x * Math.cos(angel) + Eye.Noise(noise),
      y: Eye[type].y * Math.sin(angel) + Eye.Noise(noise),
    };
  },

  Point() {
    const angel = Math.random() * 2 * Math.PI;
    const start = Eye.Position("pupil", angel, 5);
    const end = Eye.Position("eye", angel, 25);
    const radius = Eye.Radius(start, end);
    const step = Eye.Step(start, end);

    Eye.data.push({
      x: start.x,
      y: start.y,
      X: step.x,
      Y: step.y,
      min: radius.min,
      max: radius.max,
    });
  },

  Fill(a) {
    Eye.ctx.fillStyle = `rgba(255,255,255,${a})`;
    Eye.ctx.fillRect(0, 0, Eye.size, Eye.size);
    Eye.ctx.fillStyle = `rgba(255,255,255,${a})`;
    Eye.ctx.fillRect(0, 0, Eye.size, Eye.size);
  },

  Init() {
    Eye.Fill(0);
    for (let i = 0; i < Eye.point; i++) {
      Eye.Point();
    }
    Eye.Draw();
  },

  Stop() {
    Eye.stopped = true;
    if (Eye.ctx) {
      Eye.ctx.clearRect(0, 0, Eye.canvas.width, Eye.canvas.height);
    }
  },

  Watch(canvasRef) {
    Eye.canvas = canvasRef.current;
    Eye.canvas.width = Eye.size;
    Eye.canvas.height = Eye.size;
    Eye.ctx = Eye.canvas.getContext("2d");
    Eye.stopped = false;
    Eye.Init();
  },
};

export default function processEyeOfSauron(canvasRef) {
  if (canvasRef && canvasRef.current) {
    Eye.Watch(canvasRef);
  } else {
    Eye.Stop();
  }
}
