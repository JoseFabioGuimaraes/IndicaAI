DELETE FROM funcionarios;
ALTER TABLE funcionarios
ALTER COLUMN foto_rosto_url TYPE TEXT USING foto_rosto_url::text;

ALTER TABLE funcionarios
ALTER COLUMN foto_documento_url TYPE TEXT USING foto_documento_url::text;