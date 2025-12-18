# Arabella Frontend

AI Video Generation Platform - Frontend (Next.js)

## Architecture

This project follows Clean Architecture principles:

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router (Presentation Layer)
│   │   ├── (main)/            # Main application routes
│   │   ├── admin/             # Admin panel routes
│   │   └── template/          # Template detail pages
│   ├── presentation/          # Presentation Layer
│   │   └── components/        # React components
│   │       ├── auth/          # Authentication components
│   │       ├── layout/        # Layout components
│   │       ├── profile/       # Profile components
│   │       ├── templates/     # Template components
│   │       ├── ui/            # UI components
│   │       └── video/         # Video components
│   ├── application/           # Application Layer
│   │   ├── contexts/          # React contexts (Auth)
│   │   └── hooks/             # Custom React hooks
│   ├── domain/                # Domain Layer
│   │   └── types/             # TypeScript type definitions & entities
│   ├── infrastructure/        # Infrastructure Layer
│   │   └── lib/               # External services & utilities
│   │       ├── api.ts         # API client
│   │       ├── image-utils.ts # Image utilities
│   │       └── utils.ts       # General utilities
│   └── lib/                   # Legacy lib (to be migrated)
├── public/                     # Static assets
└── scripts/                    # Build and deployment scripts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `/api/v1`)

**Important**: Never commit `.env.local` files or secrets to git.

## License

MIT

