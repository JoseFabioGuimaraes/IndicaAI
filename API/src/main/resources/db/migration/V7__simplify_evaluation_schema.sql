ALTER TABLE avaliacoes ADD COLUMN nota INTEGER;

-- Optional: Migrate existing data (average of old metrics) if needed, otherwise they will be null
-- UPDATE avaliacoes SET nota = (nota_assiduidade + nota_tecnica + nota_comportamental) / 3;

ALTER TABLE avaliacoes DROP COLUMN nota_assiduidade;
ALTER TABLE avaliacoes DROP COLUMN nota_tecnica;
ALTER TABLE avaliacoes DROP COLUMN nota_comportamental;
