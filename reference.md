# AI Storyboard Development Reference

## Project Structure
storyboard-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   └── services/
│   │       └── ai/
│   │           ├── flux.py
│   │           └── script_gen.py
│   ├── tests/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── dashboard/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   └── ai/
│   │   └── styles/
│   ├── public/
│   └── next.config.js
└── docker-compose.yml

## Core Updates Needed

### Frontend Modifications
1. Replace Radix with shadcn/ui
2. Add Zustand store
3. Add Together AI integration for Flux
4. Implement script generation UI

### Backend Modifications
1. Update FastAPI endpoints
2. Add Together AI service integration
3. Implement script processing
4. Update authentication flow

## Environment Variables
# Frontend
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Backend
TOGETHER_API_KEY=
DATABASE_URL=

## Database Schema Updates

### Scripts Table
create table if not exists scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  title text,
  content jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

### Shots Table
create table if not exists shots (
  id uuid primary key default gen_random_uuid(),
  script_id uuid references scripts,
  description text,
  frame_url text,
  sequence integer,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

## Key Components

### Script Editor
interface ScriptEditor {
  content: string
  generateShots: () => Promise<Shot[]>
  saveScript: () => Promise<void>
}

### Shot List Manager
interface ShotList {
  shots: Shot[]
  generateFrames: () => Promise<void>
  reorderShots: (fromIndex: number, toIndex: number) => void
}

### Frame Generator
interface FrameGenerator {
  shot: Shot
  generateImage: () => Promise<string>
  regenerate: () => Promise<void>
}

## API Routes
/api/scripts/create
/api/scripts
/api/scripts/:id
/api/shots/generate
/api/shots/:id
/api/frames/generate
/api/frames/:shotId

## Together AI Integration
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("TOGETHER_API_KEY"),
    base_url="https://api.together.xyz/v1"
)

async def generate_frame(prompt: str):
    response = client.images.generate(
        prompt=prompt,
        model="black-forest-labs/FLUX.1-schnell",
        n=1,
    )
    return response