# Historia

A modern web application for managing and exploring Samudera Asset Archive, built with Next.js 15 and React 19.

## 🚀 Features

- **🔐 Authentication System**: Secure login with role-based access control
- **👥 User Management**: Different interfaces for users and administrators
- **🎨 Modern UI**: Beautiful, responsive design with dark/light theme support
- **📱 Mobile Responsive**: Optimized for all device sizes
- **⚡ Real-time Data**: TanStack Query for efficient data fetching and caching
- **🛡️ Type Safety**: Full TypeScript support throughout the application

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd historia-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_ENV=DEV
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication

The application uses a role-based authentication system:

- **User Role**: Redirects to `/explore` after login
- **Admin Role**: Redirects to `/dashboard` after login
- **JWT Tokens**: Stored securely in localStorage
- **Automatic Logout**: Handles token expiration and logout

### Authentication Flow

1. User submits login credentials
2. Backend validates and returns JWT token
3. Frontend stores token and user data
4. Role-based redirect to appropriate dashboard
5. Protected routes check authentication status

## 🎨 UI Components

Built with a custom component library using:

- **Shadcn UI**: Accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Button, Card, Input, Sidebar, etc.
- **Theme Support**: Dark/light mode toggle

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## �� State Management

- **TanStack Query**: Server state management
- **React Hooks**: Local component state
- **Context API**: Theme and authentication state
- **Optimistic Updates**: Smooth user experience

## 🆘 Support

For support, create an issue in the repository.

---

Built with ❤️ for Samudera Historia
