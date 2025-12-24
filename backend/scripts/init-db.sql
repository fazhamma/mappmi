-- Script d'initialisation de la base de données PMI Certification Map
-- Ce script crée la table principale et les index nécessaires

-- Supprimer la table si elle existe (pour réinitialisation)
DROP TABLE IF EXISTS country_cert_stats;

-- Créer la table des statistiques de certification par pays
CREATE TABLE country_cert_stats (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    cert_type VARCHAR(20) NOT NULL,
    active_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Contraintes
    CHECK (LENGTH(country_code) = 2),
    CHECK (year >= 2000 AND year <= 2100),
    CHECK (active_count >= 0),

    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE (country_code, year, cert_type)
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX idx_country_cert_year ON country_cert_stats(country_code, cert_type, year);
CREATE INDEX idx_year ON country_cert_stats(year);
CREATE INDEX idx_cert_type ON country_cert_stats(cert_type);
CREATE INDEX idx_country_code ON country_cert_stats(country_code);

-- Index pour les tri et agrégations
CREATE INDEX idx_active_count ON country_cert_stats(active_count DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_country_cert_stats_updated_at
    BEFORE UPDATE ON country_cert_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documentation
COMMENT ON TABLE country_cert_stats IS 'Statistiques agrégées des certifications PMI par pays et type';
COMMENT ON COLUMN country_cert_stats.country_code IS 'Code ISO 3166-1 alpha-2 du pays (ex: US, FR, IN)';
COMMENT ON COLUMN country_cert_stats.country_name IS 'Nom complet du pays en anglais';
COMMENT ON COLUMN country_cert_stats.year IS 'Année des statistiques';
COMMENT ON COLUMN country_cert_stats.cert_type IS 'Type de certification PMI (PMP, PMI-ACP, PMI-RMP, etc.)';
COMMENT ON COLUMN country_cert_stats.active_count IS 'Nombre de certifications actives';

-- Afficher un message de confirmation
SELECT 'Database schema initialized successfully!' AS status;
