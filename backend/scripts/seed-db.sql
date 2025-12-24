-- Script de seed pour la base de données PMI Certification Map
-- Données d'exemple pour tester l'application

-- Nettoyage des données existantes
TRUNCATE TABLE country_cert_stats RESTART IDENTITY;

-- Insertion de données d'exemple pour 2024 et 2025
-- États-Unis (leader mondial)
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('US', 'United States', 2024, 'PMP', 32000),
    ('US', 'United States', 2024, 'PMI-ACP', 7500),
    ('US', 'United States', 2024, 'PMI-RMP', 1800),
    ('US', 'United States', 2024, 'PMI-SP', 950),
    ('US', 'United States', 2024, 'PgMP', 650),
    ('US', 'United States', 2024, 'PfMP', 180),
    ('US', 'United States', 2024, 'CAPM', 4200),
    ('US', 'United States', 2025, 'PMP', 35000),
    ('US', 'United States', 2025, 'PMI-ACP', 8000),
    ('US', 'United States', 2025, 'PMI-RMP', 2000),
    ('US', 'United States', 2025, 'PMI-SP', 1050),
    ('US', 'United States', 2025, 'PgMP', 720),
    ('US', 'United States', 2025, 'PfMP', 200),
    ('US', 'United States', 2025, 'CAPM', 4500);

-- Inde (forte croissance)
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('IN', 'India', 2024, 'PMP', 20000),
    ('IN', 'India', 2024, 'PMI-ACP', 4500),
    ('IN', 'India', 2024, 'PMI-RMP', 850),
    ('IN', 'India', 2024, 'CAPM', 2800),
    ('IN', 'India', 2024, 'PgMP', 320),
    ('IN', 'India', 2025, 'PMP', 22000),
    ('IN', 'India', 2025, 'PMI-ACP', 5000),
    ('IN', 'India', 2025, 'PMI-RMP', 1000),
    ('IN', 'India', 2025, 'CAPM', 3200),
    ('IN', 'India', 2025, 'PgMP', 380);

-- Chine
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('CN', 'China', 2024, 'PMP', 18000),
    ('CN', 'China', 2024, 'PMI-ACP', 3800),
    ('CN', 'China', 2024, 'CAPM', 2200),
    ('CN', 'China', 2025, 'PMP', 19500),
    ('CN', 'China', 2025, 'PMI-ACP', 4200),
    ('CN', 'China', 2025, 'CAPM', 2500);

-- Royaume-Uni
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('GB', 'United Kingdom', 2024, 'PMP', 8500),
    ('GB', 'United Kingdom', 2024, 'PMI-ACP', 2100),
    ('GB', 'United Kingdom', 2024, 'PMI-RMP', 580),
    ('GB', 'United Kingdom', 2024, 'PgMP', 250),
    ('GB', 'United Kingdom', 2025, 'PMP', 9200),
    ('GB', 'United Kingdom', 2025, 'PMI-ACP', 2400),
    ('GB', 'United Kingdom', 2025, 'PMI-RMP', 650),
    ('GB', 'United Kingdom', 2025, 'PgMP', 280);

-- Canada
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('CA', 'Canada', 2024, 'PMP', 7800),
    ('CA', 'Canada', 2024, 'PMI-ACP', 1850),
    ('CA', 'Canada', 2024, 'PMI-RMP', 420),
    ('CA', 'Canada', 2024, 'CAPM', 980),
    ('CA', 'Canada', 2025, 'PMP', 8500),
    ('CA', 'Canada', 2025, 'PMI-ACP', 2100),
    ('CA', 'Canada', 2025, 'PMI-RMP', 480),
    ('CA', 'Canada', 2025, 'CAPM', 1150);

-- Allemagne
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('DE', 'Germany', 2024, 'PMP', 6200),
    ('DE', 'Germany', 2024, 'PMI-ACP', 1450),
    ('DE', 'Germany', 2024, 'PMI-RMP', 380),
    ('DE', 'Germany', 2025, 'PMP', 6800),
    ('DE', 'Germany', 2025, 'PMI-ACP', 1650),
    ('DE', 'Germany', 2025, 'PMI-RMP', 420);

