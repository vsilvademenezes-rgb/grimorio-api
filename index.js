const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const app = express();

app.use(express.json());

const profiles = require("./profiles.json");

app.get("/", (req, res) => {
  res.json({
    nome: "Perfil API",
    status: "online",
    canvas: "ativo"
  });
});

// JSON do perfil
app.get("/perfil/:id/json", (req, res) => {
  const id = req.params.id;
  if (!profiles[id]) {
    return res.status(404).json({ erro: "Perfil não encontrado" });
  }
  res.json(profiles[id]);
});

// IMAGEM (BASE – ainda simples)
app.get("/perfil/:id", async (req, res) => {
  const id = req.params.id;
  if (!profiles[id]) {
    return res.status(404).json({ erro: "Perfil não encontrado" });
  }

  const canvas = createCanvas(900, 500);
  const ctx = canvas.getContext("2d");

  // fundo
  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // texto
  ctx.fillStyle = "#ffffff";
  ctx.font = "30px Arial";
  ctx.fillText(profiles[id].nome, 50, 80);

  ctx.font = "20px Arial";
  ctx.fillText(`Nível: ${profiles[id].nivel}`, 50, 130);
  ctx.fillText(`Banco: ${profiles[id].banco}`, 50, 170);

  res.set("Content-Type", "image/png");
  res.send(canvas.toBuffer());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Perfil API rodando na porta " + PORT);
});
