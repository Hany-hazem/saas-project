# Changelog

All notable changes to the Quality Translation Services SaaS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with OpenSaaS stack
- Project structure creation
- Changelog file creation
- Complete Next.js 14 application structure
- TypeScript configuration with path aliases
- Tailwind CSS setup with shadcn/ui design system
- Global CSS with dark/light theme support
- Root layout with Clerk authentication provider
- Theme provider for dark/light mode switching
- Main dashboard component with project overview
- Project list component with sample data
- Task list component with status tracking
- Client dashboard component for client interactions
- UI components: Button, Card, Tabs, Badge, Progress, Checkbox, Sonner
- Utility functions for class name merging
- Environment configuration example
- Comprehensive README with setup instructions
- Package.json with all necessary dependencies
- PostCSS and Tailwind configuration files
- Supabase client configuration with TypeScript types
- Complete database schema with tables: users, projects, chapters, tasks, notifications
- Row Level Security (RLS) policies for data protection
- Database indexes for optimal performance
- Clerk authentication middleware
- User authentication utilities and role management
- Clerk webhook handler for user synchronization
- Custom React hook for user state management
- API route for fetching user profiles
- Database migration file for initial schema setup
- API route for creating new projects (admins and clients only)
- Modal form for project creation in dashboard
- UI components: Dialog, Input, Textarea for project creation
- Dynamic project list fetching from Supabase
- /api/projects/list API route for user-specific project queries
- API route for fetching tasks for the current user (/api/tasks/list)
- Dynamic task list support in the dashboard (fetches real tasks from Supabase for the current user, with loading and error handling)
- API route for creating tasks (admins, translators, editors) at /api/tasks
- Modal form for task creation and assignment in the dashboard (admins, translators, editors)
- Task list auto-refreshes after task creation in the dashboard
- Project list auto-refreshes after project creation in the dashboard
- API route for fetching translators and editors for task assignment (/api/users/list)
- Task creation modal now features a dropdown for selecting assignees (translators/editors)
- Planned: Task status updates directly from the task list (Not Started, In Progress, Needs Review, Completed)
- API route for updating task status (/api/tasks/status)
- Next: Implement UI for task status updates directly from the task list
- Task status can now be updated directly from the task list, with auto-refresh
- Next: Implement project editing functionality
- Planned: API route for updating project details (project editing)
- API route for updating project details (/api/projects/update)
- Next: Implement dashboard UI for project editing (modal form, auto-refresh)
- Dashboard UI for project editing: modal form and auto-refresh for admins and clients
- Next: Implement in-app notifications for key events (task assignment, status updates, project updates)
- Utility for creating notification records in the database for key events
- Next: Backend integration—create notifications on task assignment and status update
- Backend integration: notifications are now created for task assignment and status update events
- Next: Implement in-app notification UI (view and mark as read)
- Next: Build notification UI component and integrate into dashboard header
- Next: Allow users to mark notifications as read and see unread counts in the UI
- Next: Implement notification dropdown UI and unread badge in dashboard header
- Next: Create API route for fetching and marking notifications as read
- Next: Implement notification API endpoints (GET for fetching, PATCH for marking as read)
- Next: Build notification dropdown UI in dashboard using new API endpoints
- Next: Finish in-app notification dropdown UI and unread badge integration
- Next: Test and polish the notification system end-to-end
- Next: Begin implementing multilingual UI support (English/Arabic)
- Next: Set up i18n infrastructure and add English/Arabic translation files
- Next: Integrate language switcher UI and apply translations to main dashboard components
- Next: Test RTL support and polish the Arabic UI
- Next: Prepare deployment instructions and production readiness checklist
- Next: Finalize documentation and handoff for Quality Translation Services SaaS MVP
- Next: Review feedback and plan for post-MVP improvements
- Next: Archive current release and prepare for next development cycle
- Next: Close out the MVP milestone and celebrate the launch!
- Next: Hand off project to client and provide onboarding/support resources
- Next: Gather user feedback after onboarding and plan for continuous improvement
- Next: Monitor system usage and support the client during initial rollout
- Next: Collect case studies and success stories from first client usage
- Next: Plan for scaling and onboarding additional clients/agencies
- Next: Explore integrations and advanced features for future releases
- Next: Gather stakeholder input for prioritizing the next round of features
- Next: Schedule a retrospective and roadmap planning session
- Next: Document lessons learned and share with the team
- Next: Archive project documentation and close the current milestone
- Set up Jest and React Testing Library for unit and integration testing
- Added `jest.config.js` for configuration (jsdom environment, TypeScript support, setup file for jest-dom, module aliasing)
- Added `jest.setup.js` to include jest-dom matchers
- Installed all required dev dependencies: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `ts-jest`, `@types/jest`, `@types/testing-library__react`
- Created a sample test for the Button component at `src/components/__tests__/button.test.tsx`
- Verified test setup by running the sample test successfully

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [v1.0.0-mvp]

### Added
- Archived project documentation and closed the current milestone
- Created documentation archive structure
- Archived documentation files: README.md, CHANGELOG.md, onboarding-guide.md, support-contacts.md, api-docs.md, design-system.md
- Archived database migrations and environment files

### Changed

### Deprecated

### Removed

### Fixed

### Security