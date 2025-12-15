const express = require("express");
const app = express();

app.use(express.json());

const data = require("./data.json");

// rota principal
app.get("/", (req, res) => {
  res.json({
    nome: "Grimório Universal API",
    status: "online"
  });
});

// rota categorias
app.get("/categorias", (req, res) => {
  res.json(Object.keys(data));
});

// rota dinâmica (bruxaria, tarot, etc)
app.get("/:categoria", (req, res) => {
  const categoria = req.params.categoria.toLowerCase();

  if (!data[categoria]) {
    return res.status(404).json({
      erro: "Categoria não encontrada"
    });
  }

  res.json(data[categoria]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("API rodando na porta " + PORT);
});
