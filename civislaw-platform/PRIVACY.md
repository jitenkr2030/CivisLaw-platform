# PRIVACY.md - Privacy Policy and Data Handling

## Introduction

At CivisLaw, we believe that **privacy is a fundamental right**. This document explains how we handle your data, what we collect (and more importantly, what we DON'T collect), and how we protect your information.

**Our Core Promise**: We do not collect, store, or sell your personal data. Anything you share with CivisLaw stays on your device.

---

## Data Collection Philosophy

### What We Do NOT Collect

- ❌ Personal identification information (names, addresses, phone numbers)
- ❌ Case details or court documents
- ❌ Recording data
- ❌ Location information
- ❌ Usage analytics
- ❌ Cookies or tracking data
- ❌ Any data that could identify you

### What We Might Process (Temporarily)

When you use certain features, data may be processed **temporarily** on your device:

- **Document Text**: Processed locally for analysis, never sent to servers
- **Audio Recording**: Recorded and transcribed on your device
- **Case Notes**: Stored encrypted on your device only
- **Translations**: Cached locally for offline access

This data is:
- ✅ Encrypted using AES-GCM
- ✅ Stored only on your device
- ✅ Never transmitted to external servers
- ✅ Deleted when you choose to delete it

---

## Privacy-by-Design Principles

### 1. Data Minimization

We collect only what is strictly necessary for the feature to work. If a feature doesn't need your data, we don't ask for it.

**Example**: The Legal Word Decoder works completely offline with no data collection.

### 2. Consent by Default

Every data-related action requires your explicit consent:
- You must approve document uploads
- You must approve recording creation
- You must approve enabling privacy features
- You can revoke consent at any time

### 3. On-Device Processing

All sensitive processing happens on your device:
- Document analysis uses local AI when offline
- Audio transcription uses device capabilities
- Encryption keys never leave your device

### 4. No Server Storage

We do not have servers that store your data:
- No database of user documents
- No recording archives
- No case history logs
- No personal information databases

### 5. Transparency

We are open about how the app works:
- All code is open source
- Encryption happens in plain sight
- You can inspect what data is stored

---

## Technical Privacy Protections

### Encryption

We use **AES-GCM encryption** via the Web Crypto API:

```javascript
// Encryption happens locally
const encrypted = await cryptoService.encrypt(data);
// Only encrypted data is ever stored
```

**Key Points**:
- 256-bit encryption
- PBKDF2 key derivation
- Random IV for each encryption
- Keys derived from your passphrase

### Local Storage

All data is stored in **IndexedDB** on your device:

- Documents → Encrypted local storage
- Recordings → Encrypted local storage
- Notes → Encrypted local storage
- Settings → Local storage only

### PII Redaction

Before any data leaves your device (for cloud AI features):

1. Names are detected and replaced
2. Phone numbers are masked
3. Email addresses are removed
4. Addresses are redacted
5. IDs (Aadhaar, etc.) are blocked

Only **sanitized text** is ever sent to cloud services.

---

## Your Rights

You have complete control over your data:

### Right to Access
You can see all data stored on your device through the app.

### Right to Rectification
You can update any stored information.

### Right to Deletion
You can delete all data with one tap.

### Right to Portability
You can export your data at any time.

### Right to Withdraw Consent
You can disable any data processing feature.

---

## How to Exercise Your Rights

### View Your Data
Open the app and navigate to Settings → Privacy Dashboard

### Delete Your Data
Settings → Privacy → Delete All Data

### Export Your Data
Settings → Privacy → Export My Data

### Disable Features
Settings → Privacy → Manage Permissions

---

## Third-Party Services

We do not use third-party analytics or tracking:

- ❌ No Google Analytics
- ❌ No Facebook Pixel
- ❌ No advertising networks
- ❌ No data brokers

### Optional Cloud Services

Some features optionally use cloud AI (only when you choose):

- **Translation**: Cloud API (opt-in only)
- **Document Analysis**: Cloud API (opt-in only)

These services receive only:
- Sanitized text (PII removed)
- No identifying information
- No personal documents

---

## Children's Privacy

Our platform is not designed for children under 13:

- We do not knowingly collect children's data
- Parents can request deletion of any child data
- We encourage parental guidance for minor users

---

## International Compliance

This privacy policy is designed to comply with:

- **GDPR** (European Union)
- **CCPA** (California)
- **IT Act** (India)
- **LGPD** (Brazil)

Regardless of your location, you receive the same high level of privacy protection.

---

## Security Measures

### Technical Measures
- End-to-end encryption
- Secure local storage
- No external data transmission
- Regular security audits

### Physical Measures
- No physical access to user data
- No server infrastructure
- No third-party data handling

### Organizational Measures
- Minimal data access
- Privacy-trained team
- Clear data handling policies

---

## Data Breach Protocol

In the unlikely event of a security incident:

1. **Detection**: Automated monitoring
2. **Response**: Immediate containment
3. **Notification**: Users informed within 72 hours
4. **Remediation**: Security fixes deployed
5. **Review**: Process improvements implemented

**However**, since all data is encrypted and stored only on user devices, a traditional "data breach" is not possible.

---

## Changes to This Policy

We may update this policy to reflect changes:

1. Users will be notified of changes
2. Major changes will be highlighted
3. Previous versions will be archived
4. Your continued use constitutes acceptance

---

## Contact Us

For privacy questions or concerns:

1. Open a GitHub issue
2. Email: privacy@civislaw.app
3. Documentation: See our FAQ

---

## Quick Privacy Summary

| Aspect | What Happens |
|--------|-------------|
| Your documents | Encrypted, stored on your device |
| Your recordings | Encrypted, stored on your device |
| Your notes | Encrypted, stored on your device |
| Cloud processing | Only sanitized text, opt-in only |
| Data sales | Never |
| Tracking | Never |
| Third parties | None |
| Delete data | Yes, instantly |

---

## Last Updated

**Date**: January 1, 2024
**Version**: 1.0

---

**Remember**: At CivisLaw, your privacy is not an afterthought — it's our foundation.
