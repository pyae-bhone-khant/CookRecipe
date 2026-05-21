# CookCraft

A modern recipe sharing platform built with Next.js, featuring user authentication, recipe management, social interactions, and admin approval workflow.

## Features

- **User Authentication**
  - Sign up and login with email/password
  - Password reset functionality
  - User profile management with avatar and cover image
  - Role-based access (user/admin)

- **Recipe Management**
  - Create, edit, and delete recipes
  - Upload recipe images and videos
  - Categorize recipes
  - Admin approval workflow (pending/approve/reject)
  - Cooking time and pre-cooking time tracking

- **Social Interactions**
  - Like and favorite recipes
  - Comment on recipes with reply support
  - Rate recipes (1-5 stars)
  - View recipe history and activity

- **Notifications**
  - Real-time notifications for user activities
  - Mark notifications as read

- **Admin Dashboard**
  - Manage recipe approvals
  - View user statistics and analytics
  - Monitor platform activity

## Tech Stack

- **Frontend Framework**: Next.js 15.3.8 (App Router)
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Emotion, Styled Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Form Handling**: React Hook Form with Yup validation
- **File Upload**: Multer, Formidable
- **Charts**: Chart.js, Recharts
- **Animations**: Framer Motion, AOS
- **Email**: Nodemailer
- **Real-time**: Socket.IO Client

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cookCraft-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/cookcraft"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

## Running the Application

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
cookCraft-main/
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
├── public/
│   ├── images/           # Static images
│   └── uploads/          # User-uploaded files
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   ├── about/        # About page
│   │   └── recipes/      # Recipe pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utility libraries
│   │   ├── auth.js       # Authentication configuration
│   │   ├── env.js        # Environment variables
│   │   └── prisma.js     # Prisma client
│   └── middleware.js     # Next.js middleware
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

## Database Schema

The application uses the following main models:
- **User**: User accounts with profiles and roles
- **Recipe**: Recipe content with approval status
- **Category**: Recipe categories
- **Comment**: Recipe comments with reply support
- **Like**: Recipe likes
- **Favourite**: User favorites
- **Rating**: Recipe ratings
- **History**: User activity history
- **Notification**: User notifications
- **PasswordResetToken**: Password reset tokens

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private.

## Support

For support, please contact the development team.