# Transcription Suite v4.0

**Healthcare-Compliant Medical Documentation Automation for AMS Clinic**

## 🚨 PROTOTYPE ONLY - NOT FOR PRODUCTION USE

This is a demonstration/testing version. **DO NOT use with real patient data.**

## Overview

Complete end-to-end workflow for physiotherapy clinical documentation:

1. **Patient Consent Capture** - Bilingual consent with auto-populated patient info
2. **Voice Recording** - Audio capture with pause/resume functionality
3. **AI Transcription** - Whisper Large-v3 transcription (8.4% WER for Quebec French)
4. **Clinical Note Generation** - Structured SOAP format with AI assistance
5. **Clinician Review (HITL)** - Required human approval before PDF generation
6. **Automated PDF Form Filling** - Smart detection and field mapping using pdf-lib
7. **Document Bundling** - Complete package: consent + notes + filled forms

## Key Features

### Security & Compliance

- ⚠️ **Prototype warnings** on all screens
- 🔒 **Auto-lock** after 5 minutes of inactivity
- 🇨🇦 **Quebec Law 25** compliance ready (data stored locally in prototype)
- 🏥 **HITL workflow** - Clinicians must approve all AI outputs

### Bilingual Support

- 🇬🇧 Full English interface
- 🇫🇷 Full French interface (compliant with Quebec language requirements)

### Form Management

- 📋 **14 built-in PDF forms** with complete field mappings
- 🤖 **Smart form detection** via keyword matching
- 👤 **User-uploaded forms** with admin approval workflow
- ✅ **1,900+ mapped PDF fields** across all forms

### Technology Stack

- **Frontend**: React 18
- **PDF Processing**: pdf-lib (not PyPDF)
- **Storage**: localStorage (prototype) → planned: secure backend
- **Transcription**: Whisper Large-v3 via Google Cloud Speech-to-Text
- **Architecture**: Smart Polling (not WebSockets due to clinic network constraints)

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (when ready)
npm run build
```

## Built-in Forms (14 total)

### McKenzie Assessments (5)

- Lumbar
- Cervical
- Thoracic
- Upper Extremity
- Lower Extremity

### Joint-Specific (6)

- Hip Assessment
- Knee Assessment
- Shoulder Assessment
- Ankle Assessment
- Wrist Assessment
- Elbow Assessment

### Specialized (3)

- Berg Balance Scale
- Progress Notes
- Discharge Summary

## Workflow States

Sessions progress through these states:

- `consent_captured`
- `recording`
- `transcribed`
- `notes_draft`
- `notes_approved`
- `pdf_generated`
- `complete`

## Project Context

**Client**: AMS Clinic (Montreal, Quebec)  
**Practice Type**: Physiotherapy  
**Compliance**: Quebec Law 25, TGV certification considerations  
**Language**: Bilingual (English/French required by Quebec regulations)

## Development Notes

### Current Status: v4.0

- ✅ React frontend complete
- ✅ Full bilingual support
- ✅ pdf-lib integration
- ✅ 14 form schemas with mappings
- ✅ Admin approval workflows
- ✅ Security gates and warnings
- ⏳ Backend API integration (planned)
- ⏳ Production deployment (pending TGV review)

## Important Notes

1. **No Real Patient Data**: This is a prototype for testing workflow only
2. **pdf-lib Required**: Do NOT substitute with PyPDF - field mapping depends on pdf-lib
3. **HITL Gates**: All AI-generated content requires clinician approval
4. **Quebec Compliance**: French translation is mandatory, not optional
5. **Smart Polling**: System uses polling architecture due to clinic network constraints

## File Structure

```
/
├── src/
│   ├── main.jsx            # React entry point
│   └── ams-v4-app.jsx      # Main React component
├── index.html               # App entry point
├── package.json             # Dependencies
├── vite.config.js           # Build configuration
└── README.md                # This file
```

---

**Version**: 4.0.0  
**Last Updated**: February 2026  
**Status**: Prototype - Testing Only
