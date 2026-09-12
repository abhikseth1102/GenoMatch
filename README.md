# GenoMatch

AI-Assisted Couple Carrier-Compatibility & Offspring Risk Platform for Hemoglobinopathies

## Overview
GenoMatch is an educational decision-support web platform that calculates the reproductive risk for a couple's offspring based on raw DNA sequence analysis of the HBB gene. It aims to identify carrier status for conditions like sickle cell disease and ß-thalassemia, handling compound heterozygosity effectively.

## Architecture & Defensibility
- **Backend (Flask + Python):** Evaluates uploaded FASTA sequences against the canonical NCBI RefSeq using a strict, deterministic Needleman-Wunsch algorithm for global alignment. This avoids the "black box" nature of deep learning, ensuring explainability.
- **Variant Classification:** Detected variants are classified against a curated SQLite/in-memory database sourced from clinical databases like HbVar and ClinVar.
- **Risk Engine:** A pure Mendelian probability engine computes precise offspring risk combinations.
- **Frontend (Next.js):** Provides a beautiful, interactive visual representation of the gene alignment and a Recharts-powered risk dashboard.

## Tech Stack
- Frontend: Next.js 16 (React), Tailwind CSS, Recharts, Lucide
- Backend: Flask, Python, Pure Algorithm Implementation
- Data: NCBI Gene ID 3043 reference

## Setup Instructions
### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python -m flask --app app/main run --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

