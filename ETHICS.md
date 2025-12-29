# ETHICS.md - Ethical Boundaries and Guidelines

## Introduction

This document defines the ethical boundaries that govern the CivisLaw platform. These rules are not merely guidelines — they are **hard-coded principles** that must be enforced in all code, content, and interactions.

CivisLaw exists to help citizens understand the judicial system. We do this by explaining, translating, and clarifying. We do NOT do this by advising, predicting, or interfering.

---

## Core Ethical Rules

### 1. Legal Advice Prohibition

**Rule**: The platform must NEVER provide legal advice.

**What This Means**:
- ❌ Never tell users what legal actions they should take
- ❌ Never suggest which lawyer to hire
- ❌ Never recommend specific legal strategies
- ❌ Never predict how a judge will decide
- ❌ Never tell users whether they will win or lose their case

**Correct Behavior**:
- ✅ Explain what a court document says
- ✅ Describe what typically happens in a legal process
- ✅ Define legal terms in plain language
- ✅ Provide general educational information
- ✅ Direct users to consult qualified lawyers for advice

**Example**:
```
❌ WRONG: "You should file for bail immediately."

✅ CORRECT: "A bail application is a request to the court 
   to release you from custody while your case is pending. 
   A lawyer can advise you on whether this is appropriate 
   in your specific situation."
```

---

### 2. Outcome Prediction Prohibition

**Rule**: The platform must NEVER predict case outcomes.

**What This Means**:
- ❌ Never speculate on whether someone will be convicted or acquitted
- ❌ Never predict sentencing outcomes
- ❌ Never estimate case duration with false certainty
- ❌ Never suggest likelihood of success

**Correct Behavior**:
- ✅ Explain that outcomes depend on many factors
- ✅ Provide general information about typical processes
- ✅ Acknowledge uncertainty
- ✅ Emphasize that each case is unique

---

### 3. Judicial and Authority Neutrality

**Rule**: The platform must NEVER criticize or evaluate judges, police, or lawyers.

**What This Means**:
- ❌ Never comment on the quality of judicial decisions
- ❌ Never criticize police conduct or investigations
- ❌ Never evaluate lawyer performance
- ❌ Never suggest bias or incompetence
- ❌ Never take sides in any dispute

**Correct Behavior**:
- ✅ Explain court processes neutrally
- ✅ Describe roles of various actors objectively
- ✅ Use respectful language for all parties
- ✅ Focus on understanding, not evaluation

---

### 4. Dignity-First Design

**Rule**: All interactions must respect user dignity, especially for victims.

**What This Means**:
- ❌ Never use language that could retraumatize users
- ❌ Never blame or shame users for their situations
- ❌ Never make assumptions about user choices
- ❌ Never use aggressive or alarming language

**Correct Behavior**:
- ✅ Use calming, supportive language
- ✅ Provide control to users over their experience
- ✅ Include emergency exit buttons
- ✅ Design for trauma awareness
- ✅ Respect user autonomy

---

### 5. Language Accessibility

**Rule**: Understanding justice must not depend on language skills.

**What This Means**:
- ❌ Never assume English proficiency
- ❌ Never use unexplained legal jargon
- ❌ Never require translation for basic understanding

**Correct Behavior**:
- ✅ Provide content in multiple languages
- ✅ Use 8th-grade reading level or simpler
- ✅ Explain all technical terms
- ✅ Use plain language consistently

---

### 6. Privacy and Consent

**Rule**: User data must be protected and controlled by users.

**What This Means**:
- ❌ Never collect data without clear purpose
- ❌ Never store data without explicit consent
- ❌ Never share data with third parties
- ❌ Never use data for any purpose other than user benefit

**Correct Behavior**:
- ✅ Implement end-to-end encryption
- ✅ Provide clear privacy controls
- ✅ Allow data export and deletion
- ✅ Minimize data collection
- ✅ Be transparent about data handling

---

## Enforcement Mechanisms

### Technical Enforcement

1. **Input Validation**: Prevent prompts that request legal advice
2. **Response Filtering**: Remove content that violates ethical rules
3. **Access Controls**: Restrict features that could enable misuse
4. **Logging**: Track potential violations for review

### Content Guidelines

1. **Review Process**: All content reviewed against these rules
2. **User Feedback**: Users can report ethical violations
3. **Regular Audits**: Periodic review of all features

### Consequences

1. **Code Changes**: Violations fixed immediately
2. **Content Removal**: Inappropriate content deleted
3. **Contributor Guidance**: Contributors educated on rules
4. **Accountability**: Clear documentation of all decisions

---

## Examples of Correct vs Incorrect Behavior

### Document Explanation

```
❌ INCORRECT: "This notice means you should hire a lawyer 
   immediately or you will lose your case."

✅ CORRECT: "This notice requires you to appear in court on 
   the specified date. You may want to consult a lawyer to 
   understand your options."
```

### Process Explanation

```
❌ INCORRECT: "Since this is a bailable offense, you will 
   definitely get bail."

✅ CORRECT: "Since this is a bailable offense, you may be 
   eligible for bail. The final decision rests with the court."
```

### Term Definition

```
❌ INCORRECT: "You need to file for contempt because the 
   judge clearly violated your rights."

✅ CORRECT: "Contempt of court is when someone disobeys a 
   court order or shows disrespect to the court. Only a 
   lawyer can advise you on whether this applies to your 
   situation."
```

---

## Contributor Responsibilities

All contributors must:

1. **Read and understand** these ethical rules before contributing
2. **Follow the rules** in all code, content, and interactions
3. **Report violations** when they are observed
4. **Educate others** about the importance of these boundaries
5. **Lead by example** in ethical behavior

---

## Emergency Situations

While we provide information, we recognize that some users may be in crisis. The platform should:

1. **Include helpline numbers** prominently
2. **Provide emergency exit** buttons on every page
3. **Acknowledge limitations** when users report emergencies
4. **Direct to professionals** for crisis situations

---

## Legal Framework

These ethical rules are designed to:

1. **Protect users** from misinformation or harmful advice
2. **Protect contributors** from liability for legal matters
3. **Protect the judicial system** from interference
4. **Maintain platform integrity** and trust
5. **Comply with legal requirements** in all jurisdictions

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-01 | Initial ethical guidelines |

---

## Contact

For questions about these ethical guidelines, please open an issue on GitHub or contact the maintainers.

**Remember**: Our purpose is to help citizens understand, not to advise, predict, or interfere.
