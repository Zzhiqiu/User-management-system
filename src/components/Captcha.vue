<template>
  <div>
    <canvas ref="canvas" width="120" height="40"></canvas>
  </div>
</template>

<script>
export default {
  name: "Captcha",
  data() {
    return {
      code: "",
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.textBaseline = "bottom";

      // 绘制背景
      ctx.fillStyle = this.randomColor(180, 240);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制文字
      const chars = "ABCDEFGHJKLMNPQRSTWXY123456789";
      let code = "";
      for (let i = 0; i < 4; i++) {
        const char = chars[this.randomNum(0, chars.length)];
        code += char;
        ctx.fillStyle = this.randomColor(50, 160);
        ctx.font = this.randomNum(20, 26) + "px SimHei";
        const x = (canvas.width / 5) * (i + 1);
        const y = this.randomNum(canvas.height / 2, canvas.height);
        const deg = this.randomNum(-30, 30);
        ctx.translate(x, y);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.fillText(char, 0, 0);
        ctx.rotate((-deg * Math.PI) / 180);
        ctx.translate(-x, -y);
      }
      this.code = code;
      console.log(this.code)

      // 绘制干扰线
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = this.randomColor(40, 180);
        ctx.beginPath();
        ctx.moveTo(this.randomNum(0, canvas.width), this.randomNum(0, canvas.height));
        ctx.lineTo(this.randomNum(0, canvas.width), this.randomNum(0, canvas.height));
        ctx.stroke();
      }

      // 绘制干扰点
      for (let i = 0; i < canvas.width / 4; i++) {
        ctx.fillStyle = this.randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(this.randomNum(0, canvas.width), this.randomNum(0, canvas.height), 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    randomColor(min, max) {
      const r = this.randomNum(min, max);
      const g = this.randomNum(min, max);
      const b = this.randomNum(min, max);
      return `rgb(${r},${g},${b})`;
    },
    refreshCode() {
      this.draw();
    },
    validateCode(inputCode) {
      if (inputCode) {
        return inputCode.toLowerCase() === this.code.toLowerCase();
      }
      return false;
    }
    ,
  },
};
</script>
