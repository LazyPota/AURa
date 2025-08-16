# AURA - Autonomous Unbiased Reasoning Agent

![AURA Logo](https://via.placeholder.com/200x100/2563eb/ffffff?text=AURA)

AURA is a production-ready autonomous AI agent that runs 100% on-chain on the Internet Computer (ICP), providing real-time cryptocurrency market sentiment analysis by combining price data from CoinGecko with news sentiment analysis from NewsAPI.

## 🚀 Features

### Core Functionality
- **Autonomous Operation**: Runs completely on-chain with 5-minute automated cycles
- **Real-time Sentiment Analysis**: AI-powered keyword-based sentiment scoring
- **Price Monitoring**: Live ICP price tracking with 24h change indicators
- **News Integration**: Automated news fetching and text analysis
- **Professional Dashboard**: Modern React interface with real-time updates

### Technical Highlights
- **100% On-Chain**: Backend runs entirely on Internet Computer canisters
- **HTTP Outcalls**: Secure external API integration with retry logic
- **Stable Memory**: Upgrade-safe data persistence
- **Security**: Caller verification, API key encryption, input sanitization
- **Monitoring**: Comprehensive logging, health checks, performance metrics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│  React Frontend │◄──►│ Motoko Backend  │
│   (ICP Canister)│    │  (ICP Canister) │
└─────────────────┘    └─────────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐
              │ CoinGecko │ │NewsAPI  │ │ Stable  │
              │    API    │ │   API   │ │ Memory  │
              └───────────┘ └─────────┘ └─────────┘
```

### Components
- **Frontend**: React dashboard with real-time updates
- **Backend**: Motoko canister with autonomous operation
- **Sentiment Engine**: AI-powered analysis with confidence scoring
- **Price Oracle**: CoinGecko integration with retry logic
- **News Aggregator**: NewsAPI integration with text extraction
- **Security Layer**: Authentication and input validation
- **Automation Engine**: Timer-based cycles with failure recovery

## 📋 Prerequisites

- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install) >= 0.15.0
- [Node.js](https://nodejs.org/) >= 18.0.0
- [NewsAPI Key](https://newsapi.org/) (free tier available)

## 🛠️ Installation & Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd AURA
npm install
```

### 2. Start Local Internet Computer
```bash
dfx start --background --clean
```

### 3. Deploy Canisters
```bash
# Deploy backend canister
dfx deploy aura-backend

# Deploy frontend canister
dfx deploy aura-frontend
```

### 4. Generate Declarations
```bash
dfx generate aura-backend
```

### 5. Start Frontend Development
```bash
cd src/aura-frontend
npm start
```

### 6. Configure NewsAPI Key
1. Get your free API key from [NewsAPI.org](https://newsapi.org/)
2. Open the AURA dashboard
3. Click the key icon in the header
4. Enter your API key

## 🚀 Production Deployment

### Deploy to IC Mainnet
```bash
# Deploy to mainnet
dfx deploy --network ic

# Verify deployment
dfx canister --network ic status aura-backend
dfx canister --network ic status aura-frontend
```

### Environment Configuration
Create `.env` file:
```env
DFX_NETWORK=ic
CANISTER_ID_AURA_BACKEND=<your-backend-canister-id>
CANISTER_ID_AURA_FRONTEND=<your-frontend-canister-id>
```

## 📊 Usage

### Dashboard Features
- **Real-time Sentiment**: Bullish/Bearish/Neutral classification with confidence scores
- **Price Monitoring**: Live ICP price with 24h change indicators
- **Activity Logs**: Comprehensive system logs with filtering and export
- **System Status**: Cycle count, connection status, last update time
- **Architecture View**: Interactive system component diagram

### API Endpoints
```javascript
// Get dashboard data
const data = await getDashboardData();

// Trigger manual update
await manualUpdate();

// Get system status
const status = await getSystemStatus();

// Set NewsAPI key
await setApiKey("your-api-key");
```

### Manual Operations
```bash
# Trigger manual analysis cycle
dfx canister call aura-backend checkMarketAndSentiment

# Get current logs
dfx canister call aura-backend getLogs

# Check system health
dfx canister call aura-backend healthCheck
```

## 🔧 Configuration

### Backend Configuration
- **Update Interval**: 5 minutes (300 seconds)
- **Retry Attempts**: 3 with exponential backoff
- **Log Rotation**: Maximum 100 entries
- **HTTP Outcall Budget**: 25-50 billion cycles per request

### Frontend Configuration
- **Polling Interval**: 15 seconds
- **Connection Timeout**: 10 seconds
- **Auto-scroll**: Enabled for logs
- **Theme**: Auto-detect system preference

## 🔒 Security

### Authentication
- Caller verification using `ic0.caller()`
- Authorized caller management
- API key encryption and secure storage

### Input Validation
- JSON response sanitization
- Rate limiting protection
- Error boundary implementation
- XSS prevention

### Network Security
- HTTPS-only external API calls
- Request timeout limits
- Retry logic with backoff
- Circuit breaker patterns

## 📈 Monitoring

### Health Checks
```bash
# Backend health
dfx canister call aura-backend healthCheck

# System status
dfx canister call aura-backend getSystemStatus
```

### Metrics
- Cycle count tracking
- Update frequency monitoring
- Error rate analysis
- Performance benchmarks

### Logging
- Structured log entries with timestamps
- Log level filtering (Error, Warning, Success, Info, Debug)
- Export functionality for analysis
- Automatic log rotation

## 🧪 Testing

### Unit Tests
```bash
# Run backend tests
dfx test

# Run frontend tests
cd src/aura-frontend
npm test
```

### Integration Tests
```bash
# Test full cycle
dfx canister call aura-backend checkMarketAndSentiment

# Verify data flow
dfx canister call aura-backend getDashboardData
```

## 🚨 Troubleshooting

### Common Issues

**Connection Failed**
```bash
# Check canister status
dfx canister status aura-backend

# Restart local replica
dfx stop && dfx start --clean
```

**API Key Issues**
- Verify NewsAPI key is valid
- Check API quota limits
- Ensure proper key format

**Memory Issues**
```bash
# Check canister memory
dfx canister status aura-backend

# Clear logs if needed
dfx canister call aura-backend clearLogs
```

### Debug Mode
```bash
# Enable debug logging
dfx canister call aura-backend setLogLevel '("debug")'

# View detailed logs
dfx canister call aura-backend getLogs
```

## 📚 API Documentation

### Backend Methods

#### `checkMarketAndSentiment() : async ()`
Triggers a complete analysis cycle including price fetching, news analysis, and sentiment calculation.

#### `getDashboardData() : async opt DashboardData`
Returns current dashboard data including sentiment, price, and system status.

#### `setApiKey(key: Text) : async Result<(), Text>`
Sets the NewsAPI key for news fetching (requires authorization).

#### `getLogs() : async [Text]`
Returns all system logs with timestamps.

#### `getSystemStatus() : async SystemStatus`
Returns system health and operational metrics.

### Data Types

```motoko
type DashboardData = {
  sentiment: SentimentData;
  price: PriceData;
  status: Text;
  lastUpdate: Int;
  cycleCount: Nat;
};

type SentimentData = {
  score: Int;           // -100 to +100
  confidence: Float;    // 0.0 to 1.0
  timestamp: Int;
  keywords: [Text];
};

type PriceData = {
  price: Float;
  change24h: Float;
  timestamp: Int;
};
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Follow Motoko style guide
- Use TypeScript for frontend
- Add comprehensive error handling
- Include unit tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Internet Computer](https://internetcomputer.org/) for the revolutionary blockchain platform
- [CoinGecko](https://coingecko.com/) for reliable cryptocurrency data
- [NewsAPI](https://newsapi.org/) for comprehensive news coverage
- [DFINITY Foundation](https://dfinity.org/) for the development tools and ecosystem

## 📞 Support

- **Documentation**: [Internet Computer Docs](https://internetcomputer.org/docs)
- **Community**: [DFINITY Forum](https://forum.dfinity.org/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [DFINITY Discord](https://discord.gg/cA7y6ezyE2)

---

**AURA** - Bringing autonomous AI to the decentralized web 🚀