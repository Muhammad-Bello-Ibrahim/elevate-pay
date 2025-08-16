# Elevatex Backend API

A secure, automated backend API for the Elevatex subscription-based referral platform, built with Node.js, Express.js, and PostgreSQL/SQLite.

## 🚀 Features

- **Authentication System**: JWT-based auth with OTP verification
- **Referral Management**: Multi-level referral tracking and placement
- **Wallet System**: Payments, withdrawals, and transaction history
- **Notification System**: Push notifications and user alerts
- **Leaderboard & Gamification**: Rankings and achievement badges
- **Security**: Rate limiting, input validation, password hashing
- **Database**: PostgreSQL (production) / SQLite (development)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

## 🔧 Installation

1. **Clone and navigate to backend**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**:
   ```bash
   # Development (SQLite - automatic)
   npm run dev
   
   # Production (PostgreSQL)
   npm run migrate
   ```

4. **Start Server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/verify-otp` - Verify phone number
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Update password
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update profile

### Referral System
- `POST /api/referrals/generate` - Generate referral link
- `GET /api/referrals` - View referrals
- `GET /api/referrals/tree` - Downline tree
- `POST /api/referrals/join` - Handle placement

### Wallet & Transactions
- `POST /api/wallet/fund` - Fund wallet
- `POST /api/wallet/activate` - Pay activation fee (₦3,000)
- `POST /api/wallet/withdraw` - Withdraw funds
- `GET /api/wallet/transactions` - Transaction history
- `GET /api/wallet/balance` - Balance info

### Notifications
- `GET /api/notifications` - User notifications
- `POST /api/notifications/push` - Send push notification

### Leaderboard
- `GET /api/leaderboard` - Top earners
- `GET /api/leaderboard/badges` - User badges

## 📊 Earning Structure

- **Level 1**: ₦200 per referral
- **Level 2**: ₦150 per referral  
- **Level 3**: ₦100 per referral
- **Level 4**: ₦50 per referral
- **Level 5**: ₦50 per referral

## 🔐 Authentication

All protected endpoints require a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/users/me
```

## 📝 Request/Response Format

### Request Example:
```json
{
  "name": "John Adebayo",
  "phone": "08012345678",
  "email": "john@example.com",
  "nin": "12345678901",
  "password": "Password123!"
}
```

### Response Format:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user_id": "uuid",
    "phone": "08012345678",
    "referral_code": "johnadebayo-abc123"
  }
}
```

## 🧪 Testing

### Health Check:
```bash
curl http://localhost:5000/health
```

### User Signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Adebayo",
    "phone": "08012345678", 
    "email": "john@example.com",
    "nin": "12345678901",
    "password": "Password123!"
  }'
```

### OTP Verification:
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "08012345678",
    "otp": "123456"
  }'
```

## 🗄️ Database Schema

### Key Tables:
- **users**: User accounts, profiles, referral codes
- **referrals**: Referral relationships and placements  
- **transactions**: All financial transactions
- **notifications**: User notifications and alerts
- **leaderboards**: Monthly rankings and statistics

## 🔒 Security Features

- **Rate Limiting**: 5 req/15min (auth), 100 req/15min (general)
- **Input Validation**: Joi schemas for all endpoints
- **Password Security**: bcrypt hashing with salt
- **JWT Tokens**: Access + refresh token system
- **CORS Protection**: Configurable origins
- **Request Logging**: Winston logger with file output

## 🌍 Environment Variables

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elevatex_db
ACTIVATION_FEE=3000
LEVEL_1_PAYOUT=200
# ... see .env.example for full list
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/    # Route handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth, validation, etc.
│   ├── services/      # Business logic
│   ├── utils/         # Helpers and utilities
│   └── config/        # Configuration files
├── logs/              # Application logs
└── dist/              # Compiled JavaScript
```

## 🚀 Deployment

### Production Setup:
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and start the application

### Recommended Hosting:
- **Backend**: Railway, Render, or AWS
- **Database**: Supabase, AWS RDS, or managed PostgreSQL
- **Caching**: Redis for sessions and leaderboards

## 📞 Support

For issues or questions about the backend API, please check the logs directory for detailed error information.

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the existing React Native + Expo frontend. Simply update the API base URL in your frontend configuration to point to this backend instance.