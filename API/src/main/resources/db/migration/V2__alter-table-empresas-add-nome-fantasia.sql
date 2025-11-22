ALTER TABLE empresas ADD COLUMN nome_fantasia VARCHAR(255);

ALTER TABLE empresas ADD COLUMN status VARCHAR(20) DEFAULT 'ATIVO';
UPDATE empresas SET status = 'ATIVO';