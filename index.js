const express = require("express");
const { createCanvas, loadImage, registerFont } = require("canvas");

const app = express();
app.use(express.json());

registerFont("./fonts/Poppins-Bold.ttf", { family: "Poppins" });

app.get("/", (req, res) => {
  res.json({ status: "online", api: "Profile Image API" });
});

app.post("/perfil", async (req, res) => {
  const {
    username,
    avatar,
    banner,
    reps,
    saldo,
    banco,
    nivel,
    xp,
    sobre
  } = req.body;

  const canvas = createCanvas(900, 500);
  const ctx = canvas.getContext("2d");

  // Banner
  const bg = await loadImage(banner);
  ctx.drawImage(bg, 0, 0, 900, 500);

  // Overlay
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, 900, 500);

  // Avatar
  const av = await loadImage(avatar);
  ctx.save();
  ctx.beginPath();
  ctx.arc(130, 130, 70, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(av, 60, 60, 140, 140);
  ctx.restore();

  // Textos
  ctx.fillStyle = "#fff";
  ctx.font = "28px Poppins";
  ctx.fillText(username, 220, 120);

  ctx.font = "18px Poppins";
  ctx.fillText(`Reps: ${reps}`, 220, 160);
  ctx.fillText(`Saldo: ${saldo}`, 60, 260);
  ctx.fillText(`Banco: ${banco}`, 60, 300);
  ctx.fillText(`Nível: ${nivel}`, 60, 340);
  ctx.fillText(`XP: ${xp}`, 60, 380);

  ctx.font = "16px Poppins";
  ctx.fillText(`Sobre mim: ${sobre}`, 220, 200);

  res.set("Content-Type", "image/png");
  res.send(canvas.toBuffer());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API rodando"));
