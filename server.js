const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Store latest market data in memory
let marketData = {
  prthHigh: null,
  prthLow: null,
  open8am: null,
  asiaHigh: null,
  asiaLow: null,
  lonHigh: null,
  lonLow: null,
  ibHigh: null,
  ibLow: null,
  ibClose: null,
  ibRangePct: null,
  ibSignal: null,
  alnPattern: null,
  alnBias: null,
  rthOpenType: null,
  rthOpenProb: null,
  sdevP1: null,
  sdevM1: null,
  sdevP2: null,
  sdevM2: null,
  ibExt05High: null,
  ibExt05Low: null,
  ibExt10High: null,
  ibExt10Low: null,
  lastUpdated: null,
  lastEvent: null
};

// TradingView webhook receiver
app.post('/webhook', (req, res) => {
  try {
    const data = req.body;
    console.log('Webhook received:', JSON.stringify(data));

    // Merge incoming data with stored data
    if (data.prthHigh)    marketData.prthHigh    = parseFloat(data.prthHigh);
    if (data.prthLow)     marketData.prthLow     = parseFloat(data.prthLow);
    if (data.open8am)     marketData.open8am     = parseFloat(data.open8am);
    if (data.asiaHigh)    marketData.asiaHigh    = parseFloat(data.asiaHigh);
    if (data.asiaLow)     marketData.asiaLow     = parseFloat(data.asiaLow);
    if (data.lonHigh)     marketData.lonHigh     = parseFloat(data.lonHigh);
    if (data.lonLow)      marketData.lonLow      = parseFloat(data.lonLow);
    if (data.ibHigh)      marketData.ibHigh      = parseFloat(data.ibHigh);
    if (data.ibLow)       marketData.ibLow       = parseFloat(data.ibLow);
    if (data.ibClose)     marketData.ibClose     = parseFloat(data.ibClose);
    if (data.ibRangePct)  marketData.ibRangePct  = parseFloat(data.ibRangePct);
    if (data.ibSignal)    marketData.ibSignal    = data.ibSignal;
    if (data.alnPattern)  marketData.alnPattern  = data.alnPattern;
    if (data.alnBias)     marketData.alnBias     = data.alnBias;
    if (data.rthOpenType) marketData.rthOpenType = data.rthOpenType;
    if (data.rthOpenProb) marketData.rthOpenProb = data.rthOpenProb;
    if (data.sdevP1)      marketData.sdevP1      = parseFloat(data.sdevP1);
    if (data.sdevM1)      marketData.sdevM1      = parseFloat(data.sdevM1);
    if (data.sdevP2)      marketData.sdevP2      = parseFloat(data.sdevP2);
    if (data.sdevM2)      marketData.sdevM2      = parseFloat(data.sdevM2);
    if (data.ibExt05High) marketData.ibExt05High = parseFloat(data.ibExt05High);
    if (data.ibExt05Low)  marketData.ibExt05Low  = parseFloat(data.ibExt05Low);
    if (data.ibExt10High) marketData.ibExt10High = parseFloat(data.ibExt10High);
    if (data.ibExt10Low)  marketData.ibExt10Low  = parseFloat(data.ibExt10Low);

    marketData.lastUpdated = new Date().toISOString();
    marketData.lastEvent   = data.event || 'update';

    res.json({ status: 'ok', event: marketData.lastEvent });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Dashboard polls this endpoint
app.get('/data', (req, res) => {
  res.json(marketData);
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'NQ Edge Backend running',
    lastUpdated: marketData.lastUpdated,
    lastEvent: marketData.lastEvent
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('NQ Edge Backend running on port ' + PORT);
});
