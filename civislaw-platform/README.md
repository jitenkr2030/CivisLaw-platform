# CivisLaw - Citizen-First Judicial Understanding Platform

## Overview

CivisLaw is a comprehensive platform designed to bridge the language and comprehension gap between the judicial system and citizens. It provides clear, human-understandable explanations of court processes, documents, and proceedings — without giving legal advice or interfering with judicial authority.

## Core Design Principles

- **Explain, don't advise**: We provide explanations only, never legal advice
- **Empower, don't replace**: We give knowledge to make informed decisions
- **Dignity-first**: Every interaction respects user dignity, especially in sensitive cases
- **Privacy and consent by default**: User data is protected and controlled by the user
- **Language accessibility as a right**: Multiple language support for all citizens

## Core Features

### 1. Court Language → Human Language Engine
Transforms complex legal documents into simple, understandable language. Upload court orders, FIRs, charge sheets, or notices to get plain-language explanations with three-layer output:
- Plain-language explanation
- Meaning summary
- Process impact

### 2. Victim Statement Recorder
A safe, dignified way to record statements in your own language. Features:
- Voice recording in native language
- Automatic transcription
- English translation as secondary layer
- Review and approve before finalization
- Full control over data access

### 3. Court Companion Mode
Real-time explanations of court proceedings:
- Explains current court activity
- Reduces anxiety and confusion
- Prepares citizens for what may be asked
- 8th-grade language level

### 4. AI Court Translator
Real-time translation of spoken court language:
- Subtitles in Hindi or regional languages
- Optional audio translation
- Clearly marked as non-official
- No legal validity

### 5. Legal Word Decoder
One-tap explanations of commonly used legal terms:
- Adjournment, Bailable/Non-bailable
- Cognizable/Non-cognizable
- Stay order
- Real-life examples

### 6. Victim & Case Journey Timeline
Visual, trauma-informed timeline of the legal process:
- FIR → Statement → Medical examination → Charges → Trial → Judgment
- Each stage explains what happens, time expectations, what you need to do

## Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Custom CSS with trauma-informed design system
- **API Routes**: Next.js API routes
- **Language**: JavaScript/React
- **Design**: Mobile-responsive, accessibility-focused

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd civislaw-platform

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: For production AI services
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
GOOGLE_TRANSLATE_API_KEY=your-api-key
```

## Project Structure

```
civislaw-platform/
├── app/
│   ├── api/
│   │   ├── analyze/        # Document analysis API
│   │   ├── translate/      # Translation API
│   │   └── transcribe/     # Transcription API
│   ├── decoder/            # Legal Word Decoder page
│   ├── document-explainer/ # Court Language Engine page
│   ├── recorder/           # Victim Statement Recorder page
│   ├── timeline/           # Case Journey Timeline page
│   ├── translator/         # Court Translator page
│   ├── layout.js           # Root layout with navigation
│   └── page.js             # Home page
├── styles/
│   └── globals.css         # Global styles and design system
├── public/                 # Static assets
├── jsconfig.json           # Path aliases configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
└── README.md              # This file
```

## Design Philosophy

### Trauma-Informed Design

The platform is designed with trauma-informed principles:
- **Calming colors**: Sage green (#4A7C59) and soft neutrals
- **No aggressive alerts**: Avoided red for warnings, using amber instead
- **Predictable navigation**: Users always know where they are
- **Control**: Users have control over their experience
- **Emergency exit**: Quick exit button always available

### Accessibility

- WCAG 2.1 AA compliant
- Large, readable typography (18px base)
- High contrast when needed
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support

### Security & Privacy

- No data collection without consent
- End-to-end encryption ready
- Offline-first capability
- User-owned data model
- No legal advice to prevent liability

## Ethical Guardrails

Built into the platform logic:
- ❌ No legal advice
- ❌ No case outcome prediction
- ❌ No criticism of judges, police, or lawyers
- ✅ Explanation-only responses
- ✅ Educational and process-focused content
- ✅ Respectful, dignity-first language

## User Types Supported

1. **Citizens**: General understanding of court documents and processes
2. **Victims**: Safe, voice-first interaction with trauma-aware experience
3. **NGOs/Legal Aid**: Consent-based assistance without data ownership

## Deployment

### Static Export (Recommended)

The project is configured for static export:

```bash
npm run build
# Output will be in the /out directory
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Deploy the /out directory to Netlify
```

## API Documentation

### POST /api/analyze

Analyze legal documents and generate plain-language explanations.

**Request body:**
```json
{
  "document": "Legal document text...",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plainLanguage": "Simplified explanation...",
    "meaning": "What this means...",
    "processImpact": "What happens next...",
    "keyTerms": [...]
  }
}
```

### POST /api/translate

Translate text between languages.

**Request body:**
```json
{
  "text": "Text to translate...",
  "sourceLang": "en",
  "targetLang": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original": "Text to translate...",
    "translation": "Translated text...",
    "sourceLang": "en",
    "targetLang": "hi"
  }
}
```

### POST /api/transcribe

Transcribe audio recordings.

**Request body:**
```json
{
  "audioData": "base64-encoded-audio...",
  "language": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Transcribed text...",
    "confidence": 0.95,
    "emotionalKeywords": [...]
  }
}
```

## Contributing

This platform is designed for public benefit. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This platform provides educational and informational content only. It does NOT constitute legal advice, legal opinions, or legal recommendations. Always consult a qualified lawyer for legal matters affecting your rights.

The platform acts as an "understanding layer," not a legal authority. Translations and explanations are for comprehension purposes only and have no legal validity.

## Contact

For questions or support, please reach out through the appropriate channels.

---

**Platform Vision**: "Justice does not become fair by being delivered — it becomes fair when it is understood."
