# Creator Dashboard

A full-featured web application built with **Next.js** and **Firebase**, designed to allow creators to register, log in, and manage their content through a personalized dashboard.

![Creator Dashboard](https://api.placeholder.com/600/300)

## 🚀 Features

* ✨ Creator Registration & Login
* 🔐 Firebase Authentication (Email/Password)
* 🧭 Role-based Routing (e.g., Admin vs. Creator dashboards)
* 🗂️ Dynamic Pages (Register, Login, Dashboard, etc.)
* 🖌️ Modern UI with Tailwind CSS
* 🔔 Interactive notifications with React Hot Toast
* ⚡ Optimized for performance with Next.js
* 🔄 Auto Routing with Next.js App Router
* 🧹 Clean Project Structure with Reusable Components
* 🔧 Environment Configuration using `.env.local`

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase account (for authentication and deployment)

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/creator-dashboard.git
cd creator-dashboard
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying files in the `app` directory. The pages auto-update as you edit the files.

## 📂 Project Structure

```
creator-dashboard/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin-specific pages
│   ├── dashboard/        # Creator dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.js         # Root layout with providers
│   └── page.js           # Homepage
├── components/           # Reusable UI components
├── lib/                  # Utility functions and Firebase config
├── public/               # Static assets
├── styles/               # Global styles
└── ...config files
```

## 🔄 API Routes

The backend API is served from a separate server running on port 3001. Make sure to start the API server:

```bash
# In a separate terminal
cd api
npm run dev
```

## 📱 Features Showcase

### Authentication

- Email/password login
- User registration with role selection
- Protected routes based on authentication status

### Dashboard

- Content management interface
- Analytics and statistics
- User profile management

## 🚢 Deployment

### Deploy on Firebase

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize your project:
```bash
firebase init
```

4. Build your Next.js app:
```bash
npm run build
# or
yarn build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

### Alternative: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🧠 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Firebase Documentation](https://firebase.google.com/docs) - explore Firebase services
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [React Hot Toast](https://react-hot-toast.com/) - toast notifications for React

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Created with ❤️ by Hemant Rajput
