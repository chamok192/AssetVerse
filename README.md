# AssetVerse - Client

A modern corporate asset management system built with React and Vite. AssetVerse helps organizations track, manage, and distribute company assets efficiently.

## Live URL

**Client:** [https://asset-verse.pages.dev](https://asset-verse.pages.dev)

## Key Features

- **Role-Based Access Control** - Separate dashboards for HR Managers and Employees
- **Asset Management** - Add, edit, delete, and track company assets
- **Employee Management** - HR can manage team members and their asset assignments
- **Asset Requests** - Employees can request assets; HR can approve/reject
- **Subscription Packages** - Tiered pricing with Stripe payment integration
- **Real-time Analytics** - Dashboard with charts and statistics for HR
- **Responsive Design** - Fully responsive UI for all device sizes
- **Authentication** - Firebase authentication with JWT token security

## NPM Packages Used

### Dependencies
| Package | Version | Description |
|---------|---------|-------------|
| `react` | ^19.2.0 | UI library |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `react-router-dom` | ^7.10.1 | Client-side routing |
| `@tanstack/react-query` | ^5.90.12 | Data fetching & caching |
| `axios` | ^1.13.2 | HTTP client |
| `firebase` | ^12.6.0 | Authentication |
| `@stripe/react-stripe-js` | ^3.2.1 | Stripe React components |
| `@stripe/stripe-js` | ^6.0.0 | Stripe.js loader |
| `tailwindcss` | ^4.1.17 | Utility-first CSS |
| `framer-motion` | ^12.23.25 | Animations |
| `recharts` | ^3.6.0 | Charts & data visualization |
| `react-icons` | ^5.5.0 | Icon library |
| `react-toastify` | ^11.0.5 | Toast notifications |

### Dev Dependencies
| Package | Version | Description |
|---------|---------|-------------|
| `vite` | ^7.2.4 | Build tool |
| `daisyui` | ^5.5.8 | Tailwind component library |
| `eslint` | ^9.39.1 | Code linting |

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chamok192/AssetVerse
   

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Environment Variables Configuration

Create a `.env` file in the root directory with the following variables:

env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key

# Image Upload (ImgBB)
VITE_IMGBB_API_KEY=your_imgbb_api_key


## my env file data ##
VITE_apiKey=AIzaSyAsNZaDN6Y5S5maXPXwVC0qx8ZcuPe8sKM
VITE_authDomain=assetverse-2121.firebaseapp.com
VITE_projectId=assetverse-2121
VITE_storageBucket=assetverse-2121.firebasestorage.app
VITE_messagingSenderId=538514865576
VITE_appId=1:538514865576:web:544d34aebf83949ce3f19d
VITE_image_host_api_key=fcd695b455743e314811db85b40acbc0
VITE_API_BASE_URL=https://server-asset-verse.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_51SeGgSIMrVTu9bd8sdWW1GtW7pAP6b4abTf2xGcGdSgmBGTOihdrxpAkeFUdF3ZdHCxLXOcuaZZE4QNlXZf2tPTu00BmEQIK9e
##