-- France
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('FR', 'France', 2024, 'PMP', 2300),
    ('FR', 'France', 2024, 'PMI-ACP', 750),
    ('FR', 'France', 2024, 'PMI-RMP', 180),
    ('FR', 'France', 2024, 'CAPM', 320),
    ('FR', 'France', 2025, 'PMP', 2500),
    ('FR', 'France', 2025, 'PMI-ACP', 800),
    ('FR', 'France', 2025, 'PMI-RMP', 200),
    ('FR', 'France', 2025, 'CAPM', 380);

-- Australie
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('AU', 'Australia', 2024, 'PMP', 5400),
    ('AU', 'Australia', 2024, 'PMI-ACP', 1280),
    ('AU', 'Australia', 2024, 'PMI-RMP', 310),
    ('AU', 'Australia', 2025, 'PMP', 5900),
    ('AU', 'Australia', 2025, 'PMI-ACP', 1450),
    ('AU', 'Australia', 2025, 'PMI-RMP', 350);

-- Brésil
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('BR', 'Brazil', 2024, 'PMP', 4200),
    ('BR', 'Brazil', 2024, 'PMI-ACP', 980),
    ('BR', 'Brazil', 2024, 'CAPM', 650),
    ('BR', 'Brazil', 2025, 'PMP', 4650),
    ('BR', 'Brazil', 2025, 'PMI-ACP', 1150),
    ('BR', 'Brazil', 2025, 'CAPM', 750);

-- Japon
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('JP', 'Japan', 2024, 'PMP', 3800),
    ('JP', 'Japan', 2024, 'PMI-ACP', 850),
    ('JP', 'Japan', 2024, 'CAPM', 520),
    ('JP', 'Japan', 2025, 'PMP', 4100),
    ('JP', 'Japan', 2025, 'PMI-ACP', 950),
    ('JP', 'Japan', 2025, 'CAPM', 580);

-- Singapour
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('SG', 'Singapore', 2024, 'PMP', 3200),
    ('SG', 'Singapore', 2024, 'PMI-ACP', 780),
    ('SG', 'Singapore', 2024, 'PMI-RMP', 190),
    ('SG', 'Singapore', 2025, 'PMP', 3500),
    ('SG', 'Singapore', 2025, 'PMI-ACP', 880),
    ('SG', 'Singapore', 2025, 'PMI-RMP', 220);

-- Émirats Arabes Unis
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('AE', 'United Arab Emirates', 2024, 'PMP', 2800),
    ('AE', 'United Arab Emirates', 2024, 'PMI-ACP', 620),
    ('AE', 'United Arab Emirates', 2024, 'PMI-RMP', 150),
    ('AE', 'United Arab Emirates', 2025, 'PMP', 3100),
    ('AE', 'United Arab Emirates', 2025, 'PMI-ACP', 720),
    ('AE', 'United Arab Emirates', 2025, 'PMI-RMP', 180);

-- Pays-Bas
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('NL', 'Netherlands', 2024, 'PMP', 2400),
    ('NL', 'Netherlands', 2024, 'PMI-ACP', 580),
    ('NL', 'Netherlands', 2025, 'PMP', 2650),
    ('NL', 'Netherlands', 2025, 'PMI-ACP', 650);

-- Suisse
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('CH', 'Switzerland', 2024, 'PMP', 1850),
    ('CH', 'Switzerland', 2024, 'PMI-ACP', 420),
    ('CH', 'Switzerland', 2025, 'PMP', 2050),
    ('CH', 'Switzerland', 2025, 'PMI-ACP', 480);

-- Belgique
INSERT INTO country_cert_stats (country_code, country_name, year, cert_type, active_count) VALUES
    ('BE', 'Belgium', 2024, 'PMP', 1200),
    ('BE', 'Belgium', 2024, 'PMI-ACP', 290),
    ('BE', 'Belgium', 2025, 'PMP', 1350),
    ('BE', 'Belgium', 2025, 'PMI-ACP', 330);

-- Afficher les statistiques d'insertion
SELECT
    'Database seeded successfully!' AS status,
    COUNT(*) AS total_records,
    COUNT(DISTINCT country_code) AS countries,
    COUNT(DISTINCT year) AS years,
    COUNT(DISTINCT cert_type) AS cert_types
FROM country_cert_stats;

-- Afficher le top 5 des pays pour PMP en 2025
SELECT
    country_name,
    cert_type,
    active_count
FROM country_cert_stats
WHERE year = 2025 AND cert_type = 'PMP'
ORDER BY active_count DESC
LIMIT 5;
