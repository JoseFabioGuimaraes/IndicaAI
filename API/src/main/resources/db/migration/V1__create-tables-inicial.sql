CREATE TABLE empresas (
    id UUID PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE funcionarios (
    id UUID PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto_rosto_url TEXT,
    foto_documento_url TEXT,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE avaliacoes (
    id UUID PRIMARY KEY,
    funcionario_id UUID NOT NULL,
    empresa_id UUID NOT NULL,

    nota_assiduidade INTEGER,
    nota_tecnica INTEGER,
    nota_comportamental INTEGER,

    descricao TEXT,
    data_avaliacao TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PUBLICADA',

    CONSTRAINT fk_avaliacao_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
    CONSTRAINT fk_avaliacao_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);