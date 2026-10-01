# PlacementIQ

AI-powered placement preparation platform for Indian college students, with a dedicated faculty portal for placement coordinators and colleges.

**Live app:** https://placementiq.lovable.app

## Features

### For students
- Adaptive AI mock tests (aptitude, reasoning, verbal, technical, coding)
- Company-specific simulations (TCS, Infosys, Wipro, Accenture, and more)
- AI Mistake Notebook — every wrong answer is saved with an AI explanation
- AI chat assistant with persistent history across devices
- Daily streaks, badges, and achievements
- Company readiness scoring with strengths / gaps breakdown
- Study-time and attendance tracking
- Real-time notifications
- English / Hindi UI toggle
- Mobile-first PWA + Capacitor-ready native shell

### For faculty
- Batch-level readiness dashboard and analytics
- AI-generated insights, per-student deep dives, and PDF reports
- Assignment creation, drives, and announcements
- Attendance marking and study-time visibility

## Tech stack

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS v3, shadcn/ui
- **Backend:** Lovable Cloud (managed Supabase — Postgres, Auth, Storage, Edge Functions, Realtime)
- **AI:** Lovable AI Gateway (Gemini) via Supabase Edge Functions
- **Mobile:** Capacitor
- **Charts / PDF:** Recharts, jsPDF, jspdf-autotable

## Project structure

```
src/
├── components/       # Reusable UI + feature components
│   ├── ui/           # shadcn primitives
│   └── faculty/      # Faculty portal modules
├── pages/            # Route-level pages
├── hooks/            # Custom React hooks
├── lib/              # Analytics, utils
├── integrations/
│   └── supabase/     # Auto-generated client + types (do not edit)
└── assets/           # Images, icons
supabase/
├── functions/        # Deno Edge Functions (AI, evaluation, insights)
├── migrations/       # SQL schema history
└── config.toml       # Function config
.github/workflows/    # CI pipeline
```

## Local development

```bash
bun install
cp .env.example .env    # fill in your Cloud project values
bun run dev
```

Open http://localhost:8080

## Database

All schema changes live in `supabase/migrations/`. Core tables:

| Table | Purpose |
|-------|---------|
| `profiles` | Student / faculty profile data |
| `questions`, `question_assignments` | AI-generated question bank + assignments |
| `test_attempts`, `mock_tests` | Test scores and history |
| `student_progress` | Learning progress per topic |
| `ai_chat_history` | Persistent AI conversations |
| `mistake_notebook` | Wrong answers with AI explanations |
| `attendance`, `study_sessions` | Attendance and learning time |
| `company_readiness` | Per-company readiness scores |
| `badges`, `user_badges`, `streaks` | Achievements and gamification |
| `notifications` | Real-time in-app notifications |
| `placement_drives`, `faculty_announcements` | Faculty broadcasts |
| `certificates` | Awarded certificates |

Row-Level Security is enabled on every table. Students see only their own rows; faculty read all student data via the `is_faculty(uuid)` security-definer helper.

## Authentication

- Email + password with HIBP leaked-password protection
- Role-based access (student / faculty) selected at signup
- Password reset via `/reset-password`
- JWT-backed sessions handled by Supabase Auth

## CI/CD

`.github/workflows/ci.yml` runs on every push and PR to `main`:
1. Install dependencies (Bun)
2. TypeScript type check
3. Lint
4. Production build

Add these repository secrets in GitHub → Settings → Secrets and variables → Actions:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Deployment

- **Preview builds:** every change previews automatically in Lovable
- **Production:** click *Publish* in the Lovable editor, or deploy the built `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages)
- **Mobile:** `bunx cap sync` after building to package for iOS / Android

## Contributing

1. Fork and clone
2. `bun install`
3. Create a feature branch
4. Commit with clear messages
5. Open a PR

## License

Proprietary — all rights reserved.
## Team Contributions
###Harishanandakumar
###ANGELIN B
-Contributed to the development and testing of the PlacementIQ platform.
-Worked on improving the user experience and project documentation.