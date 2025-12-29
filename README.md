# CivisLaw - Citizen-First Judicial Understanding Platform

## 🎯 Project Overview

CivisLaw is a free, open-source platform designed to bridge the language and comprehension gap between the judicial system and citizens. It provides clear, human-understandable explanations of court processes, documents, and proceedings — without giving legal advice or interfering with judicial authority. The platform acts as an **"understanding layer"**, helping citizens comprehend what is happening in their legal matters while respecting the authority of courts and legal professionals.

## ❌ What This Project Does NOT Do

Before using or contributing to this project, please understand these explicit boundaries:

- **❌ Does NOT provide legal advice** - We explain, but never advise on what actions to take
- **❌ Does NOT predict case outcomes** - We never speculate on how a case will be decided
- **❌ Does NOT interact with courts** - No communication with judges, police, or lawyers
- **❌ Does NOT replace legal representation** - Always consult a qualified lawyer for legal matters
- **❌ Does NOT evaluate judges, police, or lawyers** - We remain neutral and respectful
- **❌ Does NOT collect or sell user data** - Your information stays on your device

## ✨ Core Features

### 1. Court Language → Human Language Engine
Transforms complex legal documents into simple, understandable language:
- **Document Types Supported**: Court orders, FIRs, charge sheets, notices, summons
- **Three-Layer Output**: Plain-language explanation, meaning summary, process impact
- **Multi-Language Support**: English, Hindi, Tamil, Telugu, Bengali, Marathi

### 2. Victim Statement Recorder
A dignified, trauma-aware tool for recording statements:
- **Voice Recording**: Record in your native language with automatic transcription
- **Privacy Controls**: Full control over data access and storage
- **Offline-First**: Works without internet connection
- **Emotional Support**: Sensitive keyword detection with dignity-first design

### 3. AI Court Translator & Companion
Real-time understanding of court proceedings:
- **Real-Time Translation**: Spoken court language translated to your language
- **Court Companion Mode**: Explains current proceedings in simple terms
- **Subtitle Display**: Optional visual subtitles during hearings

### 4. Legal Word Decoder
One-tap explanations of common legal terms:
- **30+ Terms Explained**: Adjournment, Bailable, Cognizable, Stay Order, and more
- **Real-Life Examples**: Practical context for every term
- **Category Filtering**: Browse by topic (Bail, Court Procedures, Documents)

### 5. Case Journey Timeline
Visual guide through the legal process:
- **Criminal Cases**: FIR → Investigation → Trial → Judgment
- **Civil Cases**: Plaint → Evidence → Judgment
- **Family Cases**: Filing → Response → Final Order
- **What to Expect**: Clear guidance at each stage

## 🔒 Offline-First & Privacy-First Design

### Privacy Principles (Privacy-by-Design)

1. **Data Minimization**: We collect only what is necessary
2. **Consent by Default**: Users control their data at every step
3. **End-to-End Encryption**: AES-GCM encryption using Web Crypto API
4. **Zero-Knowledge Architecture**: Encryption keys never leave your device
5. **Local Processing**: Personal documents processed on-device
6. **No Server Storage**: Sensitive data never stored on external servers

### Offline Capabilities

- **Service Worker**: Full app functionality without internet
- **IndexedDB Storage**: Local storage for documents, recordings, and cases
- **Background Sync**: AI requests queued when offline, processed when online
- **PWA Installation**: Install as a native app on any device
- **Offline Legal Terms**: 30+ legal terms available without connection

## 👥 Who This Is For

### Primary Users
- **Citizens** who need to understand court documents or processes
- **Victims** seeking dignity-first support during legal proceedings
- **Self-represented litigants** navigating the system alone

### Secondary Users
- **NGOs and Legal Aid Organizations** requiring consent-based assistance tools
- **Family Members** supporting someone through legal processes
- **Journalists and Researchers** studying judicial accessibility

## 📊 Current Status

- **Status**: Prototype / Beta
- **Platform**: Web Application (PWA)
- **Deployment**: https://civislaw.vercel.app
- **License**: Apache 2.0 (Open Source)

## 🚀 Quick Start

### For Users

1. **Visit**: Open https://civislaw.vercel.app in your browser
2. **Install**: Click "Install App" for offline access
3. **Select Language**: Choose your preferred language
4. **Start Exploring**: Use any feature without creating an account

### For Developers

```bash
# Clone the repository
git clone https://github.com/jitenkr2030/CivisLaw-platform.git
cd CivisLaw-platform

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Custom CSS with trauma-informed design system
- **Storage**: IndexedDB (offline-first)
- **Encryption**: Web Crypto API (AES-GCM)
- **PWA**: Service Worker + Web App Manifest
- **AI**: Hybrid (Cloud API + Local Rule-Based)

## 📁 Project Structure

```
CivisLaw-platform/
├── app/                    # Next.js application
│   ├── api/               # API routes
│   ├── document-explainer/ # Document analysis page
│   ├── decoder/           # Legal terms decoder
│   ├── recorder/          # Statement recorder
│   ├── timeline/          # Case timeline
│   └── translator/        # Court translator
├── components/            # React components
├── public/                # Static assets
│   ├── sw.js             # Service worker
│   └── manifest.json     # PWA manifest
├── utils/                 # Services
│   ├── ai.js             # AI processing
│   ├── crypto.js         # Encryption
│   └── database.js       # Storage
├── styles/               # Global styles
└── docs/                 # Documentation
```

## 🤝 Contributing

We welcome contributions from privacy engineers, accessibility experts, linguists, and NGO collaborators. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and [ETHICS.md](ETHICS.md) before submitting pull requests.

**We specifically welcome:**
- Privacy and security experts
- Accessibility specialists (WCAG compliance)
- Multilingual experts (translation accuracy)
- Legal aid professionals
- Trauma-informed design experts

**We do NOT accept:**
- Changes that add legal advice features
- Integration with third-party tracking
- Collection of user data without explicit consent

## 📄 Important Documents

- [DISCLAIMER.md](DISCLAIMER.md) - Legal disclaimers and limitations
- [ETHICS.md](ETHICS.md) - Ethical boundaries and guidelines
- [PRIVACY.md](PRIVACY.md) - Privacy policy and data handling
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [ROADMAP.md](ROADMAP.md) - Project roadmap and milestones
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Disclaimer

This platform provides educational and informational content only. It does NOT constitute legal advice, legal opinions, or legal recommendations. Always consult a qualified lawyer for legal matters affecting your rights.

**This platform is not:**
- A substitute for legal counsel
- An official court communication channel
- A way to file legal documents
- A replacement for police or legal authorities

## 📞 Support & Resources

### Emergency Contacts (India)
- Police Emergency: 100
- Women's Helpline: 181
- Child Helpline: 1098
- iCall Counseling: 9152987821

### Legal Aid
- State Legal Services Authorities
- District Legal Services Authorities
- National Legal Services Authority (NALSA)

---

## 💚 Our Vision

> "Justice does not become fair by being delivered — it becomes fair when it is understood."

CivisLaw exists to ensure that understanding justice is a right, not a privilege. Every citizen deserves to comprehend what is happening in their legal matters, regardless of their education level, language, or access to legal resources.

---

**Built with dignity, privacy, and accessibility as core values.**
