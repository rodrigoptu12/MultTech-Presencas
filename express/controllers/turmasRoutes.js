// estudantesRoutes.js

const express = require("express");
const router = express.Router();
const pool = require("../configDB"); // Importa o pool do módulo db.js

router.get("/turmas", (req, res) => {
  const query = "SELECT * FROM turmas";
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.render("turmas", {
        turmas: [],
        mensagem: "Falha ao obter turmas.",
      });
    }
    const turmas = result.rows;
    res.render("turmas", { turmas, mensagem: null });
  });
});

// Adicionar turma
router.post("/turmas/add", (req, res) => {
  const { nome } = req.body;
  const query = "INSERT INTO turmas (nome) VALUES ($1)";
  pool.query(query, [nome], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ mensagem: "Falha ao adicionar turma." });
    }
    return res.redirect("/turmas");
  });
}
);

// Atualizar turma
router.post("/turmas/update", (req, res) => {
  console.log("body", req.body)
  const { turma_atualizar, nome } = req.body;
  const query =
    "UPDATE turmas SET nome = $1 WHERE id = $2"
  console.log(query);
  console.log(turma_atualizar, nome);
  pool.query(
    query,
    [nome, turma_atualizar],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ mensagem: "Falha ao atualizar Turma." });
      }

      if (result.rowCount > 0) {
        return res.redirect("/turmas");
      } else {
        return res.json({ mensagem: "Turma não encontrado." });
        // return res.redirect("/turmas");
      }
    }
  );
});

router.post("/turmas/delete", (req, res) => {
  const id = req.body.id;
  const query = "DELETE FROM turmas WHERE id = $1";

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ mensagem: "Falha ao remover turma." });
    }
    if (result.rowCount > 0) {
      return res.redirect("/turmas");
    } else {
      return res.json({ mensagem: "turma não encontrado." });
    }
  });
});

router.get("/turmas/turma/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM turmas WHERE id = $1";

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ mensagem: "Falha ao obter o turma." });
    }
    if (result.rowCount > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.json({ mensagem: "Turma não encontrada." });
    }
  });
}
);
module.exports = router;
