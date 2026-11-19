# Kaam Diary (काम डायरी / କାମ ଡାଏରୀ) — Voice-First 90-Day Work Logger

A voice-first web prototype built for **Resurrect 2026** that helps inter-state migrant construction workers log daily shifts in **Hindi & Odia** and generate a one-page verifiable work record for BOCW welfare board registration/renewal.

## Key Prototype Features
- **Bilingual Voice Interface:** Hindi & Odia language selector with spoken prompts and instant `"bhasha badlo"` switching.
- **Spoken Read-Back Confirmation:** Extracts site, contractor, work type, and hours (including `"aadha din"` = 4 hrs) and never saves without spoken `"Haan"`.
- **Resilience & Edge-Case Guards:** Rejects impossible hours (`0` or `>16`), future dates, low-confidence noise (`<0.60`), flags unverified site/contractor names, and supports offline queueing.
- **90-Day BOCW Progress Tracker & Printable Work Record:** Pre-seeded with 46 days of history and exports a printable one-page work record via `"Mera record banao"`.
- **Interactive Voice Test Panel:** Includes 5 pre-built test utterances (clean Hindi, Odia–Hindi code-mix, noisy site, impossible hours, and misheard site).

## Run Locally
```bash
npm install
npm run dev
