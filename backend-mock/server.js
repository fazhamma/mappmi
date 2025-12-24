const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Données mock
const mockData = {
  countries: [
    { country_code: 'US', country_name: 'United States', total: 47280, by_cert_type: { PMP: 35000, 'PMI-ACP': 8000, 'PMI-RMP': 2000, 'PMI-SP': 1050, PgMP: 720, PfMP: 200, CAPM: 4500 } },
    { country_code: 'IN', country_name: 'India', total: 31580, by_cert_type: { PMP: 22000, 'PMI-ACP': 5000, 'PMI-RMP': 1000, CAPM: 3200, PgMP: 380 } },
    { country_code: 'CN', country_name: 'China', total: 26200, by_cert_type: { PMP: 19500, 'PMI-ACP': 4200, CAPM: 2500 } },
    { country_code: 'GB', country_name: 'United Kingdom', total: 12530, by_cert_type: { PMP: 9200, 'PMI-ACP': 2400, 'PMI-RMP': 650, PgMP: 280 } },
    { country_code: 'CA', country_name: 'Canada', total: 12230, by_cert_type: { PMP: 8500, 'PMI-ACP': 2100, 'PMI-RMP': 480, CAPM: 1150 } },
    { country_code: 'DE', country_name: 'Germany', total: 8870, by_cert_type: { PMP: 6800, 'PMI-ACP': 1650, 'PMI-RMP': 420 } },
    { country_code: 'AU', country_name: 'Australia', total: 7700, by_cert_type: { PMP: 5900, 'PMI-ACP': 1450, 'PMI-RMP': 350 } },
    { country_code: 'BR', country_name: 'Brazil', total: 6550, by_cert_type: { PMP: 4650, 'PMI-ACP': 1150, CAPM: 750 } },
    { country_code: 'JP', country_name: 'Japan', total: 5630, by_cert_type: { PMP: 4100, 'PMI-ACP': 950, CAPM: 580 } },
    { country_code: 'SG', country_name: 'Singapore', total: 4600, by_cert_type: { PMP: 3500, 'PMI-ACP': 880, 'PMI-RMP': 220 } },
    { country_code: 'AE', country_name: 'United Arab Emirates', total: 4000, by_cert_type: { PMP: 3100, 'PMI-ACP': 720, 'PMI-RMP': 180 } },
    { country_code: 'FR', country_name: 'France', total: 3880, by_cert_type: { PMP: 2500, 'PMI-ACP': 800, 'PMI-RMP': 200, CAPM: 380 } },
    { country_code: 'NL', country_name: 'Netherlands', total: 3300, by_cert_type: { PMP: 2650, 'PMI-ACP': 650 } },
    { country_code: 'CH', country_name: 'Switzerland', total: 2530, by_cert_type: { PMP: 2050, 'PMI-ACP': 480 } },
    { country_code: 'BE', country_name: 'Belgium', total: 1680, by_cert_type: { PMP: 1350, 'PMI-ACP': 330 } },
  ]
};

// Global stats
app.get('/api/stats/global', (req, res) => {
  const total = mockData.countries.reduce((sum, c) => sum + c.total, 0);
  const by_cert_type = {};

  mockData.countries.forEach(country => {
    Object.entries(country.by_cert_type).forEach(([type, count]) => {
      by_cert_type[type] = (by_cert_type[type] || 0) + count;
    });
  });

  res.json({
    total,
    by_cert_type,
    countries_count: mockData.countries.length,
    last_update: new Date().toISOString()
  });
});

// Stats by country
app.get('/api/stats/by-country', (req, res) => {
  res.json(mockData.countries);
});

// Country detail
app.get('/api/stats/country/:code', (req, res) => {
  const country = mockData.countries.find(c => c.country_code === req.params.code.toUpperCase());

  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }

  const certifications = Object.entries(country.by_cert_type).map(([cert_type, active_count]) => ({
    cert_type,
    active_count,
    year: 2025
  }));

  res.json({
    country_code: country.country_code,
    country_name: country.country_name,
    total: country.total,
    certifications,
    evolution: {
      2024: Math.floor(country.total * 0.9),
      2025: country.total
    }
  });
});

// Cert types
app.get('/api/stats/cert-types', (req, res) => {
  const types = new Set();
  mockData.countries.forEach(c => {
    Object.keys(c.by_cert_type).forEach(type => types.add(type));
  });
  res.json(Array.from(types).sort());
});

// Years
app.get('/api/stats/years', (req, res) => {
  res.json([2025, 2024, 2023]);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'mock',
    environment: 'development'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Mock Backend API running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/health`);
  console.log(`   - http://localhost:${PORT}/api/stats/global`);
  console.log(`   - http://localhost:${PORT}/api/stats/by-country`);
});
