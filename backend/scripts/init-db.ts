import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const runSQLScript = async (scriptPath: string): Promise<void> => {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'pmi_user',
    password: process.env.DATABASE_PASSWORD || 'pmi_password',
    database: process.env.DATABASE_NAME || 'pmi_certifications',
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to database');

    const sqlScript = fs.readFileSync(scriptPath, 'utf-8');
    console.log(`📄 Executing script: ${path.basename(scriptPath)}`);

    await client.query(sqlScript);
    console.log('✅ Script executed successfully');
  } catch (error) {
    console.error('❌ Error executing SQL script:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
};

const main = async () => {
  try {
    console.log('\n🚀 Initializing PMI Certification Map Database\n');

    // Exécuter le script d'initialisation
    const initScriptPath = path.join(__dirname, 'init-db.sql');
    await runSQLScript(initScriptPath);

    // Demander si on doit seed la base
    const shouldSeed = process.argv.includes('--seed');
    if (shouldSeed) {
      console.log('\n🌱 Seeding database with sample data\n');
      const seedScriptPath = path.join(__dirname, 'seed-db.sql');
      await runSQLScript(seedScriptPath);
    } else {
      console.log('\n💡 Tip: Run with --seed flag to populate with sample data');
      console.log('   Example: npm run db:init -- --seed\n');
    }

    console.log('\n🎉 Database initialization complete!\n');
  } catch (error) {
    console.error('\n💥 Database initialization failed\n');
    process.exit(1);
  }
};

main();
