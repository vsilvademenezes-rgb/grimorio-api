const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "API ONLINE",
    mensagem: "Grimório Universal API funcionando"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
