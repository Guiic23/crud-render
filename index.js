// Projeto CRUD Render - Aula CNW2
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve o HTML

// 🔗 Conexão com banco no Render (externo)
const pool = new Pool({
  connectionString: "postgresql://bancoativ_user:EIXoOTA1WZxj3HO4WFvfr4yEVZaUPzTh@dpg-d3scqv8dl3ps73daaue0-a.oregon-postgres.render.com/bancoativ",
  ssl: { rejectUnauthorized: false }
});

// 🧱 Criar tabela (executar 1x)
app.get("/create-table", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        idade INT
      );
    `);
    res.send("✅ Tabela 'alunos' criada com sucesso!");
  } catch (err) {
    console.error("Erro ao criar tabela:", err);
    res.status(500).send("Erro ao criar tabela");
  }
});

// ➕ CREATE
app.post("/alunos", async (req, res) => {
  const { nome, idade } = req.body;
  try {
    await pool.query("INSERT INTO alunos (nome, idade) VALUES ($1, $2)", [nome, idade]);
    res.send("✅ Aluno cadastrado com sucesso!");
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    res.status(500).send("Erro ao cadastrar aluno");
  }
});

// 📖 READ
app.get("/alunos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).send("Erro ao listar alunos");
  }
});

// ✏️ UPDATE
app.put("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;
  try {
    await pool.query("UPDATE alunos SET nome=$1, idade=$2 WHERE id=$3", [nome, idade, id]);
    res.send("✏️ Aluno atualizado com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    res.status(500).send("Erro ao atualizar aluno");
  }
});

// ❌ DELETE
app.delete("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM alunos WHERE id=$1", [id]);
    res.send("🗑️ Aluno excluído com sucesso!");
  } catch (err) {
    console.error("Erro ao excluir:", err);
    res.status(500).send("Erro ao excluir aluno");
  }
});

// 🚀 Iniciar servidor
app.listen(process.env.PORT || 10000, () => {
  console.log("🚀 Servidor rodando na porta 10000");
});
