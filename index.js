const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    nome: "Grimório Universal API",
    status: "online",
    categorias: [
      "Bruxaria",
      "Ocultismo",
      "Tarot",
      "Cristais",
      "Herbologia",
      "Mitologias",
      "Magias"
    ]
  });
});

const data = require("./data.json");

app.get("/categorias", (req, res) => {
  res.json(Object.keys(data));
});

app.get("/:categoria", (req, res) => {
  const cat = req.params.categoria.toLowerCase();
  if (!data[cat]) {
    return res.status(404).json({ erro: "Categoria não encontrada" });
  }
  res.json(data[cat]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API rodando na porta " + PORT);
});
