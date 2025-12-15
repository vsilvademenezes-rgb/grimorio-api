const express = require("express");
const fs = require('fs'); // Módulo para ler arquivos
const path = require('path'); // Módulo para lidar com caminhos
const app = express();

app.use(express.json());

// --- LÓGICA DE CARREGAMENTO DINÂMICO ---
const data = {};
const dataDir = path.join(__dirname, 'data'); // Define o caminho da pasta 'data'

// Carrega todos os arquivos JSON dentro da pasta 'data'
try {
  fs.readdirSync(dataDir).forEach(file => {
    if (path.extname(file) === '.json') {
      const categoryName = path.basename(file, '.json');
      // Carrega o conteúdo do JSON e armazena com o nome do arquivo (sem extensão)
      data[categoryName] = require(path.join(dataDir, file));
      console.log(`Categoria carregada: ${categoryName}`);
    }
  });
} catch (error) {
  console.error("Erro ao carregar dados:", error);
  // É bom ter um ponto de falha aqui para saber se a API vai subir sem dados
}
// --- FIM DA LÓGICA DE CARREGAMENTO ---


// Rota principal (Status)
app.get("/", (req, res) => {
  res.json({
    nome: "Grimório Universal API",
    status: "online",
    categorias_carregadas: Object.keys(data).length
  });
});

// Rota categorias (Lista de todos os temas)
app.get("/categorias", (req, res) => {
  res.json(Object.keys(data));
});

// Rota dinâmica (Busca a categoria inteira: /tarot ou /bruxaria)
app.get("/:categoria", (req, res) => {
  const categoria = req.params.categoria.toLowerCase();

  if (!data[categoria]) {
    return res.status(404).json({
      erro: "Categoria não encontrada. Verifique a lista em /categorias"
    });
  }

  res.json(data[categoria]);
});

// Rota para item específico (Busca um item dentro da categoria: /tarot/o mago)
app.get("/:categoria/:item", (req, res) => {
  const { categoria, item } = req.params;

  const categoriaData = data[categoria.toLowerCase()];

  // 1. Verifica se a categoria existe ou se não é um array (pois só buscamos itens em arrays)
  if (!categoriaData || !Array.isArray(categoriaData)) {
    return res.status(404).json({ erro: "Categoria não encontrada ou não suporta busca de item." });
  }

  // 2. Procura o item (seja por 'nome' ou 'carta' no exemplo)
  const itemBuscado = categoriaData.find(obj => {
    // Tenta encontrar pelo campo 'nome' (para cristais, por exemplo)
    if (obj.nome && obj.nome.toLowerCase() === item.toLowerCase()) return true;
    // Tenta encontrar pelo campo 'carta' (para tarot, por exemplo)
    if (obj.carta && obj.carta.toLowerCase() === item.toLowerCase()) return true;
    return false;
  });

  if (!itemBuscado) {
    return res.status(404).json({ erro: `Item "${item}" não encontrado em "${categoria}".` });
  }

  res.json(itemBuscado);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("API rodando na porta " + PORT);
  console.log(`Acesse: http://localhost:${PORT}`);
});
