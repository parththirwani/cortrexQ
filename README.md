# CortexQ

- Built **CortexQ**, an **AI-powered fashion recommendation engine** using semantic search to deliver personalized clothing suggestions.
- Implemented **semantic prompt enrichment** to refine user queries and fetch top 50 products via **Google Search (SerpAPI)**.
- Developed a **custom re-ranker model** to prioritize products based on **price, reviews, and user preferences** from past likes.
- Added **social features** – follow other users, explore their liked products, and discover **weekly top trends**.
- Curated **fashion inspirations** to help users explore new styles and outfit ideas.
- Designed **frontend with Next.js** and **Postgres** for scalable database management.
- Integrated **Gemini LLM** for search contextualization and **Google Auth** for secure authentication.
- **Dockerized** the application for consistent deployment and integrated **Firebase** for additional backend services.

## Setup

### 1. Install Dependencies
```bash
cd cortex
bun install
```

### 2. Setup Database

#### For Mac and Linux users
```bash
cd packages/db
chmod +x ./setupDB.sh
./setupDB.sh
```


### 3. Run local server
```bash
bun dev
```
