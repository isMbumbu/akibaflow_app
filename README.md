# AkibaFlow - Personal Finance Management App

AkibaFlow is a comprehensive personal finance management mobile application built with React Native and Expo. It helps users track their income, expenses, manage multiple accounts, set budgets, and automatically detect transactions via SMS messages.

## Features

### Core Functionality

- **Multi-Account Management**: Support for checking, savings, and credit accounts
- **Transaction Tracking**: Record and categorize income and expense transactions
- **Budget Management**: Set and monitor spending budgets by category
- **SMS Transaction Detection**: Automatically detect and categorize bank transactions from SMS (demo mode)
- **Real-time Balance Updates**: Live calculation of account balances and total portfolio value

### User Experience

- **Intuitive UI**: Clean, modern interface with dark theme
- **Offline Support**: Local data persistence with Redux Persist
- **Secure Authentication**: JWT-based user authentication
- **Cross-Platform**: Works on iOS, Android, and Web

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **State Management**: Redux Toolkit for global state, Zustand for local state
- **API Integration**: RTK Query for efficient API calls and caching
- **File-based Routing**: Expo Router for seamless navigation

## Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **State Management**: Redux Toolkit, Zustand
- **API Client**: RTK Query
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Charts**: React Native Chart Kit
- **Storage**: AsyncStorage with Redux Persist
- **Icons**: Expo Vector Icons

## Screenshots

_(Add screenshots of your app here)_

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Backend Setup

This app requires a backend API server. The default configuration points to `http://localhost:8000/api/v1`.

1. Set up the backend server (refer to the backend repository)
2. Update the API URL in `.env` if needed:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://your-backend-url/api/v1
   ```

### App Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd akibaflow_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/emulator**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## Usage

### Getting Started

1. **Register**: Create a new account or log in with existing credentials
2. **Add Accounts**: Set up your bank accounts (checking, savings, credit)
3. **Create Categories**: Customize transaction categories or use defaults
4. **Add Transactions**: Manually add income/expense transactions
5. **Enable SMS Detection**: Allow automatic transaction detection from SMS

### Key Screens

- **Home**: Overview of total balance and recent transactions
- **Accounts**: Manage your financial accounts
- **Transactions**: View and filter all transactions
- **Budgets**: Set and track spending budgets
- **Categories**: Organize transactions by category
- **Profile**: Manage user settings

## API Integration

The app integrates with a REST API backend. Key endpoints include:

- `POST /auth/login` - User authentication
- `GET /accounts` - Retrieve user accounts
- `POST /transactions` - Create new transactions
- `GET /categories` - Get transaction categories
- `GET /budgets` - Retrieve budget information

## Project Structure

```
akibaflow_app/
├── app/                    # Main application screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   ├── login.tsx          # Authentication screens
│   └── ...
├── components/            # Reusable UI components
├── server/                # API integration (RTK Query)
│   ├── accountsApi.ts     # Account-related API calls
│   ├── transactionsApi.ts # Transaction API calls
│   └── types.ts          # TypeScript type definitions
├── store.ts              # Redux store configuration
├── constants/            # App constants and themes
├── hooks/                # Custom React hooks
└── assets/               # Images and static assets
```

## Security

- JWT tokens for authentication
- Secure storage of sensitive data
- No direct access to SMS content (demo mode only)
- Encrypted local storage for user data

## Deployment

### Build for Production

1. **Configure EAS Build** (if using Expo Application Services)

   ```bash
   npm install -g @expo/cli
   eas login
   ```

2. **Build for platforms**

   ```bash
   # Build for all platforms
   npm run build

   # Build for specific platform
   npm run build:android
   npm run build:ios
   ```

3. **Submit to stores**
   - iOS: Use EAS Submit or Xcode
   - Android: Use EAS Submit or Android Studio

## Testing

```bash
# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons from [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- Charts powered by [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)

---

**Note**: This app is currently in demo mode for SMS detection. Full SMS reading requires native modules beyond Expo's capabilities and would need custom development or third-party services in production.
