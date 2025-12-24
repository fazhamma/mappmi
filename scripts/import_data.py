#!/usr/bin/env python3
"""
Script d'import de données PMI Certification Registry vers PostgreSQL

Usage:
    python import_data.py --input data/pmi_registry.csv --year 2025
    python import_data.py --input data/pmi_registry.csv --verbose
    python import_data.py --input data/pmi_registry.csv --dry-run

Format CSV attendu:
    country_code,country_name,year,cert_type,active_count
    US,United States,2025,PMP,35000
    FR,France,2025,PMP,2500
"""

import argparse
import csv
import os
import sys
from typing import List, Dict, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()


class PMIDataImporter:
    """Classe pour importer les données PMI dans PostgreSQL"""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.conn = None
        self.cursor = None

    def log(self, message: str, level: str = "INFO") -> None:
        """Logger les messages si verbose est activé"""
        if self.verbose or level == "ERROR":
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{timestamp}] {level}: {message}")

    def connect(self) -> None:
        """Établir la connexion à la base de données"""
        try:
            self.conn = psycopg2.connect(
                host=os.getenv("DATABASE_HOST", "localhost"),
                port=os.getenv("DATABASE_PORT", "5432"),
                database=os.getenv("DATABASE_NAME", "pmi_certifications"),
                user=os.getenv("DATABASE_USER", "pmi_user"),
                password=os.getenv("DATABASE_PASSWORD", "pmi_password"),
            )
            self.cursor = self.conn.cursor()
            self.log("✅ Connexion à la base de données établie")
        except Exception as e:
            self.log(f"❌ Erreur de connexion à la base de données: {e}", "ERROR")
            raise

    def disconnect(self) -> None:
        """Fermer la connexion à la base de données"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        self.log("🔌 Connexion fermée")

    def validate_row(self, row: Dict[str, str], line_number: int) -> Optional[Dict]:
        """Valider et nettoyer une ligne de données"""
        required_fields = ["country_code", "country_name", "year", "cert_type", "active_count"]

        # Vérifier les champs requis
        for field in required_fields:
            if field not in row or not row[field].strip():
                self.log(
                    f"⚠️  Ligne {line_number}: Champ manquant '{field}'",
                    "WARNING",
                )
                return None

        try:
            # Nettoyer et valider
            country_code = row["country_code"].strip().upper()
            country_name = row["country_name"].strip()
            year = int(row["year"].strip())
            cert_type = row["cert_type"].strip().upper()
            active_count = int(row["active_count"].strip())

            # Validations
            if len(country_code) != 2:
                self.log(
                    f"⚠️  Ligne {line_number}: Code pays invalide '{country_code}' (doit être 2 lettres)",
                    "WARNING",
                )
                return None

            if year < 2000 or year > 2100:
                self.log(
                    f"⚠️  Ligne {line_number}: Année invalide {year}",
                    "WARNING",
                )
                return None

            if active_count < 0:
                self.log(
                    f"⚠️  Ligne {line_number}: Nombre négatif {active_count}",
                    "WARNING",
                )
                return None

            return {
                "country_code": country_code,
                "country_name": country_name,
                "year": year,
                "cert_type": cert_type,
                "active_count": active_count,
            }

        except ValueError as e:
            self.log(
                f"⚠️  Ligne {line_number}: Erreur de conversion {e}",
                "WARNING",
            )
            return None

    def read_csv(self, filepath: str) -> List[Dict]:
        """Lire et valider le fichier CSV"""
        self.log(f"📄 Lecture du fichier CSV: {filepath}")

        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Fichier non trouvé: {filepath}")

        valid_rows = []
        total_rows = 0
        invalid_rows = 0

        with open(filepath, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            # Vérifier les colonnes
            expected_columns = {"country_code", "country_name", "year", "cert_type", "active_count"}
            if not expected_columns.issubset(set(reader.fieldnames or [])):
                raise ValueError(
                    f"Colonnes manquantes dans le CSV. Attendu: {expected_columns}"
                )

            for line_number, row in enumerate(reader, start=2):  # Start at 2 (after header)
                total_rows += 1
                validated_row = self.validate_row(row, line_number)

                if validated_row:
                    valid_rows.append(validated_row)
                else:
                    invalid_rows += 1

        self.log(f"✅ Lignes valides: {len(valid_rows)}/{total_rows}")
        if invalid_rows > 0:
            self.log(f"⚠️  Lignes invalides ignorées: {invalid_rows}", "WARNING")

        return valid_rows

    def import_data(
        self, data: List[Dict], dry_run: bool = False
    ) -> Dict[str, int]:
        """Importer les données dans la base"""
        if dry_run:
            self.log("🧪 Mode DRY-RUN: Aucune donnée ne sera insérée")
            return {"inserted": 0, "updated": 0, "errors": 0}

        inserted = 0
        updated = 0
        errors = 0

        self.log(f"📥 Import de {len(data)} enregistrements...")

        # Utiliser UPSERT (INSERT ... ON CONFLICT ... DO UPDATE)
        upsert_query = """
            INSERT INTO country_cert_stats
                (country_code, country_name, year, cert_type, active_count)
            VALUES %s
            ON CONFLICT (country_code, year, cert_type)
            DO UPDATE SET
                country_name = EXCLUDED.country_name,
                active_count = EXCLUDED.active_count,
                updated_at = CURRENT_TIMESTAMP
            RETURNING (xmax = 0) AS inserted
        """

        try:
            # Préparer les valeurs
            values = [
                (
                    row["country_code"],
                    row["country_name"],
                    row["year"],
                    row["cert_type"],
                    row["active_count"],
                )
                for row in data
            ]

            # Exécuter l'insertion par batch
            execute_values(
                self.cursor,
                upsert_query,
                values,
                template=None,
                page_size=100,
                fetch=True,
            )

            # Compter les insertions vs updates
            results = self.cursor.fetchall()
            inserted = sum(1 for r in results if r[0])
            updated = len(results) - inserted

            self.conn.commit()
            self.log(f"✅ Import terminé: {inserted} insertions, {updated} mises à jour")

        except Exception as e:
            self.conn.rollback()
            self.log(f"❌ Erreur lors de l'import: {e}", "ERROR")
            errors = len(data)
            raise

        return {"inserted": inserted, "updated": updated, "errors": errors}

    def get_statistics(self) -> Dict:
        """Récupérer les statistiques après import"""
        try:
            self.cursor.execute("""
                SELECT
                    COUNT(*) as total_records,
                    COUNT(DISTINCT country_code) as countries,
                    COUNT(DISTINCT year) as years,
                    COUNT(DISTINCT cert_type) as cert_types,
                    SUM(active_count) as total_certifications
                FROM country_cert_stats
            """)
            row = self.cursor.fetchone()

            return {
                "total_records": row[0],
                "countries": row[1],
                "years": row[2],
                "cert_types": row[3],
                "total_certifications": row[4],
            }
        except Exception as e:
            self.log(f"❌ Erreur lors de la récupération des stats: {e}", "ERROR")
            return {}


def main():
    parser = argparse.ArgumentParser(
        description="Import des données PMI Registry vers PostgreSQL"
    )
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        help="Chemin vers le fichier CSV à importer",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Mode verbose (affiche plus de logs)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Mode test (ne fait pas d'insertion réelle)",
    )
    parser.add_argument(
        "--year",
        type=int,
        help="Filtrer uniquement l'année spécifiée (optionnel)",
    )

    args = parser.parse_args()

    print("\n" + "=" * 60)
    print("🗺️  PMI Certification Map - Data Importer")
    print("=" * 60 + "\n")

    importer = PMIDataImporter(verbose=args.verbose)

    try:
        # Lire le CSV
        data = importer.read_csv(args.input)

        if not data:
            print("❌ Aucune donnée valide à importer")
            sys.exit(1)

        # Filtrer par année si spécifié
        if args.year:
            data = [row for row in data if row["year"] == args.year]
            importer.log(f"🔍 Filtré pour l'année {args.year}: {len(data)} enregistrements")

        # Connexion à la base
        importer.connect()

        # Import
        results = importer.import_data(data, dry_run=args.dry_run)

        if not args.dry_run:
            # Afficher les statistiques
            stats = importer.get_statistics()
            print("\n" + "=" * 60)
            print("📊 Statistiques de la base de données")
            print("=" * 60)
            print(f"Total d'enregistrements: {stats.get('total_records', 0):,}")
            print(f"Pays uniques: {stats.get('countries', 0)}")
            print(f"Années disponibles: {stats.get('years', 0)}")
            print(f"Types de certification: {stats.get('cert_types', 0)}")
            print(f"Total de certifications: {stats.get('total_certifications', 0):,}")
            print("=" * 60 + "\n")

        print("✅ Import terminé avec succès!\n")

    except Exception as e:
        print(f"\n❌ Erreur: {e}\n")
        sys.exit(1)
    finally:
        importer.disconnect()


if __name__ == "__main__":
    main()
