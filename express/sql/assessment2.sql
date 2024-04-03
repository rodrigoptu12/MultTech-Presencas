BEGIN;

DROP TABLE IF EXISTS Presencas CASCADE;
DROP TABLE IF EXISTS Estudantes_Turmas CASCADE;
DROP TABLE IF EXISTS Estudantes CASCADE;
DROP TABLE IF EXISTS Turmas CASCADE;

CREATE TABLE Estudantes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    celular VARCHAR(20),
    email VARCHAR(100),
    chavePix VARCHAR(100),
    tipoChavePix VARCHAR(20),



    matricula VARCHAR(20),
    curso VARCHAR(50),
    senha VARCHAR(50),
    isAdmin BOOLEAN DEFAULT FALSE,
    imagem BYTEA
);

CREATE TABLE Turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20)
);

CREATE TABLE Estudantes_Turmas (
    estudante_id INT,
    turma_id INT,
    PRIMARY KEY (estudante_id, turma_id),
    FOREIGN KEY (estudante_id) REFERENCES Estudantes(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE
);

CREATE TABLE Presencas (
    id SERIAL PRIMARY KEY,
    dataPresenca DATE,
    estudante_id INT,
    turma_id INT,
    FOREIGN KEY (estudante_id, turma_id) REFERENCES Estudantes_Turmas(estudante_id, turma_id) ON DELETE CASCADE
);

INSERT INTO
  Estudantes (nome, email, matricula, curso, senha, isAdmin)
VALUES
  (
    'Admin',
    'admin@admin.com',
    '20210003',
    'Administração',
    '123456',
    TRUE
  );
COMMIT;
