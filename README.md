# Quality Translation Services SaaS

A comprehensive SaaS platform for managing English to Arabic book translation workflows, built with the OpenSaaS stack.

## 🚀 Features

### Core Functionality
- **Project Management**: Create and manage translation projects (one per book)
- **Team Roles**: Admin, Translator, and Editor roles with specific permissions
- **Task Tracking**: View tasks per user with status tracking (Not Started, In Progress, Needs Review, Completed)
- **Client Dashboard**: Clients can upload source material and view project status
- **Notifications**: Email and in-app notifications for task assignments and updates
- **Multilingual UI**: Support for English and Arabic interfaces

### Technical Stack
- **Frontend**: Next.js 14 with TypeScript
- **Authentication**: Clerk
- **Database**: Supabase
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quality-translation-services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the database migrations (see `supabase/migrations/`)
   - Set up Row Level Security (RLS) policies

5. **Set up Clerk Authentication**
   - Create a new Clerk application
   - Configure authentication methods
   - Set up user roles and permissions

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard.tsx     # Main dashboard
│   ├── project-list.tsx  # Project management
│   ├── task-list.tsx     # Task tracking
│   └── client-dashboard.tsx # Client interface
├── lib/                  # Utility functions
│   ├── utils.ts          # Common utilities
│   └── supabase.ts       # Supabase client
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🎯 Core Features Implementation

### Project Management
- Create new translation projects
- Assign projects to translators and editors
- Track progress by chapter or section
- Set deadlines and priorities

### Team Roles
- **Admin**: Full access to manage users and all projects
- **Translator**: Assigned specific sections to translate
- **Editor**: Reviews completed translations

### Task Tracking
- Real-time status updates
- Deadline and priority indicators
- Progress tracking per chapter
- Assignment and reassignment capabilities

### Client Dashboard
- Upload source material
- View project status and progress
- Download completed translations
- Communication with translation team

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Database Schema
The application uses Supabase with the following main tables:
- `projects` - Translation projects
- `tasks` - Individual translation tasks
- `users` - Team members and clients
- `chapters` - Book chapters and sections
- `notifications` - System notifications

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@qualitytranslationservices.com or join our Slack channel.

## Testing

This project uses **Jest** and **React Testing Library** for unit and integration tests.

### Setup
- Jest is configured in `jest.config.js` (jsdom environment, TypeScript support, module aliasing).
- jest-dom matchers are included via `jest.setup.js`.
- All required dev dependencies are installed: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `ts-jest`, `@types/jest`, `@types/testing-library__react`.

### Writing Tests
- Place your test files in the `src/components/__tests__/` directory (or next to the components they test).
- Example: `src/components/__tests__/button.test.tsx` contains a sample test for the Button component.

### Running Tests
- To run all tests:
  ```bash
  npx jest
  ```
- To run a specific test file:
  ```bash
  npx jest path/to/your/testfile.test.tsx
  ```

### Notes
- Tests run in a jsdom environment, suitable for React component testing.
- You can use all jest-dom matchers for more expressive assertions.

---

Built with ❤️ for Quality Translation Services 