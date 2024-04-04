// estudantesRoutes.js

const express = require("express");
const router = express.Router();
const pool = require("../configDB"); // Importa o pool do módulo db.js

router.get("/estudantes", (req, res) => {
  const query = "SELECT * FROM turmas";
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.render("estudantes", {
        turmas: [],
        mensagem: "Falha ao obter estudantes.",
      });
    }

    const turmas = result.rows;
    const estudantes = [];
    res.render("estudantes", { turmas, estudantes, mensagem: null });
  });
});





router.get("/estudantes/:idTurma", (req, res) => {
  const idTurma = req.params.idTurma;
  const queryEstudantes = "SELECT Estudantes.* FROM Estudantes INNER JOIN Estudantes_Turmas ON Estudantes.id = Estudantes_Turmas.estudante_id WHERE Estudantes_Turmas.turma_id = $1 ";
  const queryTurmas = "SELECT * FROM turmas";

  // Usamos Promise.all para executar as duas consultas de forma paralela
  Promise.all([
    pool.query(queryEstudantes, [idTurma]),
    pool.query(queryTurmas)
  ])
    .then(([resultEstudantes, resultTurmas]) => {
      const estudantes = resultEstudantes.rows;
      const turmas = resultTurmas.rows;
      res.render("estudantes", { turmas, estudantes, mensagem: null });
    })
    .catch(err => {
      console.error(err);
      res.render("estudantes", {
        turmas: [],
        estudantes: [],
        mensagem: "Falha ao obter turmas ou estudantes da turma."
      });
    });
});

router.get("/estudantes/turma/:idTurma", (req, res) => {
  const idTurma = req.params.idTurma;
  const queryEstudantes = "SELECT Estudantes.* FROM Estudantes INNER JOIN Estudantes_Turmas ON Estudantes.id = Estudantes_Turmas.estudante_id WHERE Estudantes_Turmas.turma_id = $1";

  pool.query(queryEstudantes, [idTurma])
    .then(resultEstudantes => {
      const estudantes = resultEstudantes.rows;
      res.json(estudantes); // Retorna os estudantes no formato JSON
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ mensagem: "Falha ao obter estudantes da turma." });
    });
});



router.post("/estudantes", (req, res) => {
  const { turma, nome, celular, email, chavePix, tipoChavePix } = req.body;

  // Iniciar uma transação
  pool.query("BEGIN", async (err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.render("estudantes", {
        mensagem: "Falha ao criar o estudante.",
      });
    }

    try {
      // Inserir o novo estudante na tabela Estudantes
      const insertEstudanteQuery = "INSERT INTO estudantes (nome, celular, email, chavePix, tipoChavePix) VALUES ($1, $2, $3, $4, $5) RETURNING id";
      const estudanteResult = await pool.query(insertEstudanteQuery, [nome, celular, email, chavePix, tipoChavePix]);

      // Obter o ID do estudante recém-inserido
      const estudanteId = estudanteResult.rows[0].id;

      // Inserir o relacionamento do estudante com a turma na tabela Estudantes_Turmas
      const insertEstudanteTurmaQuery = "INSERT INTO Estudantes_Turmas (estudante_id, turma_id) VALUES ($1, $2)";
      await pool.query(insertEstudanteTurmaQuery, [estudanteId, turma]);

      // Confirmar a transação
      pool.query("COMMIT", (err) => {
        if (err) {
          console.error("Erro ao confirmar transação:", err);
          return res.render("estudantes", {
            mensagem: "Falha ao criar o estudante.",
          });
        }

        // Redirecionar para a página de estudantes após o sucesso
        res.redirect("/estudantes");
      });
    } catch (error) {
      // Reverter a transação em caso de erro
      pool.query("ROLLBACK", (rollbackErr) => {
        if (rollbackErr) {
          console.error("Erro ao reverter transação:", rollbackErr);
        }
        console.error("Erro ao criar o estudante:", error);
        res.render("estudantes", {
          mensagem: "Falha ao criar o estudante.",
        });
      });
    }
  });
});


// router.post("/estudantes", (req, res) => {
//   const { turma, nome, celular, email, chavePix, tipoChavePix } = req.body;
//   const query =
//     "INSERT INTO estudantes (nome, celular, email, chavePix, tipoChavePix) VALUES ($1, $2, $3, $4, $5)";

//   pool.query(query, [nome, celular, email, chavePix, tipoChavePix], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.render("estudantes", {
//         mensagem: "Falha ao criar o estudante.",
//       });
//     }
//   });
//   // Redireciona para a página de estudantes
//   res.redirect("/estudantes");
// });

// Atualizar estudante
router.post("/estudantes/update", (req, res) => {
  console.log("body", req.body)
  const { aluno, nome, email, celular, chavePix, tipoChavePix } = req.body;
  const query =
    "UPDATE estudantes SET nome = $1, email = $2, celular = $3, chavepix = $4, tipochavepix = $5 WHERE id = $6";

  pool.query(
    query,
    [nome, email, celular, chavePix, tipoChavePix, aluno],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ mensagem: "Falha ao atualizar o estudante." });
      }

      if (result.rowCount > 0) {
        return res.redirect("/estudantes");
      } else {
        return res.json({ mensagem: "Estudante não encontrado." });
      }
    }
  );
});

router.post("/estudantes/delete", (req, res) => {
  const id = req.body.id;
  const query = "DELETE FROM estudantes WHERE id = $1";

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ mensagem: "Falha ao remover o estudante." });
    }
    if (result.rowCount > 0) {
      return res.redirect("/estudantes");
    } else {
      return res.json({ mensagem: "Estudante não encontrado." });
    }
  });
});

router.get("/estudantes/estudante/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM estudantes WHERE id = $1";

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ mensagem: "Falha ao obter o estudante." });
    }

    if (result.rowCount > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.json({ mensagem: "Estudante não encontrado." });
    }
  });
}
);
module.exports = router;
