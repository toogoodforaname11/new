import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ============================================================================
// AMS TRANSCRIPTION SUITE v4.0
// Complete React application with:
// - pdf-lib integration (NOT PyPDF)
// - Bilingual EN/FR support
// - Security gates & auto-lock
// - 5-step workflow (consent → record → notes → PDF → bundle)
// - 14 built-in form schemas
// - HITL (Human-in-the-Loop) approval gates
// ============================================================================

// ============================================================================
// SVG ICON COMPONENTS - Minimal outline icons (16x16px, 18px for bell)
// ============================================================================
const Icon = ({ children, size = 16, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    {children}
  </svg>
);

const Icons = {
  // Check / Success
  Check: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  ),

  // X / Close / Error
  X: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  ),

  // Warning / Alert Triangle
  AlertTriangle: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  ),

  // Info Circle
  Info: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </Icon>
  ),

  // Bell / Notification
  Bell: ({ size = 18, style }) => (
    <Icon size={size} style={style}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  ),

  // Microphone
  Mic: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </Icon>
  ),

  // Play
  Play: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </Icon>
  ),

  // Stop (Square)
  Stop: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </Icon>
  ),

  // Pause
  Pause: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </Icon>
  ),

  // Upload
  Upload: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </Icon>
  ),

  // Download
  Download: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  ),

  // File / Document
  File: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </Icon>
  ),

  // FileText
  FileText: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </Icon>
  ),

  // Clipboard
  Clipboard: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </Icon>
  ),

  // Chart / BarChart
  Chart: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Icon>
  ),

  // Settings / Gear
  Settings: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  ),

  // Plus
  Plus: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  ),

  // Trash
  Trash: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Icon>
  ),

  // Edit / Pencil
  Edit: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Icon>
  ),

  // ArrowLeft
  ArrowLeft: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </Icon>
  ),

  // ArrowRight
  ArrowRight: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  ),

  // Lock
  Lock: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  ),

  // Unlock
  Unlock: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </Icon>
  ),

  // User
  User: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  ),

  // Clock
  Clock: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  ),

  // Cloud
  Cloud: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </Icon>
  ),

  // Sync / Refresh
  Sync: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Icon>
  ),

  // Eye
  Eye: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),

  // Shield (Security)
  Shield: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Icon>
  ),

  // CheckCircle
  CheckCircle: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Icon>
  ),

  // XCircle
  XCircle: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </Icon>
  ),

  // AlertCircle
  AlertCircle: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
  ),

  // Folder
  Folder: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icon>
  ),

  // Send
  Send: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Icon>
  ),

  // Package / Bundle
  Package: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </Icon>
  ),

  // Globe / Language
  Globe: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  ),

  // Book / How It Works
  Book: ({ size = 16, style }) => (
    <Icon size={size} style={style}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Icon>
  )
};

// ============================================================================
// TRANSLATIONS - Bilingual EN/FR Support
// ============================================================================
const translations = {
  en: {
    appTitle: 'AMS Transcription Suite v4.0',
    subtitle: 'Medical Transcription & Documentation System',

    // Steps
    step1: 'Consent',
    step2: 'Record',
    step3: 'Notes → PDF',
    step4: 'PDF',
    step5: 'Bundle',

    // Consent Step
    consentTitle: 'Patient Consent',
    consentDescription: 'Obtain and verify patient consent before proceeding',
    patientName: 'Patient Name',
    patientId: 'Patient ID',
    dateOfBirth: 'Date of Birth',
    consentType: 'Consent Type',
    verbalConsent: 'Verbal Consent',
    writtenConsent: 'Written Consent',
    electronicConsent: 'Electronic Consent',
    consentObtained: 'I confirm consent has been obtained',
    witnessName: 'Witness Name',

    // Recording Step
    recordingTitle: 'Audio Recording',
    recordingDescription: 'Record or upload audio for transcription',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    pauseRecording: 'Pause',
    resumeRecording: 'Resume',
    uploadAudio: 'Upload Audio File',
    recordingDuration: 'Duration',
    audioQuality: 'Audio Quality',
    qualityGood: 'Good',
    qualityFair: 'Fair',
    qualityPoor: 'Poor',

    // Notes Step
    notesTitle: 'Clinical Notes & PDF Population',
    notesDescription: 'Review and edit transcribed notes — these fields directly populate your selected PDF template',
    transcription: 'Transcription',
    clinicalSummary: 'Clinical Summary',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment Plan',
    followUp: 'Follow-up Instructions',
    selectFormType: 'Select Form Type',

    // PDF Step
    pdfTitle: 'Generate PDF',
    pdfDescription: 'Create PDF document with all information',
    generatePdf: 'Generate PDF',
    previewPdf: 'Preview PDF',
    downloadPdf: 'Download PDF',
    pdfSettings: 'PDF Settings',
    includeHeader: 'Include Header',
    includeFooter: 'Include Footer',
    includeSignature: 'Include Signature Line',

    // Bundle Step
    bundleTitle: 'Final Bundle',
    bundleDescription: 'Review and submit complete documentation',
    bundleContents: 'Bundle Contents',
    submitBundle: 'Submit Bundle',
    exportBundle: 'Export Bundle',
    bundleStatus: 'Bundle Status',

    // HITL Approval
    approvalRequired: 'Approval Required',
    approvalPending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    approverName: 'Approver Name',
    approvalNotes: 'Approval Notes',
    approve: 'Approve',
    reject: 'Reject',
    requestChanges: 'Request Changes',

    // Security
    sessionTimeout: 'Session Timeout Warning',
    sessionExpiring: 'Your session will expire in',
    extendSession: 'Extend Session',
    logout: 'Logout',
    locked: 'Session Locked',
    enterPin: 'Recurring autolock — 2 min compliance function',
    unlock: 'Unlock',

    // Common
    next: 'Next',
    previous: 'Previous',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    required: 'Required',
    optional: 'Optional',

    // Form Types
    formGeneral: 'General Assessment',
    formProgress: 'Progress Notes',
    formDischarge: 'Discharge Summary',
    formConsultation: 'Consultation Report',
    formProcedure: 'Procedure Notes',
    formEmergency: 'Emergency Assessment',

    // Validation
    validationRequired: 'This field is required',
    validationInvalid: 'Invalid input',
    validationComplete: 'Please complete all required fields',
  },
  fr: {
    appTitle: 'Suite de Transcription AMS v4.0',
    subtitle: 'Système de Transcription et Documentation Médicale',

    // Steps
    step1: 'Consentement',
    step2: 'Enregistrement',
    step3: 'Notes → PDF',
    step4: 'PDF',
    step5: 'Dossier',

    // Consent Step
    consentTitle: 'Consentement du Patient',
    consentDescription: 'Obtenir et vérifier le consentement du patient avant de continuer',
    patientName: 'Nom du Patient',
    patientId: 'ID du Patient',
    dateOfBirth: 'Date de Naissance',
    consentType: 'Type de Consentement',
    verbalConsent: 'Consentement Verbal',
    writtenConsent: 'Consentement Écrit',
    electronicConsent: 'Consentement Électronique',
    consentObtained: 'Je confirme que le consentement a été obtenu',
    witnessName: 'Nom du Témoin',

    // Recording Step
    recordingTitle: 'Enregistrement Audio',
    recordingDescription: 'Enregistrer ou télécharger un fichier audio pour la transcription',
    startRecording: 'Démarrer l\'Enregistrement',
    stopRecording: 'Arrêter l\'Enregistrement',
    pauseRecording: 'Pause',
    resumeRecording: 'Reprendre',
    uploadAudio: 'Télécharger Fichier Audio',
    recordingDuration: 'Durée',
    audioQuality: 'Qualité Audio',
    qualityGood: 'Bonne',
    qualityFair: 'Acceptable',
    qualityPoor: 'Mauvaise',

    // Notes Step
    notesTitle: 'Notes Cliniques & Population PDF',
    notesDescription: 'Réviser et modifier les notes transcrites — ces champs remplissent directement votre modèle PDF sélectionné',
    transcription: 'Transcription',
    clinicalSummary: 'Résumé Clinique',
    diagnosis: 'Diagnostic',
    treatment: 'Plan de Traitement',
    followUp: 'Instructions de Suivi',
    selectFormType: 'Sélectionner le Type de Formulaire',

    // PDF Step
    pdfTitle: 'Générer PDF',
    pdfDescription: 'Créer un document PDF avec toutes les informations',
    generatePdf: 'Générer PDF',
    previewPdf: 'Aperçu PDF',
    downloadPdf: 'Télécharger PDF',
    pdfSettings: 'Paramètres PDF',
    includeHeader: 'Inclure l\'En-tête',
    includeFooter: 'Inclure le Pied de Page',
    includeSignature: 'Inclure Ligne de Signature',

    // Bundle Step
    bundleTitle: 'Dossier Final',
    bundleDescription: 'Réviser et soumettre la documentation complète',
    bundleContents: 'Contenu du Dossier',
    submitBundle: 'Soumettre le Dossier',
    exportBundle: 'Exporter le Dossier',
    bundleStatus: 'État du Dossier',

    // HITL Approval
    approvalRequired: 'Approbation Requise',
    approvalPending: 'En Attente d\'Approbation',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    approverName: 'Nom de l\'Approbateur',
    approvalNotes: 'Notes d\'Approbation',
    approve: 'Approuver',
    reject: 'Rejeter',
    requestChanges: 'Demander des Modifications',

    // Security
    sessionTimeout: 'Avertissement de Délai d\'Expiration',
    sessionExpiring: 'Votre session expirera dans',
    extendSession: 'Prolonger la Session',
    logout: 'Déconnexion',
    locked: 'Session Verrouillée',
    enterPin: 'Verrouillage automatique récurrent — fonction de conformité 2 min',
    unlock: 'Déverrouiller',

    // Common
    next: 'Suivant',
    previous: 'Précédent',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    required: 'Obligatoire',
    optional: 'Facultatif',

    // Form Types
    formGeneral: 'Évaluation Générale',
    formProgress: 'Notes d\'Évolution',
    formDischarge: 'Résumé de Sortie',
    formConsultation: 'Rapport de Consultation',
    formProcedure: 'Notes de Procédure',
    formEmergency: 'Évaluation d\'Urgence',

    // Validation
    validationRequired: 'Ce champ est obligatoire',
    validationInvalid: 'Entrée invalide',
    validationComplete: 'Veuillez compléter tous les champs obligatoires',
  }
};

// ============================================================================
// FORM SCHEMAS - 14 Built-in Forms with PDF Field Mappings
// ============================================================================
const formSchemas = {
  // =========================================================================
  // McKENZIE ASSESSMENTS (5)
  // =========================================================================
  mckenzieLumbar: {
    id: 'mckenzieLumbar',
    name: { en: 'McKenzie Lumbar Assessment', fr: 'Évaluation McKenzie Lombaire' },
    pdfTemplate: '/forms/mckenzie lumbar fielded.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'referringPhysician', pdfField: 'Referring Physician', type: 'text', required: false },
          { id: 'occupation', pdfField: 'Occupation', type: 'text', required: false }
        ]
      },
      {
        title: { en: 'Pain Location', fr: 'Localisation de la Douleur' },
        fields: [
          { id: 'painLocationLumbar', pdfField: 'Pain Lumbar', type: 'checkbox', required: false },
          { id: 'painLocationButtock', pdfField: 'Pain Buttock', type: 'checkbox', required: false },
          { id: 'painLocationThigh', pdfField: 'Pain Thigh', type: 'checkbox', required: false },
          { id: 'painLocationLeg', pdfField: 'Pain Leg', type: 'checkbox', required: false },
          { id: 'painLocationFoot', pdfField: 'Pain Foot', type: 'checkbox', required: false },
          { id: 'painSide', pdfField: 'Pain Side', type: 'select', options: ['left', 'right', 'bilateral', 'central'], required: true },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true }
        ]
      },
      {
        title: { en: 'Symptom Behavior', fr: 'Comportement des Symptômes' },
        fields: [
          { id: 'symptomsConstant', pdfField: 'Symptoms Constant', type: 'checkbox', required: false },
          { id: 'symptomsIntermittent', pdfField: 'Symptoms Intermittent', type: 'checkbox', required: false },
          { id: 'worseSitting', pdfField: 'Worse Sitting', type: 'checkbox', required: false },
          { id: 'worseStanding', pdfField: 'Worse Standing', type: 'checkbox', required: false },
          { id: 'worseBending', pdfField: 'Worse Bending', type: 'checkbox', required: false },
          { id: 'worseWalking', pdfField: 'Worse Walking', type: 'checkbox', required: false },
          { id: 'betterLying', pdfField: 'Better Lying', type: 'checkbox', required: false },
          { id: 'betterMoving', pdfField: 'Better Moving', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Movement Testing', fr: 'Tests de Mouvement' },
        fields: [
          { id: 'flexionStanding', pdfField: 'Flexion Standing', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'extensionStanding', pdfField: 'Extension Standing', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'sideGlidingLeft', pdfField: 'Side Gliding Left', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'sideGlidingRight', pdfField: 'Side Gliding Right', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'flexionLying', pdfField: 'Flexion Lying', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: false },
          { id: 'extensionLying', pdfField: 'Extension Lying', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: false },
          { id: 'repeatedFlexionEffect', pdfField: 'Repeated Flexion Effect', type: 'select', options: ['better', 'worse', 'no_change', 'centralizes', 'peripheralizes'], required: true },
          { id: 'repeatedExtensionEffect', pdfField: 'Repeated Extension Effect', type: 'select', options: ['better', 'worse', 'no_change', 'centralizes', 'peripheralizes'], required: true }
        ]
      },
      {
        title: { en: 'Classification & Plan', fr: 'Classification et Plan' },
        fields: [
          { id: 'mcKenzieClassification', pdfField: 'McKenzie Classification', type: 'select', options: ['derangement', 'dysfunction', 'postural', 'other'], required: true },
          { id: 'derangementType', pdfField: 'Derangement Type', type: 'text', required: false },
          { id: 'directionalPreference', pdfField: 'Directional Preference', type: 'select', options: ['extension', 'flexion', 'lateral', 'none'], required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'followUpDate', pdfField: 'Follow Up Date', type: 'date', required: false }
        ]
      }
    ]
  },

  mckenzieCervical: {
    id: 'mckenzieCervical',
    name: { en: 'McKenzie Cervical Assessment', fr: 'Évaluation McKenzie Cervicale' },
    pdfTemplate: '/forms/mckenzie Cervical PDF Fielded.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'referringPhysician', pdfField: 'Referring Physician', type: 'text', required: false }
        ]
      },
      {
        title: { en: 'Pain Location', fr: 'Localisation de la Douleur' },
        fields: [
          { id: 'painLocationNeck', pdfField: 'Pain Neck', type: 'checkbox', required: false },
          { id: 'painLocationShoulder', pdfField: 'Pain Shoulder', type: 'checkbox', required: false },
          { id: 'painLocationScapula', pdfField: 'Pain Scapula', type: 'checkbox', required: false },
          { id: 'painLocationArm', pdfField: 'Pain Arm', type: 'checkbox', required: false },
          { id: 'painLocationForearm', pdfField: 'Pain Forearm', type: 'checkbox', required: false },
          { id: 'painLocationHand', pdfField: 'Pain Hand', type: 'checkbox', required: false },
          { id: 'painSide', pdfField: 'Pain Side', type: 'select', options: ['left', 'right', 'bilateral', 'central'], required: true },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'headaches', pdfField: 'Headaches', type: 'checkbox', required: false },
          { id: 'dizziness', pdfField: 'Dizziness', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Movement Testing', fr: 'Tests de Mouvement' },
        fields: [
          { id: 'flexion', pdfField: 'Flexion', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'extension', pdfField: 'Extension', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'rotationLeft', pdfField: 'Rotation Left', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'rotationRight', pdfField: 'Rotation Right', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'lateralFlexionLeft', pdfField: 'Lateral Flexion Left', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'lateralFlexionRight', pdfField: 'Lateral Flexion Right', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'retractionEffect', pdfField: 'Retraction Effect', type: 'select', options: ['better', 'worse', 'no_change', 'centralizes', 'peripheralizes'], required: true },
          { id: 'protrusionEffect', pdfField: 'Protrusion Effect', type: 'select', options: ['better', 'worse', 'no_change', 'centralizes', 'peripheralizes'], required: true }
        ]
      },
      {
        title: { en: 'Classification & Plan', fr: 'Classification et Plan' },
        fields: [
          { id: 'mcKenzieClassification', pdfField: 'McKenzie Classification', type: 'select', options: ['derangement', 'dysfunction', 'postural', 'other'], required: true },
          { id: 'directionalPreference', pdfField: 'Directional Preference', type: 'select', options: ['retraction', 'extension', 'flexion', 'lateral', 'none'], required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true }
        ]
      }
    ]
  },

  mckenzieThoracic: {
    id: 'mckenzieThoracic',
    name: { en: 'McKenzie Thoracic Assessment', fr: 'Évaluation McKenzie Thoracique' },
    pdfTemplate: '/forms/thoracic pdf labeled done.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true }
        ]
      },
      {
        title: { en: 'Pain Location', fr: 'Localisation de la Douleur' },
        fields: [
          { id: 'painLocationUpper', pdfField: 'Pain Upper Thoracic', type: 'checkbox', required: false },
          { id: 'painLocationMid', pdfField: 'Pain Mid Thoracic', type: 'checkbox', required: false },
          { id: 'painLocationLower', pdfField: 'Pain Lower Thoracic', type: 'checkbox', required: false },
          { id: 'painLocationChest', pdfField: 'Pain Chest Wall', type: 'checkbox', required: false },
          { id: 'painSide', pdfField: 'Pain Side', type: 'select', options: ['left', 'right', 'bilateral', 'central'], required: true },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true }
        ]
      },
      {
        title: { en: 'Movement Testing', fr: 'Tests de Mouvement' },
        fields: [
          { id: 'flexionSeated', pdfField: 'Flexion Seated', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'extensionSeated', pdfField: 'Extension Seated', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'rotationLeft', pdfField: 'Rotation Left', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'rotationRight', pdfField: 'Rotation Right', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: true },
          { id: 'extensionProne', pdfField: 'Extension Prone', type: 'select', options: ['full', 'limited', 'painful', 'blocked'], required: false },
          { id: 'repeatedExtensionEffect', pdfField: 'Repeated Extension Effect', type: 'select', options: ['better', 'worse', 'no_change'], required: true }
        ]
      },
      {
        title: { en: 'Classification & Plan', fr: 'Classification et Plan' },
        fields: [
          { id: 'mcKenzieClassification', pdfField: 'McKenzie Classification', type: 'select', options: ['derangement', 'dysfunction', 'postural', 'other'], required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true }
        ]
      }
    ]
  },

  mckenzieUpperExtremity: {
    id: 'mckenzieUpperExtremity',
    name: { en: 'McKenzie Upper Extremity Assessment', fr: 'Évaluation McKenzie Membre Supérieur' },
    pdfTemplate: '/forms/Mckenzie Upper-Extremeties Fielded.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true }
        ]
      },
      {
        title: { en: 'Pain Location', fr: 'Localisation de la Douleur' },
        fields: [
          { id: 'painShoulder', pdfField: 'Pain Shoulder', type: 'checkbox', required: false },
          { id: 'painElbow', pdfField: 'Pain Elbow', type: 'checkbox', required: false },
          { id: 'painWrist', pdfField: 'Pain Wrist', type: 'checkbox', required: false },
          { id: 'painHand', pdfField: 'Pain Hand', type: 'checkbox', required: false },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'numbnessTingling', pdfField: 'Numbness Tingling', type: 'checkbox', required: false },
          { id: 'weakness', pdfField: 'Weakness', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Shoulder ROM', fr: 'Amplitude Épaule' },
        fields: [
          { id: 'shoulderFlexion', pdfField: 'Shoulder Flexion', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'shoulderAbduction', pdfField: 'Shoulder Abduction', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'shoulderExternalRotation', pdfField: 'Shoulder External Rotation', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'shoulderInternalRotation', pdfField: 'Shoulder Internal Rotation', type: 'select', options: ['full', 'limited', 'painful'], required: true }
        ]
      },
      {
        title: { en: 'Classification & Plan', fr: 'Classification et Plan' },
        fields: [
          { id: 'mcKenzieClassification', pdfField: 'McKenzie Classification', type: 'select', options: ['derangement', 'dysfunction', 'postural', 'contractile', 'other'], required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true }
        ]
      }
    ]
  },

  mckenzieLowerExtremity: {
    id: 'mckenzieLowerExtremity',
    name: { en: 'McKenzie Lower Extremity Assessment', fr: 'Évaluation McKenzie Membre Inférieur' },
    pdfTemplate: '/forms/Mckenzie Lower-Extremities Fielded.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true }
        ]
      },
      {
        title: { en: 'Pain Location', fr: 'Localisation de la Douleur' },
        fields: [
          { id: 'painHip', pdfField: 'Pain Hip', type: 'checkbox', required: false },
          { id: 'painKnee', pdfField: 'Pain Knee', type: 'checkbox', required: false },
          { id: 'painAnkle', pdfField: 'Pain Ankle', type: 'checkbox', required: false },
          { id: 'painFoot', pdfField: 'Pain Foot', type: 'checkbox', required: false },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true }
        ]
      },
      {
        title: { en: 'Hip & Knee ROM', fr: 'Amplitude Hanche et Genou' },
        fields: [
          { id: 'hipFlexion', pdfField: 'Hip Flexion', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'hipExtension', pdfField: 'Hip Extension', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'hipAbduction', pdfField: 'Hip Abduction', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'kneeFlexion', pdfField: 'Knee Flexion', type: 'select', options: ['full', 'limited', 'painful'], required: true },
          { id: 'kneeExtension', pdfField: 'Knee Extension', type: 'select', options: ['full', 'limited', 'painful'], required: true }
        ]
      },
      {
        title: { en: 'Classification & Plan', fr: 'Classification et Plan' },
        fields: [
          { id: 'mcKenzieClassification', pdfField: 'McKenzie Classification', type: 'select', options: ['derangement', 'dysfunction', 'postural', 'contractile', 'other'], required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // JOINT-SPECIFIC ASSESSMENTS (6)
  // =========================================================================
  hipAssessment: {
    id: 'hipAssessment',
    name: { en: 'Hip Assessment', fr: 'Évaluation de la Hanche' },
    pdfTemplate: '/forms/Hip eval completed.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'chiefComplaint', pdfField: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'onsetDate', pdfField: 'Onset Date', type: 'date', required: false },
          { id: 'mechanism', pdfField: 'Mechanism of Injury', type: 'textarea', required: false },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'aggravatingFactors', pdfField: 'Aggravating Factors', type: 'textarea', required: false },
          { id: 'easingFactors', pdfField: 'Easing Factors', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Range of Motion', fr: 'Amplitude de Mouvement' },
        fields: [
          { id: 'flexionActive', pdfField: 'Flexion Active', type: 'text', required: true },
          { id: 'flexionPassive', pdfField: 'Flexion Passive', type: 'text', required: true },
          { id: 'extensionActive', pdfField: 'Extension Active', type: 'text', required: true },
          { id: 'extensionPassive', pdfField: 'Extension Passive', type: 'text', required: true },
          { id: 'abductionActive', pdfField: 'Abduction Active', type: 'text', required: true },
          { id: 'abductionPassive', pdfField: 'Abduction Passive', type: 'text', required: true },
          { id: 'adductionActive', pdfField: 'Adduction Active', type: 'text', required: true },
          { id: 'adductionPassive', pdfField: 'Adduction Passive', type: 'text', required: true },
          { id: 'internalRotationActive', pdfField: 'Internal Rotation Active', type: 'text', required: true },
          { id: 'internalRotationPassive', pdfField: 'Internal Rotation Passive', type: 'text', required: true },
          { id: 'externalRotationActive', pdfField: 'External Rotation Active', type: 'text', required: true },
          { id: 'externalRotationPassive', pdfField: 'External Rotation Passive', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Special Tests', fr: 'Tests Spéciaux' },
        fields: [
          { id: 'faberTest', pdfField: 'FABER Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'fadirTest', pdfField: 'FADIR Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'thomasTest', pdfField: 'Thomas Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'oberTest', pdfField: 'Ober Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'trendelenburgTest', pdfField: 'Trendelenburg Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'logRollTest', pdfField: 'Log Roll Test', type: 'select', options: ['positive', 'negative'], required: false }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'diagnosis', pdfField: 'Diagnosis', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true },
          { id: 'followUpDate', pdfField: 'Follow Up Date', type: 'date', required: false }
        ]
      }
    ]
  },

  kneeAssessment: {
    id: 'kneeAssessment',
    name: { en: 'Knee Assessment', fr: 'Évaluation du Genou' },
    pdfTemplate: '/forms/Knee evaluation completed (1).pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'chiefComplaint', pdfField: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'onsetDate', pdfField: 'Onset Date', type: 'date', required: false },
          { id: 'mechanism', pdfField: 'Mechanism of Injury', type: 'textarea', required: false },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'swelling', pdfField: 'Swelling', type: 'checkbox', required: false },
          { id: 'locking', pdfField: 'Locking', type: 'checkbox', required: false },
          { id: 'givingWay', pdfField: 'Giving Way', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Range of Motion', fr: 'Amplitude de Mouvement' },
        fields: [
          { id: 'flexionActive', pdfField: 'Flexion Active', type: 'text', required: true },
          { id: 'flexionPassive', pdfField: 'Flexion Passive', type: 'text', required: true },
          { id: 'extensionActive', pdfField: 'Extension Active', type: 'text', required: true },
          { id: 'extensionPassive', pdfField: 'Extension Passive', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Ligament Tests', fr: 'Tests Ligamentaires' },
        fields: [
          { id: 'anteriorDrawer', pdfField: 'Anterior Drawer', type: 'select', options: ['negative', 'grade1', 'grade2', 'grade3'], required: true },
          { id: 'posteriorDrawer', pdfField: 'Posterior Drawer', type: 'select', options: ['negative', 'grade1', 'grade2', 'grade3'], required: true },
          { id: 'lachmanTest', pdfField: 'Lachman Test', type: 'select', options: ['negative', 'grade1', 'grade2', 'grade3'], required: true },
          { id: 'valgusStress', pdfField: 'Valgus Stress', type: 'select', options: ['negative', 'grade1', 'grade2', 'grade3'], required: true },
          { id: 'varusStress', pdfField: 'Varus Stress', type: 'select', options: ['negative', 'grade1', 'grade2', 'grade3'], required: true },
          { id: 'pivotShift', pdfField: 'Pivot Shift', type: 'select', options: ['negative', 'positive'], required: false }
        ]
      },
      {
        title: { en: 'Meniscus Tests', fr: 'Tests Méniscaux' },
        fields: [
          { id: 'mcMurrayMedial', pdfField: 'McMurray Medial', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'mcMurrayLateral', pdfField: 'McMurray Lateral', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'apleyCompression', pdfField: 'Apley Compression', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'jointLineTenderness', pdfField: 'Joint Line Tenderness', type: 'select', options: ['medial', 'lateral', 'both', 'none'], required: true }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'diagnosis', pdfField: 'Diagnosis', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true }
        ]
      }
    ]
  },

  shoulderAssessment: {
    id: 'shoulderAssessment',
    name: { en: 'Shoulder Assessment', fr: 'Évaluation de l\'Épaule' },
    pdfTemplate: '/forms/Shoulder evaluation completed.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true },
          { id: 'dominantHand', pdfField: 'Dominant Hand', type: 'select', options: ['left', 'right'], required: false }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'chiefComplaint', pdfField: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'nightPain', pdfField: 'Night Pain', type: 'checkbox', required: false },
          { id: 'overheadPain', pdfField: 'Overhead Pain', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Range of Motion', fr: 'Amplitude de Mouvement' },
        fields: [
          { id: 'flexionActive', pdfField: 'Flexion Active', type: 'text', required: true },
          { id: 'abductionActive', pdfField: 'Abduction Active', type: 'text', required: true },
          { id: 'externalRotationActive', pdfField: 'External Rotation Active', type: 'text', required: true },
          { id: 'internalRotationActive', pdfField: 'Internal Rotation Active', type: 'text', required: true },
          { id: 'handBehindBack', pdfField: 'Hand Behind Back', type: 'text', required: false }
        ]
      },
      {
        title: { en: 'Special Tests', fr: 'Tests Spéciaux' },
        fields: [
          { id: 'neerTest', pdfField: 'Neer Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'hawkinsTest', pdfField: 'Hawkins Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'emptyCanTest', pdfField: 'Empty Can Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'dropArmTest', pdfField: 'Drop Arm Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'speedTest', pdfField: 'Speed Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'obrienTest', pdfField: 'O\'Brien Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'apprehensionTest', pdfField: 'Apprehension Test', type: 'select', options: ['positive', 'negative'], required: false }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'diagnosis', pdfField: 'Diagnosis', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true }
        ]
      }
    ]
  },

  ankleAssessment: {
    id: 'ankleAssessment',
    name: { en: 'Ankle Assessment', fr: 'Évaluation de la Cheville' },
    pdfTemplate: '/forms/Ankle evaluation pdf-completed.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'chiefComplaint', pdfField: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'mechanism', pdfField: 'Mechanism of Injury', type: 'select', options: ['inversion', 'eversion', 'direct', 'overuse', 'unknown'], required: false },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'swelling', pdfField: 'Swelling', type: 'checkbox', required: false },
          { id: 'bruising', pdfField: 'Bruising', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Range of Motion', fr: 'Amplitude de Mouvement' },
        fields: [
          { id: 'dorsiflexionActive', pdfField: 'Dorsiflexion Active', type: 'text', required: true },
          { id: 'plantarflexionActive', pdfField: 'Plantarflexion Active', type: 'text', required: true },
          { id: 'inversionActive', pdfField: 'Inversion Active', type: 'text', required: true },
          { id: 'eversionActive', pdfField: 'Eversion Active', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Special Tests', fr: 'Tests Spéciaux' },
        fields: [
          { id: 'anteriorDrawer', pdfField: 'Anterior Drawer', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'talarTilt', pdfField: 'Talar Tilt', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'squeezeTest', pdfField: 'Squeeze Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'thompsonTest', pdfField: 'Thompson Test', type: 'select', options: ['positive', 'negative'], required: false }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'diagnosis', pdfField: 'Diagnosis', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true }
        ]
      }
    ]
  },

  wristAssessment: {
    id: 'wristAssessment',
    name: { en: 'Wrist Assessment', fr: 'Évaluation du Poignet' },
    pdfTemplate: '/forms/wrist eval_complete (2).pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true },
          { id: 'dominantHand', pdfField: 'Dominant Hand', type: 'select', options: ['left', 'right'], required: false }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'chiefComplaint', pdfField: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'numbnessTingling', pdfField: 'Numbness Tingling', type: 'checkbox', required: false },
          { id: 'weakness', pdfField: 'Weakness', type: 'checkbox', required: false }
        ]
      },
      {
        title: { en: 'Range of Motion', fr: 'Amplitude de Mouvement' },
        fields: [
          { id: 'flexionActive', pdfField: 'Flexion Active', type: 'text', required: true },
          { id: 'extensionActive', pdfField: 'Extension Active', type: 'text', required: true },
          { id: 'radialDeviationActive', pdfField: 'Radial Deviation Active', type: 'text', required: true },
          { id: 'ulnarDeviationActive', pdfField: 'Ulnar Deviation Active', type: 'text', required: true },
          { id: 'pronationActive', pdfField: 'Pronation Active', type: 'text', required: true },
          { id: 'supinationActive', pdfField: 'Supination Active', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Special Tests', fr: 'Tests Spéciaux' },
        fields: [
          { id: 'phalenTest', pdfField: 'Phalen Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'tinelSign', pdfField: 'Tinel Sign', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'finkelsteinTest', pdfField: 'Finkelstein Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'watsonTest', pdfField: 'Watson Test', type: 'select', options: ['positive', 'negative'], required: false }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'diagnosis', pdfField: 'Diagnosis', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true }
        ]
      }
    ]
  },

  elbowAssessment: {
    id: 'elbowAssessment',
    name: { en: 'Elbow Assessment', fr: 'Évaluation du Coude' },
    pdfTemplate: '/forms/elbow-assessment.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'affectedSide', pdfField: 'Affected Side', type: 'select', options: ['left', 'right', 'bilateral'], required: true }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'chiefComplaint', pdfField: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'painIntensity', pdfField: 'Pain Intensity', type: 'number', min: 0, max: 10, required: true },
          { id: 'painLocation', pdfField: 'Pain Location', type: 'select', options: ['lateral', 'medial', 'posterior', 'anterior', 'diffuse'], required: true }
        ]
      },
      {
        title: { en: 'Range of Motion', fr: 'Amplitude de Mouvement' },
        fields: [
          { id: 'flexionActive', pdfField: 'Flexion Active', type: 'text', required: true },
          { id: 'extensionActive', pdfField: 'Extension Active', type: 'text', required: true },
          { id: 'pronationActive', pdfField: 'Pronation Active', type: 'text', required: true },
          { id: 'supinationActive', pdfField: 'Supination Active', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Special Tests', fr: 'Tests Spéciaux' },
        fields: [
          { id: 'cozensTest', pdfField: 'Cozen Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'millsTest', pdfField: 'Mills Test', type: 'select', options: ['positive', 'negative'], required: false },
          { id: 'golfersElbowTest', pdfField: 'Golfers Elbow Test', type: 'select', options: ['positive', 'negative'], required: true },
          { id: 'valgusStress', pdfField: 'Valgus Stress', type: 'select', options: ['stable', 'unstable'], required: false },
          { id: 'varusStress', pdfField: 'Varus Stress', type: 'select', options: ['stable', 'unstable'], required: false }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'diagnosis', pdfField: 'Diagnosis', type: 'textarea', required: true },
          { id: 'treatmentPlan', pdfField: 'Treatment Plan', type: 'textarea', required: true },
          { id: 'homeExercises', pdfField: 'Home Exercises', type: 'textarea', required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // SPECIALIZED ASSESSMENTS (3)
  // =========================================================================
  bergBalance: {
    id: 'bergBalance',
    name: { en: 'Berg Balance Scale', fr: 'Échelle d\'Équilibre de Berg' },
    pdfTemplate: '/forms/BERG Balance evaluation completed.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'assistiveDevice', pdfField: 'Assistive Device', type: 'select', options: ['none', 'cane', 'walker', 'wheelchair'], required: true }
        ]
      },
      {
        title: { en: 'Sitting Balance', fr: 'Équilibre Assis' },
        fields: [
          { id: 'sittingToStanding', pdfField: 'Sitting to Standing', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'standingUnsupported', pdfField: 'Standing Unsupported', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'sittingUnsupported', pdfField: 'Sitting Unsupported', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'standingToSitting', pdfField: 'Standing to Sitting', type: 'select', options: ['0', '1', '2', '3', '4'], required: true }
        ]
      },
      {
        title: { en: 'Transfers', fr: 'Transferts' },
        fields: [
          { id: 'transfers', pdfField: 'Transfers', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'standingEyesClosed', pdfField: 'Standing Eyes Closed', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'standingFeetTogether', pdfField: 'Standing Feet Together', type: 'select', options: ['0', '1', '2', '3', '4'], required: true }
        ]
      },
      {
        title: { en: 'Reaching & Turning', fr: 'Atteinte et Rotation' },
        fields: [
          { id: 'reachingForward', pdfField: 'Reaching Forward', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'retrieveObject', pdfField: 'Retrieve Object', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'turningTrunk', pdfField: 'Turning Trunk', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'turning360', pdfField: 'Turning 360', type: 'select', options: ['0', '1', '2', '3', '4'], required: true }
        ]
      },
      {
        title: { en: 'Dynamic Balance', fr: 'Équilibre Dynamique' },
        fields: [
          { id: 'footOnStool', pdfField: 'Foot on Stool', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'tandemStanding', pdfField: 'Tandem Standing', type: 'select', options: ['0', '1', '2', '3', '4'], required: true },
          { id: 'standingOnOneLeg', pdfField: 'Standing on One Leg', type: 'select', options: ['0', '1', '2', '3', '4'], required: true }
        ]
      },
      {
        title: { en: 'Total Score', fr: 'Score Total' },
        fields: [
          { id: 'totalScore', pdfField: 'Total Score', type: 'number', min: 0, max: 56, required: true },
          { id: 'fallRisk', pdfField: 'Fall Risk', type: 'select', options: ['low', 'medium', 'high'], required: true },
          { id: 'recommendations', pdfField: 'Recommendations', type: 'textarea', required: true }
        ]
      }
    ]
  },

  progressNotes: {
    id: 'progressNotes',
    name: { en: 'Progress Notes', fr: 'Notes d\'Évolution' },
    pdfTemplate: '/forms/progress-notes.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'visitDate', pdfField: 'Visit Date', type: 'date', required: true },
          { id: 'visitNumber', pdfField: 'Visit Number', type: 'number', required: false },
          { id: 'therapistName', pdfField: 'Therapist Name', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Subjective', fr: 'Subjectif' },
        fields: [
          { id: 'patientReport', pdfField: 'Patient Report', type: 'textarea', required: true },
          { id: 'painLevel', pdfField: 'Pain Level', type: 'number', min: 0, max: 10, required: true },
          { id: 'painChange', pdfField: 'Pain Change', type: 'select', options: ['improved', 'same', 'worse'], required: true },
          { id: 'functionChange', pdfField: 'Function Change', type: 'select', options: ['improved', 'same', 'worse'], required: true },
          { id: 'sleepQuality', pdfField: 'Sleep Quality', type: 'select', options: ['good', 'fair', 'poor'], required: false },
          { id: 'medicationChanges', pdfField: 'Medication Changes', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Objective', fr: 'Objectif' },
        fields: [
          { id: 'observation', pdfField: 'Observation', type: 'textarea', required: true },
          { id: 'romChanges', pdfField: 'ROM Changes', type: 'textarea', required: false },
          { id: 'strengthChanges', pdfField: 'Strength Changes', type: 'textarea', required: false },
          { id: 'specialTests', pdfField: 'Special Tests', type: 'textarea', required: false },
          { id: 'functionalTests', pdfField: 'Functional Tests', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Treatment', fr: 'Traitement' },
        fields: [
          { id: 'treatmentProvided', pdfField: 'Treatment Provided', type: 'textarea', required: true },
          { id: 'manualTherapy', pdfField: 'Manual Therapy', type: 'textarea', required: false },
          { id: 'therapeuticExercise', pdfField: 'Therapeutic Exercise', type: 'textarea', required: false },
          { id: 'modalities', pdfField: 'Modalities', type: 'textarea', required: false },
          { id: 'patientEducation', pdfField: 'Patient Education', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'assessment', pdfField: 'Assessment', type: 'textarea', required: true },
          { id: 'progressTowardsGoals', pdfField: 'Progress Towards Goals', type: 'select', options: ['on_track', 'ahead', 'behind', 'plateau'], required: true },
          { id: 'planNextVisit', pdfField: 'Plan Next Visit', type: 'textarea', required: true },
          { id: 'homeExerciseCompliance', pdfField: 'HEP Compliance', type: 'select', options: ['excellent', 'good', 'fair', 'poor'], required: true },
          { id: 'homeExerciseUpdates', pdfField: 'HEP Updates', type: 'textarea', required: false },
          { id: 'nextAppointment', pdfField: 'Next Appointment', type: 'date', required: false }
        ]
      }
    ]
  },

  dischargeSummary: {
    id: 'dischargeSummary',
    name: { en: 'Discharge Summary', fr: 'Résumé de Sortie' },
    pdfTemplate: '/forms/discharge-summary.pdf',
    sections: [
      {
        title: { en: 'Patient Information', fr: 'Information du Patient' },
        fields: [
          { id: 'patientName', pdfField: 'Patient Name', type: 'text', required: true },
          { id: 'dob', pdfField: 'Date of Birth', type: 'date', required: true },
          { id: 'admissionDate', pdfField: 'Admission Date', type: 'date', required: true },
          { id: 'dischargeDate', pdfField: 'Discharge Date', type: 'date', required: true },
          { id: 'totalVisits', pdfField: 'Total Visits', type: 'number', required: true },
          { id: 'therapistName', pdfField: 'Therapist Name', type: 'text', required: true },
          { id: 'referringPhysician', pdfField: 'Referring Physician', type: 'text', required: false }
        ]
      },
      {
        title: { en: 'Diagnosis & Reason for Referral', fr: 'Diagnostic et Raison de Référence' },
        fields: [
          { id: 'admissionDiagnosis', pdfField: 'Admission Diagnosis', type: 'textarea', required: true },
          { id: 'icdCode', pdfField: 'ICD Code', type: 'text', required: false },
          { id: 'reasonForReferral', pdfField: 'Reason for Referral', type: 'textarea', required: true }
        ]
      },
      {
        title: { en: 'Initial Status', fr: 'État Initial' },
        fields: [
          { id: 'initialPainLevel', pdfField: 'Initial Pain Level', type: 'number', min: 0, max: 10, required: true },
          { id: 'initialRom', pdfField: 'Initial ROM', type: 'textarea', required: true },
          { id: 'initialStrength', pdfField: 'Initial Strength', type: 'textarea', required: true },
          { id: 'initialFunction', pdfField: 'Initial Function', type: 'textarea', required: true },
          { id: 'initialGoals', pdfField: 'Initial Goals', type: 'textarea', required: true }
        ]
      },
      {
        title: { en: 'Treatment Summary', fr: 'Résumé du Traitement' },
        fields: [
          { id: 'treatmentSummary', pdfField: 'Treatment Summary', type: 'textarea', required: true },
          { id: 'interventionsUsed', pdfField: 'Interventions Used', type: 'textarea', required: true },
          { id: 'patientCompliance', pdfField: 'Patient Compliance', type: 'select', options: ['excellent', 'good', 'fair', 'poor'], required: true },
          { id: 'complications', pdfField: 'Complications', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Discharge Status', fr: 'État à la Sortie' },
        fields: [
          { id: 'dischargePainLevel', pdfField: 'Discharge Pain Level', type: 'number', min: 0, max: 10, required: true },
          { id: 'dischargeRom', pdfField: 'Discharge ROM', type: 'textarea', required: true },
          { id: 'dischargeStrength', pdfField: 'Discharge Strength', type: 'textarea', required: true },
          { id: 'dischargeFunction', pdfField: 'Discharge Function', type: 'textarea', required: true },
          { id: 'goalsAchieved', pdfField: 'Goals Achieved', type: 'textarea', required: true },
          { id: 'goalsNotAchieved', pdfField: 'Goals Not Achieved', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Discharge Reason & Recommendations', fr: 'Raison de Sortie et Recommandations' },
        fields: [
          { id: 'dischargeReason', pdfField: 'Discharge Reason', type: 'select', options: ['goals_met', 'plateau', 'patient_request', 'non_compliance', 'physician_order', 'other'], required: true },
          { id: 'dischargeReasonOther', pdfField: 'Discharge Reason Other', type: 'text', required: false },
          { id: 'homeExerciseProgram', pdfField: 'Home Exercise Program', type: 'textarea', required: true },
          { id: 'precautions', pdfField: 'Precautions', type: 'textarea', required: false },
          { id: 'followUpRecommendations', pdfField: 'Follow Up Recommendations', type: 'textarea', required: true },
          { id: 'returnToWorkStatus', pdfField: 'Return to Work Status', type: 'textarea', required: false },
          { id: 'physicianNotification', pdfField: 'Physician Notification', type: 'checkbox', required: false }
        ]
      }
    ]
  }
};

// ============================================================================
// STYLES
// ============================================================================
// ============================================================================
// AMS CLINIC BRAND TOKENS
// Extracted from amsclinic.ca - Official brand colors and typography
// ============================================================================
const brand = {
  blue:       '#0075b7',    // Primary brand blue
  blueDark:   '#005a8e',    // Hover / dark variant
  blueLight:  '#e8f4fb',    // Light blue tints
  blueMid:    '#0c71c3',    // Secondary blue (headers)
  orange:     '#ff8a00',    // CTA / accent orange
  orangeDark: '#e67a00',    // Orange hover
  orangeLight:'#fff7eb',    // Light orange tint
  white:      '#ffffff',
  offWhite:   '#f4f4f4',    // Page background
  gray50:     '#f8f9fa',
  gray100:    '#f0f0f4',
  gray200:    '#e9ecef',
  gray300:    '#dee2e6',
  gray400:    '#aaaaaa',
  gray600:    '#666666',
  gray800:    '#333333',
  gray900:    '#222222',
  success:    '#16a34a',
  successBg:  '#f0fdf4',
  successBdr: '#bbf7d0',
  danger:     '#dc2626',
  dangerBg:   '#fef2f2',
  dangerBdr:  '#fecaca',
  warningBg:  '#fffbeb',
  warningBdr: '#fed7aa',
  warningText:'#92400e',
  fontHeading:"'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontBody:   "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  radius:     '6px',
  radiusMd:   '8px',
  radiusLg:   '12px',
  shadow:     '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  shadowMd:   '0 4px 12px rgba(0,0,0,0.08)',
  shadowLg:   '0 10px 40px rgba(0,0,0,0.1)',
};

const styles = {
  // ---- LAYOUT ----
  container: {
    minHeight: '100vh',
    background: brand.offWhite,
    fontFamily: brand.fontBody,
    color: brand.gray900,
  },
  topBar: {
    background: brand.blue,
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,117,183,0.25)',
  },
  topBarInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '68px',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoTitle: {
    fontFamily: brand.fontHeading,
    fontSize: '18px',
    fontWeight: '700',
    color: brand.white,
    lineHeight: '1.1',
    letterSpacing: '-0.3px',
  },
  logoSubtitle: {
    fontFamily: brand.fontBody,
    fontSize: '11px',
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  headerControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  headerBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: brand.radius,
    padding: '7px 14px',
    color: brand.white,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: brand.fontBody,
  },
  headerBtnDanger: {
    background: 'rgba(220,38,38,0.15)',
    borderColor: 'rgba(220,38,38,0.35)',
  },
  // ---- MAIN CONTENT AREA ----
  mainWrap: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '28px 24px 48px',
  },
  card: {
    background: brand.white,
    borderRadius: brand.radiusLg,
    boxShadow: brand.shadowMd,
    overflow: 'hidden',
    border: `1px solid ${brand.gray200}`,
  },
  // ---- PROGRESS BAR ----
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    background: brand.white,
    borderBottom: `1px solid ${brand.gray200}`,
  },
  progressStep: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    padding: '18px 8px',
    gap: '10px',
    cursor: 'default',
  },
  progressCircle: (active, completed) => ({
    width: '32px',
    height: '32px',
    minWidth: '32px',
    borderRadius: '50%',
    background: completed ? brand.success : active ? brand.blue : brand.gray200,
    color: completed || active ? brand.white : brand.gray600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    fontFamily: brand.fontHeading,
    transition: 'all 0.25s ease',
    boxShadow: active ? `0 0 0 3px ${brand.blueLight}` : 'none',
  }),
  progressLabel: (active) => ({
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    color: active ? brand.blue : brand.gray600,
    fontFamily: brand.fontHeading,
    whiteSpace: 'nowrap',
  }),
  progressDivider: {
    width: '1px',
    height: '32px',
    background: brand.gray200,
    flexShrink: 0,
  },
  // ---- CONTENT AREA ----
  content: {
    padding: '36px 40px 40px',
  },
  stepTitle: {
    fontFamily: brand.fontHeading,
    fontSize: '24px',
    fontWeight: '700',
    color: brand.blue,
    marginBottom: '6px',
    lineHeight: '1.2',
  },
  stepDescription: {
    fontSize: '14px',
    color: brand.gray600,
    marginBottom: '28px',
    lineHeight: '1.5',
  },
  // ---- FORMS ----
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: brand.gray800,
    fontSize: '13px',
    letterSpacing: '0.1px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${brand.gray200}`,
    borderRadius: brand.radius,
    fontSize: '14px',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box',
    background: brand.white,
    color: brand.gray900,
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${brand.gray200}`,
    borderRadius: brand.radius,
    fontSize: '14px',
    minHeight: '110px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: brand.white,
    color: brand.gray900,
    lineHeight: '1.5',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${brand.gray200}`,
    borderRadius: brand.radius,
    fontSize: '14px',
    outline: 'none',
    background: brand.white,
    cursor: 'pointer',
    color: brand.gray900,
    appearance: 'auto',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: brand.blue,
  },
  // ---- BUTTONS ----
  button: {
    padding: '10px 22px',
    borderRadius: brand.radius,
    border: 'none',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    fontFamily: brand.fontBody,
    letterSpacing: '0.2px',
    textTransform: 'uppercase',
    lineHeight: '1',
  },
  primaryButton: {
    background: brand.orange,
    color: brand.white,
    boxShadow: '0 1px 3px rgba(255,138,0,0.3)',
  },
  secondaryButton: {
    background: brand.white,
    color: brand.gray800,
    border: `1.5px solid ${brand.gray200}`,
    boxShadow: brand.shadow,
  },
  successButton: {
    background: brand.success,
    color: brand.white,
    boxShadow: '0 1px 3px rgba(22,163,74,0.3)',
  },
  dangerButton: {
    background: brand.danger,
    color: brand.white,
    boxShadow: '0 1px 3px rgba(220,38,38,0.3)',
  },
  blueButton: {
    background: brand.blue,
    color: brand.white,
    boxShadow: '0 1px 3px rgba(0,117,183,0.3)',
  },
  disabledButton: {
    opacity: 0.45,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    marginTop: '36px',
    paddingTop: '24px',
    borderTop: `1px solid ${brand.gray200}`,
  },
  // ---- ALERTS / TOASTS ----
  alert: (type) => ({
    padding: '14px 18px',
    borderRadius: brand.radiusMd,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: '500',
    background: type === 'success' ? brand.successBg : type === 'error' ? brand.dangerBg : type === 'warning' ? brand.warningBg : brand.blueLight,
    color: type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : type === 'warning' ? brand.warningText : '#075985',
    border: `1px solid ${type === 'success' ? brand.successBdr : type === 'error' ? brand.dangerBdr : type === 'warning' ? brand.warningBdr : '#bae6fd'}`,
  }),
  // ---- MODALS ----
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,30,60,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: brand.white,
    borderRadius: brand.radiusLg,
    padding: '36px',
    maxWidth: '460px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,30,60,0.25)',
    border: `1px solid ${brand.gray200}`,
  },
  modalTitle: {
    fontFamily: brand.fontHeading,
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: brand.blue,
  },
  // ---- SECTIONS ----
  section: {
    background: brand.gray50,
    borderRadius: brand.radiusMd,
    padding: '22px 24px',
    marginBottom: '20px',
    border: `1px solid ${brand.gray200}`,
  },
  sectionTitle: {
    fontFamily: brand.fontHeading,
    fontSize: '16px',
    fontWeight: '600',
    color: brand.blue,
    marginBottom: '14px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${brand.orange}`,
    display: 'flex',
    alignItems: 'center',
  },
  // ---- BADGES ----
  badge: (type) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    background: type === 'success' ? brand.successBg : type === 'warning' ? brand.warningBg : type === 'error' ? brand.dangerBg : brand.gray100,
    color: type === 'success' ? '#166534' : type === 'warning' ? brand.warningText : type === 'error' ? '#991b1b' : brand.gray600,
    border: `1px solid ${type === 'success' ? brand.successBdr : type === 'warning' ? brand.warningBdr : type === 'error' ? brand.dangerBdr : brand.gray200}`,
  }),
  // ---- RECORDING ----
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: brand.dangerBg,
    borderRadius: brand.radiusMd,
    border: `1.5px solid ${brand.dangerBdr}`,
  },
  recordingDot: {
    width: '10px',
    height: '10px',
    background: brand.danger,
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  // ---- APPROVAL ----
  approvalCard: {
    background: brand.orangeLight,
    borderRadius: brand.radiusMd,
    padding: '24px',
    marginBottom: '20px',
    border: `1.5px solid ${brand.orange}`,
    boxShadow: '0 2px 8px rgba(255,138,0,0.1)',
  },
  // ---- LIST ITEMS ----
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: brand.white,
    borderRadius: brand.radius,
    marginBottom: '6px',
    border: `1px solid ${brand.gray200}`,
    transition: 'box-shadow 0.15s ease',
  },
  // ---- UPLOAD ZONE ----
  uploadZone: {
    border: `2px dashed ${brand.blue}`,
    borderRadius: brand.radiusMd,
    padding: '28px 24px',
    background: brand.blueLight,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function AMSTranscriptionSuite() {
  // State management
  const [language, setLanguage] = useState('en');
  const [activePage, setActivePage] = useState('transcription'); // dashboard | transcription | pdfManager | settings | privacy
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(60);
  const [pin, setPin] = useState('');
  const [selectedForm, setSelectedForm] = useState('mckenzieLumbar');
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Usage stats (persisted in localStorage)
  const [usageStats, setUsageStats] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_usage_stats');
      return saved ? JSON.parse(saved) : {
        totalPatients: 0,
        totalRecordings: 0,
        totalHours: 0,
        sessionsToday: 0,
        sessionsThisWeek: 0,
        lastSessionDate: null,
        dailyLog: [],
      };
    } catch { return { totalPatients: 0, totalRecordings: 0, totalHours: 0, sessionsToday: 0, sessionsThisWeek: 0, lastSessionDate: null, dailyLog: [] }; }
  });

  // Form data state
  const [consentData, setConsentData] = useState({
    patientName: '',
    patientId: '',
    dateOfBirth: '',
    consentType: 'verbal',
    consentObtained: false,
    witnessName: '',
    timestamp: null
  });

  const [recordingData, setRecordingData] = useState({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    quality: 'good'
  });

  const [notesData, setNotesData] = useState({
    transcription: '',
    formData: {}
  });

  const [pdfData, setPdfData] = useState({
    generated: false,
    pdfBlob: null,
    pdfUrl: null,
    settings: {
      includeHeader: true,
      includeFooter: true,
      includeSignature: true
    }
  });

  const [bundleData, setBundleData] = useState({
    status: 'draft',
    approvalStatus: 'pending',
    approverName: '',
    approvalNotes: '',
    submittedAt: null
  });

  const [alerts, setAlerts] = useState([]);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  // Get translation helper
  const t = useCallback((key) => {
    return translations[language][key] || key;
  }, [language]);

  // Add alert helper
  const addAlert = useCallback((type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 5000);
  }, []);

  // ============================================================================
  // SECURITY & AUTO-LOCK
  // ============================================================================
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Show warning at 1.5 minutes (90 seconds), lock at 2 minutes
    inactivityTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      setTimeoutSeconds(30);

      // Start 30-second countdown
      const countdownInterval = setInterval(() => {
        setTimeoutSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsLocked(true);
            setShowTimeoutWarning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Safety: auto-lock at 30 seconds
      setTimeout(() => {
        clearInterval(countdownInterval);
      }, 30000);
    }, 90000); // 1.5 minutes
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      if (!isLocked) {
        resetInactivityTimer();
        if (showTimeoutWarning) {
          setShowTimeoutWarning(false);
        }
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isLocked, showTimeoutWarning, resetInactivityTimer]);

  const handleUnlock = () => {
    setIsLocked(false);
    setPin('');
    resetInactivityTimer();
    addAlert('success', 'Session unlocked');
  };

  const extendSession = () => {
    setShowTimeoutWarning(false);
    resetInactivityTimer();
    addAlert('success', 'Session extended');
  };

  // ============================================================================
  // RECORDING FUNCTIONS
  // ============================================================================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordingData(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
          isPaused: false
        }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecordingData(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingData(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      addAlert('success', 'Recording started');
    } catch (error) {
      addAlert('error', 'Could not access microphone');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingData.isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      addAlert('success', 'Recording stopped');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingData.isRecording) {
      if (recordingData.isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingData(prev => ({ ...prev, duration: prev.duration + 1 }));
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setRecordingData(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setRecordingData(prev => ({
        ...prev,
        audioBlob: file,
        audioUrl,
        duration: 0
      }));
      addAlert('success', 'Audio file uploaded');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // PDF GENERATION (using pdf-lib) - Fills actual PDF form fields
  // ============================================================================

  // State for uploaded PDF templates
  const [pdfTemplates, setPdfTemplates] = useState({});

  // Load PDF template from file or URL
  const loadPdfTemplate = async (templatePath) => {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${templatePath}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (error) {
      console.warn(`Template not found: ${templatePath}, will create new PDF`);
      return null;
    }
  };

  // Fill PDF form fields from existing template
  // Fill ACTUAL PDF form fields from the uploaded PDF - iterates through real fields
  const fillPdfFormFields = async (pdfDoc, schema, formData) => {
    try {
      const form = pdfDoc.getForm();
      const pdfFields = form.getFields();

      // Log ACTUAL fields in the PDF
      console.log('=== ACTUAL PDF FIELDS IN UPLOADED FILE ===');
      pdfFields.forEach(f => console.log(`  ${f.constructor.name}: "${f.getName()}"`));
      console.log(`  Total: ${pdfFields.length} fields`);

      // Build comprehensive data map from all sources
      const allData = { ...formData };

      // Add patient info with multiple naming variations
      const patientMappings = [
        // Patient Name variations
        ['patientName', consentData.patientName],
        ['Patient Name', consentData.patientName],
        ['patient_name', consentData.patientName],
        ['PatientName', consentData.patientName],
        ['Name', consentData.patientName],
        ['name', consentData.patientName],
        // DOB variations
        ['dob', consentData.dateOfBirth],
        ['DOB', consentData.dateOfBirth],
        ['Date of Birth', consentData.dateOfBirth],
        ['date_of_birth', consentData.dateOfBirth],
        ['DateOfBirth', consentData.dateOfBirth],
        ['Birth Date', consentData.dateOfBirth],
        ['birthdate', consentData.dateOfBirth],
        // Patient ID variations
        ['patientId', consentData.patientId],
        ['Patient ID', consentData.patientId],
        ['patient_id', consentData.patientId],
        ['PatientID', consentData.patientId],
        ['ID', consentData.patientId],
        ['Chart', consentData.patientId],
        ['Chart Number', consentData.patientId],
        ['MRN', consentData.patientId],
        // Visit Date variations
        ['visitDate', new Date().toISOString().split('T')[0]],
        ['Visit Date', new Date().toISOString().split('T')[0]],
        ['visit_date', new Date().toISOString().split('T')[0]],
        ['VisitDate', new Date().toISOString().split('T')[0]],
        ['Date', new Date().toISOString().split('T')[0]],
        ['Exam Date', new Date().toISOString().split('T')[0]],
        ['Assessment Date', new Date().toISOString().split('T')[0]],
      ];

      patientMappings.forEach(([key, value]) => {
        if (value) allData[key] = value;
      });

      // Add schema pdfField mappings if schema exists
      if (schema && schema.sections) {
        schema.sections.forEach(section => {
          section.fields.forEach(fieldDef => {
            const value = formData[fieldDef.id];
            if (value !== undefined && value !== null && value !== '') {
              // Add both the field id and pdfField name
              if (fieldDef.pdfField) {
                allData[fieldDef.pdfField] = value;
              }
            }
          });
        });
      }

      // Normalize function for fuzzy matching
      const normalize = (str) => str.toLowerCase().replace(/[\s_\-\.]/g, '').replace(/[^a-z0-9]/g, '');

      // Create normalized lookup
      const normalizedData = {};
      Object.entries(allData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          normalizedData[normalize(key)] = value;
          normalizedData[key] = value; // Keep original too
        }
      });

      console.log('=== DATA AVAILABLE FOR FILLING ===');
      console.log(Object.keys(allData).filter(k => allData[k]));

      // ITERATE THROUGH ACTUAL PDF FIELDS AND FILL THEM
      let filledCount = 0;
      let skippedCount = 0;

      for (const pdfField of pdfFields) {
        const fieldName = pdfField.getName();
        const fieldType = pdfField.constructor.name;
        const normalizedFieldName = normalize(fieldName);

        // Find matching value - try exact match first, then normalized
        let value = allData[fieldName] ?? normalizedData[normalizedFieldName];

        // If no match, try partial/fuzzy matching
        if (value === undefined) {
          for (const [dataKey, dataValue] of Object.entries(normalizedData)) {
            const normalizedDataKey = normalize(dataKey);
            if (normalizedFieldName.includes(normalizedDataKey) ||
                normalizedDataKey.includes(normalizedFieldName) ||
                normalizedFieldName === normalizedDataKey) {
              value = dataValue;
              break;
            }
          }
        }

        if (value === undefined || value === null || value === '') {
          skippedCount++;
          continue;
        }

        try {
          switch (fieldType) {
            case 'PDFCheckBox':
              const checkBox = form.getCheckBox(fieldName);
              const isChecked = value === true || value === 'true' || value === 'on' ||
                               value === 'yes' || value === 'Yes' || value === '1' || value === 1;
              if (isChecked) {
                checkBox.check();
              } else {
                checkBox.uncheck();
              }
              filledCount++;
              console.log(`  ✓ CheckBox "${fieldName}" = ${isChecked}`);
              break;

            case 'PDFDropdown':
              const dropdown = form.getDropdown(fieldName);
              const options = dropdown.getOptions();
              // Try to find matching option
              const matchingOption = options.find(opt =>
                opt.toLowerCase() === String(value).toLowerCase() ||
                normalize(opt) === normalize(String(value))
              );
              if (matchingOption) {
                dropdown.select(matchingOption);
                filledCount++;
                console.log(`  ✓ Dropdown "${fieldName}" = ${matchingOption}`);
              } else {
                console.warn(`  ⚠ Dropdown "${fieldName}": "${value}" not in options [${options.join(', ')}]`);
              }
              break;

            case 'PDFRadioGroup':
              const radioGroup = form.getRadioGroup(fieldName);
              const radioOptions = radioGroup.getOptions();
              const matchingRadio = radioOptions.find(opt =>
                opt.toLowerCase() === String(value).toLowerCase() ||
                normalize(opt) === normalize(String(value))
              );
              if (matchingRadio) {
                radioGroup.select(matchingRadio);
                filledCount++;
                console.log(`  ✓ RadioGroup "${fieldName}" = ${matchingRadio}`);
              }
              break;

            case 'PDFTextField':
            default:
              const textField = form.getTextField(fieldName);
              textField.setText(String(value));
              filledCount++;
              console.log(`  ✓ TextField "${fieldName}" = ${String(value).substring(0, 50)}...`);
              break;
          }
        } catch (fieldError) {
          console.warn(`  ✗ Error filling "${fieldName}":`, fieldError.message);
        }
      }

      console.log(`=== RESULT: Filled ${filledCount}/${pdfFields.length} fields (${skippedCount} skipped - no data) ===`);

      return filledCount;

    } catch (error) {
      console.error('Error filling form fields:', error);
      throw error;
    }
  };

  // Generate PDF - either fill template or create new
  const generatePDF = async () => {
    try {
      const schema = formSchemas[selectedForm];
      let pdfDoc;
      let usedTemplate = false;

      // PRIORITY 1: Check for user-uploaded template (approved via HITL)
      if (pdfTemplates[selectedForm] && pdfTemplates[selectedForm].bytes) {
        try {
          pdfDoc = await PDFDocument.load(pdfTemplates[selectedForm].bytes);
          await fillPdfFormFields(pdfDoc, schema, notesData.formData);
          usedTemplate = true;
          addAlert('success', `Filled user-uploaded template: ${pdfTemplates[selectedForm].fileName || selectedForm}`);
        } catch (uploadedTemplateError) {
          console.warn('Failed to use uploaded template, trying default:', uploadedTemplateError);
        }
      }

      // PRIORITY 2: Try to load from schema's pdfTemplate path
      if (!usedTemplate && schema && schema.pdfTemplate) {
        const templateBytes = await loadPdfTemplate(schema.pdfTemplate);
        if (templateBytes) {
          pdfDoc = await PDFDocument.load(templateBytes);
          await fillPdfFormFields(pdfDoc, schema, notesData.formData);
          usedTemplate = true;
          addAlert('success', `Filled ${schema.name[language]} template`);
        }
      }

      // PRIORITY 3: If no template available, create new PDF with form data
      if (!usedTemplate) {
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]); // Letter size
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const { width, height } = page.getSize();
        let yPosition = height - 50;
        const margin = 50;
        const lineHeight = 18;

        // Header
        if (pdfData.settings.includeHeader) {
          page.drawText('AMS TRANSCRIPTION SUITE v4.0', {
            x: margin,
            y: yPosition,
            size: 18,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.2)
          });
          yPosition -= 25;

          page.drawText(schema ? schema.name[language] : 'Medical Documentation Report', {
            x: margin,
            y: yPosition,
            size: 12,
            font,
            color: rgb(0.4, 0.4, 0.4)
          });
          yPosition -= 10;

          page.drawText('[!] PROTOTYPE - NOT FOR PRODUCTION USE', {
            x: margin,
            y: yPosition,
            size: 10,
            font,
            color: rgb(0.8, 0.2, 0.2)
          });
          yPosition -= 30;

          page.drawLine({
            start: { x: margin, y: yPosition },
            end: { x: width - margin, y: yPosition },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8)
          });
          yPosition -= 30;
        }

        // Patient Information Section
        page.drawText('PATIENT INFORMATION', {
          x: margin,
          y: yPosition,
          size: 14,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.4)
        });
        yPosition -= 25;

        const patientInfo = [
          `Patient Name: ${consentData.patientName || 'N/A'}`,
          `Patient ID: ${consentData.patientId || 'N/A'}`,
          `Date of Birth: ${consentData.dateOfBirth || 'N/A'}`,
          `Consent Type: ${consentData.consentType}`,
          `Consent Obtained: ${consentData.consentObtained ? 'Yes' : 'No'}`,
          `Witness: ${consentData.witnessName || 'N/A'}`
        ];

        patientInfo.forEach(info => {
          page.drawText(info, {
            x: margin,
            y: yPosition,
            size: 11,
            font,
            color: rgb(0.2, 0.2, 0.2)
          });
          yPosition -= lineHeight;
        });

        yPosition -= 20;

        // Form Data by Section
        if (schema && Object.keys(notesData.formData).length > 0) {
          schema.sections.forEach(section => {
            if (yPosition < 150) {
              const newPage = pdfDoc.addPage([612, 792]);
              yPosition = height - 50;
            }

            page.drawText(section.title[language].toUpperCase(), {
              x: margin,
              y: yPosition,
              size: 12,
              font: boldFont,
              color: rgb(0.2, 0.2, 0.4)
            });
            yPosition -= 20;

            section.fields.forEach(field => {
              const value = notesData.formData[field.id];
              if (value !== undefined && value !== null && value !== '') {
                const label = field.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                if (field.type === 'checkbox') {
                  page.drawText(`${label}: ${value ? '☑' : '☐'}`, {
                    x: margin,
                    y: yPosition,
                    size: 11,
                    font,
                    color: rgb(0.2, 0.2, 0.2)
                  });
                } else if (field.type === 'textarea' && String(value).length > 80) {
                  // Multi-line for long text
                  page.drawText(`${label}:`, {
                    x: margin,
                    y: yPosition,
                    size: 11,
                    font: boldFont,
                    color: rgb(0.2, 0.2, 0.2)
                  });
                  yPosition -= lineHeight;

                  const words = String(value).split(' ');
                  let currentLine = '';
                  const maxWidth = width - (margin * 2);

                  words.forEach(word => {
                    const testLine = currentLine + (currentLine ? ' ' : '') + word;
                    const textWidth = font.widthOfTextAtSize(testLine, 10);

                    if (textWidth > maxWidth) {
                      page.drawText(currentLine, {
                        x: margin + 10,
                        y: yPosition,
                        size: 10,
                        font,
                        color: rgb(0.3, 0.3, 0.3)
                      });
                      yPosition -= lineHeight;
                      currentLine = word;
                    } else {
                      currentLine = testLine;
                    }
                  });

                  if (currentLine) {
                    page.drawText(currentLine, {
                      x: margin + 10,
                      y: yPosition,
                      size: 10,
                      font,
                      color: rgb(0.3, 0.3, 0.3)
                    });
                  }
                } else {
                  page.drawText(`${label}: ${value}`, {
                    x: margin,
                    y: yPosition,
                    size: 11,
                    font,
                    color: rgb(0.2, 0.2, 0.2)
                  });
                }
                yPosition -= lineHeight;
              }
            });

            yPosition -= 15;
          });
        }

        // Clinical Notes / Transcription
        if (notesData.transcription) {
          if (yPosition < 150) {
            pdfDoc.addPage([612, 792]);
            yPosition = height - 50;
          }

          page.drawText('CLINICAL NOTES / TRANSCRIPTION', {
            x: margin,
            y: yPosition,
            size: 14,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.4)
          });
          yPosition -= 25;

          const transcriptionLines = notesData.transcription.split('\n');
          transcriptionLines.forEach(line => {
            if (yPosition < 100) return;

            const words = line.split(' ');
            let currentLine = '';
            const maxWidth = width - (margin * 2);

            words.forEach(word => {
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              const textWidth = font.widthOfTextAtSize(testLine, 11);

              if (textWidth > maxWidth) {
                page.drawText(currentLine, {
                  x: margin,
                  y: yPosition,
                  size: 11,
                  font,
                  color: rgb(0.2, 0.2, 0.2)
                });
                yPosition -= lineHeight;
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            });

            if (currentLine && yPosition > 100) {
              page.drawText(currentLine, {
                x: margin,
                y: yPosition,
                size: 11,
                font,
                color: rgb(0.2, 0.2, 0.2)
              });
              yPosition -= lineHeight;
            }
          });
        }

        // Footer
        if (pdfData.settings.includeFooter) {
          page.drawLine({
            start: { x: margin, y: 80 },
            end: { x: width - margin, y: 80 },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8)
          });

          page.drawText(`Generated: ${new Date().toLocaleString()}`, {
            x: margin,
            y: 60,
            size: 10,
            font,
            color: rgb(0.5, 0.5, 0.5)
          });

          page.drawText('AMS Transcription Suite v4.0 - PROTOTYPE', {
            x: width - margin - 180,
            y: 60,
            size: 10,
            font,
            color: rgb(0.5, 0.5, 0.5)
          });
        }

        // Signature line
        if (pdfData.settings.includeSignature) {
          page.drawLine({
            start: { x: margin, y: 120 },
            end: { x: margin + 200, y: 120 },
            thickness: 1,
            color: rgb(0, 0, 0)
          });

          page.drawText('Clinician Signature (HITL Approved)', {
            x: margin,
            y: 105,
            size: 10,
            font,
            color: rgb(0.3, 0.3, 0.3)
          });

          page.drawLine({
            start: { x: width - margin - 150, y: 120 },
            end: { x: width - margin, y: 120 },
            thickness: 1,
            color: rgb(0, 0, 0)
          });

          page.drawText('Date', {
            x: width - margin - 150,
            y: 105,
            size: 10,
            font,
            color: rgb(0.3, 0.3, 0.3)
          });
        }
      }

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setPdfData(prev => ({
        ...prev,
        generated: true,
        pdfBlob,
        pdfUrl
      }));

      addAlert('success', usedTemplate ? 'PDF form fields filled successfully' : 'PDF generated (no template - created new document)');
    } catch (error) {
      console.error('PDF generation error:', error);
      addAlert('error', 'Failed to generate PDF: ' + error.message);
    }
  };

  // State for pending template approvals
  const [pendingTemplates, setPendingTemplates] = useState([]);
  const [showTemplateApproval, setShowTemplateApproval] = useState(false);
  const [currentPendingTemplate, setCurrentPendingTemplate] = useState(null);

  // Auto-detect form type based on PDF field names
  const detectFormType = (fieldNames) => {
    const fieldNamesLower = fieldNames.map(f => f.toLowerCase());
    const scores = {};

    Object.entries(formSchemas).forEach(([formId, schema]) => {
      let matchCount = 0;
      let totalFields = 0;

      schema.sections.forEach(section => {
        section.fields.forEach(field => {
          totalFields++;
          const pdfFieldLower = (field.pdfField || '').toLowerCase();
          if (fieldNamesLower.some(fn =>
            fn.includes(pdfFieldLower) ||
            pdfFieldLower.includes(fn) ||
            fn.replace(/[\s_-]/g, '') === pdfFieldLower.replace(/[\s_-]/g, '')
          )) {
            matchCount++;
          }
        });
      });

      scores[formId] = {
        matches: matchCount,
        total: totalFields,
        percentage: totalFields > 0 ? Math.round((matchCount / totalFields) * 100) : 0
      };
    });

    // Sort by match percentage
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1].percentage - a[1].percentage);

    return {
      bestMatch: sorted[0] ? { formId: sorted[0][0], ...sorted[0][1] } : null,
      allMatches: sorted.filter(([_, s]) => s.percentage > 10)
        .map(([formId, s]) => ({ formId, ...s }))
    };
  };

  // Handle PDF template upload with auto-detection and HITL approval
  const handleTemplateUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      addAlert('error', 'Please upload a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      const fieldInfo = fields.map(f => ({
        name: f.getName(),
        type: f.constructor.name.replace('PDF', '').replace('Field', '')
      }));

      const fieldNames = fieldInfo.map(f => f.name);
      const detection = detectFormType(fieldNames);

      // Create pending template for approval
      const pendingTemplate = {
        id: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        bytes: arrayBuffer,
        fields: fieldInfo,
        fieldCount: fields.length,
        detectedFormType: detection.bestMatch?.formId || null,
        detectedConfidence: detection.bestMatch?.percentage || 0,
        allMatches: detection.allMatches,
        selectedFormType: detection.bestMatch?.formId || selectedForm,
        status: 'pending_approval',
        uploadedAt: new Date().toISOString()
      };

      setPendingTemplates(prev => [...prev, pendingTemplate]);
      setCurrentPendingTemplate(pendingTemplate);
      setShowTemplateApproval(true);

      // Log for debugging
      console.log('=== PDF TEMPLATE ANALYSIS ===');
      console.log('File:', file.name);
      console.log('Fields found:', fields.length);
      console.log('Field names:', fieldNames);
      console.log('Detection results:', detection);
      console.log('=============================');

      addAlert('info', `PDF analyzed: ${fields.length} fields found. Approval required.`);

    } catch (error) {
      addAlert('error', 'Failed to parse PDF: ' + error.message);
      console.error('Template parse error:', error);
    }
  };

  // Approve pending template
  const approveTemplate = (templateId, selectedFormType) => {
    const template = pendingTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Store approved template
    setPdfTemplates(prev => ({
      ...prev,
      [selectedFormType]: {
        bytes: template.bytes,
        fields: template.fields,
        fileName: template.fileName,
        approvedAt: new Date().toISOString()
      }
    }));

    // Update pending template status
    setPendingTemplates(prev => prev.map(t =>
      t.id === templateId
        ? { ...t, status: 'approved', selectedFormType }
        : t
    ));

    setShowTemplateApproval(false);
    setCurrentPendingTemplate(null);

    addAlert('success', `Template approved for ${formSchemas[selectedFormType]?.name[language] || selectedFormType}`);
  };

  // Reject pending template
  const rejectTemplate = (templateId) => {
    setPendingTemplates(prev => prev.map(t =>
      t.id === templateId
        ? { ...t, status: 'rejected' }
        : t
    ));

    setShowTemplateApproval(false);
    setCurrentPendingTemplate(null);

    addAlert('warning', 'Template rejected');
  };

  // Render template approval modal
  const renderTemplateApprovalModal = () => {
    if (!showTemplateApproval || !currentPendingTemplate) return null;

    const template = currentPendingTemplate;

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, maxWidth: '700px' }}>
          <h2 style={styles.modalTitle}>
            PDF Template Approval Required
          </h2>

          <div style={{ ...styles.alert('warning'), marginBottom: '20px' }}>
            <Icons.AlertTriangle size={16} />
            <span>New PDF template requires your approval before use in workflow</span>
          </div>

          {/* File Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>File Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><strong>File:</strong> {template.fileName}</div>
              <div><strong>Size:</strong> {Math.round(template.fileSize / 1024)} KB</div>
              <div><strong>Fields Found:</strong> {template.fieldCount}</div>
              <div><strong>Uploaded:</strong> {new Date(template.uploadedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Auto-Detection Results */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>AI Form Detection</h3>
            {template.detectedFormType ? (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <span style={styles.badge(template.detectedConfidence > 50 ? 'success' : 'warning')}>
                    {template.detectedConfidence}% confidence
                  </span>
                  <span style={{ marginLeft: '12px' }}>
                    Detected: <strong>{formSchemas[template.detectedFormType]?.name[language]}</strong>
                  </span>
                </div>
                {template.allMatches.length > 1 && (
                  <div style={{ fontSize: '14px', color: brand.gray600 }}>
                    Other possible matches:
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      {template.allMatches.slice(1, 4).map(match => (
                        <li key={match.formId}>
                          {formSchemas[match.formId]?.name[language]} ({match.percentage}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: brand.danger }}>
                Could not auto-detect form type. Please select manually.
              </div>
            )}
          </div>

          {/* Manual Selection */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Select Form Type (Manual Override)</h3>
            <select
              style={styles.select}
              value={template.selectedFormType}
              onChange={(e) => setCurrentPendingTemplate(prev => ({
                ...prev,
                selectedFormType: e.target.value
              }))}
            >
              <option value="">-- Select Form Type --</option>
              {Object.entries(formSchemas).map(([key, form]) => (
                <option key={key} value={key}>
                  {form.name[language]}
                  {template.allMatches.find(m => m.formId === key)
                    ? ` (${template.allMatches.find(m => m.formId === key).percentage}% match)`
                    : ''
                  }
                </option>
              ))}
            </select>
          </div>

          {/* Field List (collapsible) */}
          <details style={{ marginBottom: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '12px' }}>
              View PDF Fields ({template.fieldCount} fields)
            </summary>
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              {template.fields.map((field, idx) => (
                <div key={idx} style={{ marginBottom: '4px' }}>
                  <span style={{ color: brand.blue }}>{field.type}</span>: {field.name}
                </div>
              ))}
            </div>
          </details>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => rejectTemplate(template.id)}
            >
              Reject
            </button>
            <button
              style={{
                ...styles.button,
                ...styles.successButton,
                ...((!template.selectedFormType) ? styles.disabledButton : {})
              }}
              onClick={() => approveTemplate(template.id, template.selectedFormType)}
              disabled={!template.selectedFormType}
            >
              Approve & Add to Workflow
            </button>
          </div>
        </div>
      </div>
    );
  };

  const downloadPDF = () => {
    if (pdfData.pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfData.pdfUrl;
      link.download = `AMS_Report_${consentData.patientId || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addAlert('success', 'PDF downloaded');
    }
  };

  // ============================================================================
  // HITL APPROVAL
  // ============================================================================
  const handleApproval = (status) => {
    setBundleData(prev => ({
      ...prev,
      approvalStatus: status,
      submittedAt: new Date().toISOString()
    }));
    addAlert(status === 'approved' ? 'success' : 'warning',
      status === 'approved' ? 'Bundle approved' : 'Bundle requires changes');
  };

  // ============================================================================
  // NAVIGATION & VALIDATION
  // ============================================================================
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return consentData.patientName &&
               consentData.patientId;
      case 2:
        return recordingData.audioUrl !== null;
      case 3:
        return notesData.transcription.trim().length > 0;
      case 4:
        return pdfData.generated;
      case 5:
        return bundleData.approvalStatus === 'approved';
      default:
        return true;
    }
  };

  const nextStep = () => {
    // Step 1 special: show consent popup instead of advancing directly
    if (currentStep === 1) {
      if (consentData.patientName && consentData.patientId) {
        if (consentData.consentObtained) {
          // Already consented, just advance
          setCurrentStep(2);
        } else {
          // Show the consent popup
          setShowConsentPopup(true);
        }
      } else {
        addAlert('warning', t('validationComplete'));
      }
      return;
    }
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      addAlert('warning', t('validationComplete'));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  const renderAlerts = () => (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001, maxWidth: '400px' }}>
      {alerts.map(alert => (
        <div key={alert.id} style={styles.alert(alert.type)}>
          {alert.type === 'success' && <Icons.CheckCircle size={16} />}
          {alert.type === 'error' && <Icons.XCircle size={16} />}
          {alert.type === 'warning' && <Icons.AlertTriangle size={16} />}
          {alert.type === 'info' && <Icons.Info size={16} />}
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );

  const renderProgressBar = () => {
    const stepIcons = [Icons.Shield, Icons.Mic, Icons.FileText, Icons.File, Icons.Package];
    return (
      <div style={styles.progressBar}>
        {[1, 2, 3, 4, 5].map((step, idx) => {
          const StepIcon = stepIcons[idx];
          return (
            <React.Fragment key={step}>
              {idx > 0 && <div style={styles.progressDivider} />}
              <div className="ams-progress-step" style={styles.progressStep}>
                <div style={styles.progressCircle(currentStep === step, currentStep > step)}>
                  {currentStep > step ? <Icons.Check size={14} /> : <StepIcon size={14} />}
                </div>
                <span style={styles.progressLabel(currentStep === step)}>
                  {t(`step${step}`)}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // ============================================================================
  // STEP RENDERERS
  // ============================================================================
  const renderStep1Consent = () => (
    <div>
      <h2 style={styles.stepTitle}>{t('consentTitle')}</h2>
      <p style={styles.stepDescription}>{t('consentDescription')}</p>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('patientName')} <span style={{ color: brand.danger }}>*</span>
          </label>
          <input
            type="text"
            style={styles.input}
            value={consentData.patientName}
            onChange={(e) => setConsentData(prev => ({ ...prev, patientName: e.target.value }))}
            placeholder={t('patientName')}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('patientId')} <span style={{ color: brand.danger }}>*</span>
          </label>
          <input
            type="text"
            style={styles.input}
            value={consentData.patientId}
            onChange={(e) => setConsentData(prev => ({ ...prev, patientId: e.target.value }))}
            placeholder={t('patientId')}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('dateOfBirth')}</label>
          <input
            type="date"
            style={styles.input}
            value={consentData.dateOfBirth}
            onChange={(e) => setConsentData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('witnessName')}</label>
          <input
            type="text"
            style={styles.input}
            value={consentData.witnessName}
            onChange={(e) => setConsentData(prev => ({ ...prev, witnessName: e.target.value }))}
            placeholder={t('witnessName')}
          />
        </div>
      </div>

      {/* Consent status indicator */}
      {consentData.consentObtained ? (
        <div style={{ ...styles.alert('success'), marginTop: '20px' }}>
          <Icons.CheckCircle size={16} />
          <div>
            <strong>{language === 'en' ? 'Electronic Consent Obtained' : 'Consentement Électronique Obtenu'}</strong>
            <div style={{ fontSize: '12px', marginTop: '2px', opacity: 0.85 }}>
              {consentData.patientName} &mdash; {new Date(consentData.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...styles.alert('info'), marginTop: '20px' }}>
          <Icons.Info size={16} />
          <span>{language === 'en' ? 'Fill in patient details above, then click Next to obtain electronic consent.' : 'Remplissez les informations ci-dessus, puis cliquez Suivant pour obtenir le consentement électronique.'}</span>
        </div>
      )}
    </div>
  );

  const renderStep2Recording = () => (
    <div>
      <h2 style={styles.stepTitle}>{t('recordingTitle')}</h2>
      <p style={styles.stepDescription}>{t('recordingDescription')}</p>

      {recordingData.isRecording && (
        <div style={styles.recordingIndicator}>
          <div style={styles.recordingDot} />
          <Icons.Mic size={16} style={{ marginRight: '6px' }} />
          <span style={{ fontWeight: '600', color: brand.danger }}>
            Recording... {formatDuration(recordingData.duration)}
          </span>
          {recordingData.isPaused && <span style={styles.badge('warning')}><Icons.Pause size={12} /> Paused</span>}
        </div>
      )}

      <div style={{ ...styles.section, marginTop: '24px' }}>
        <h3 style={styles.sectionTitle}><Icons.Mic size={16} style={{ marginRight: '8px' }} />{t('recordingTitle')}</h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {!recordingData.isRecording ? (
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={startRecording}
            >
              <Icons.Mic size={16} /> {t('startRecording')}
            </button>
          ) : (
            <>
              <button
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={stopRecording}
              >
                <Icons.Stop size={16} /> {t('stopRecording')}
              </button>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={pauseRecording}
              >
                {recordingData.isPaused ? <><Icons.Play size={16} /> {t('resumeRecording')}</> : <><Icons.Pause size={16} /> {t('pauseRecording')}</>}
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={styles.label}><Icons.Upload size={14} style={{ marginRight: '6px' }} />{t('uploadAudio')}</label>
          <label className="ams-upload-zone" style={{
            ...styles.uploadZone,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Icons.Upload size={24} style={{ color: brand.blue }} />
            <span style={{ fontSize: '13px', color: brand.blue, fontWeight: '500' }}>
              {language === 'en' ? 'Click to browse or drag audio file here' : 'Cliquez pour parcourir ou glissez un fichier audio ici'}
            </span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {recordingData.audioUrl && (
          <div style={{ marginTop: '20px' }}>
            <label style={styles.label}>Audio Preview</label>
            <audio controls src={recordingData.audioUrl} style={{ width: '100%' }} />

            <div style={{ marginTop: '16px' }}>
              <label style={styles.label}>{t('audioQuality')}</label>
              <select
                style={styles.select}
                value={recordingData.quality}
                onChange={(e) => setRecordingData(prev => ({ ...prev, quality: e.target.value }))}
              >
                <option value="good">{t('qualityGood')}</option>
                <option value="fair">{t('qualityFair')}</option>
                <option value="poor">{t('qualityPoor')}</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3Notes = () => {
    const schema = formSchemas[selectedForm];

    return (
      <div>
        <h2 style={styles.stepTitle}>{t('notesTitle')}</h2>
        <p style={styles.stepDescription}>{t('notesDescription')}</p>

        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '12px 14px', background: brand.blueLight, border: `1px solid ${brand.blue}30`,
          borderRadius: brand.radius, marginBottom: '16px',
        }}>
          <Icons.Info size={16} style={{ color: brand.blue, flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '12px', color: brand.blueDark, lineHeight: '1.5', margin: 0 }}>
            {language === 'en'
              ? 'Each field below maps to a corresponding field in the selected PDF template. When you generate the PDF in Step 4, these values are used to populate the template automatically.'
              : 'Chaque champ ci-dessous correspond à un champ du modèle PDF sélectionné. Lors de la génération du PDF à l\'étape 4, ces valeurs remplissent automatiquement le modèle.'}
          </p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('selectFormType')}</label>
          <select
            style={styles.select}
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
          >
            {Object.entries(formSchemas).map(([key, form]) => (
              <option key={key} value={key}>{form.name[language]}</option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.section, marginTop: '24px' }}>
          <h3 style={styles.sectionTitle}>{t('transcription')}</h3>
          <textarea
            style={styles.textarea}
            value={notesData.transcription}
            onChange={(e) => setNotesData(prev => ({ ...prev, transcription: e.target.value }))}
            placeholder="Enter or paste transcription here..."
            rows={8}
          />
        </div>

        {schema && schema.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={styles.section}>
            <h3 style={styles.sectionTitle}>{section.title[language]}</h3>
            <div style={styles.formGrid}>
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} style={styles.formGroup}>
                  <label style={styles.label}>
                    {field.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {field.required && <span style={{ color: brand.danger }}> *</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      style={styles.textarea}
                      value={notesData.formData[field.id] || ''}
                      onChange={(e) => setNotesData(prev => ({
                        ...prev,
                        formData: { ...prev.formData, [field.id]: e.target.value }
                      }))}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      style={styles.select}
                      value={notesData.formData[field.id] || ''}
                      onChange={(e) => setNotesData(prev => ({
                        ...prev,
                        formData: { ...prev.formData, [field.id]: e.target.value }
                      }))}
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      style={styles.input}
                      value={notesData.formData[field.id] || ''}
                      onChange={(e) => setNotesData(prev => ({
                        ...prev,
                        formData: { ...prev.formData, [field.id]: e.target.value }
                      }))}
                      min={field.min}
                      max={field.max}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStep4PDF = () => (
    <div>
      <h2 style={styles.stepTitle}>{t('pdfTitle')}</h2>
      <p style={styles.stepDescription}>{t('pdfDescription')}</p>

      {/* ── SECTION 1: BUILT-IN PDF FORMS LIBRARY ── */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Folder size={16} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Built-in Form Templates' : 'Modèles de Formulaires Intégrés'}
          <span style={{
            marginLeft: 'auto',
            fontSize: '11px',
            fontWeight: '600',
            color: brand.gray600,
            fontFamily: brand.fontBody,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {Object.keys(formSchemas).length} {language === 'en' ? 'available' : 'disponibles'}
          </span>
        </h3>

        {/* Form selector dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>{t('selectFormType')}</label>
          <select
            style={styles.select}
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
          >
            {Object.entries(formSchemas).map(([key, form]) => (
              <option key={key} value={key}>{form.name[language]}</option>
            ))}
          </select>
        </div>

        {/* Grid of all built-in forms showing selected state */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '8px',
        }}>
          {Object.entries(formSchemas).map(([key, form]) => {
            const isSelected = selectedForm === key;
            const hasUploadedTemplate = !!pdfTemplates[key];
            return (
              <div
                key={key}
                onClick={() => setSelectedForm(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: brand.radius,
                  border: isSelected ? `2px solid ${brand.blue}` : `1px solid ${brand.gray200}`,
                  background: isSelected ? brand.blueLight : brand.white,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  borderRadius: '6px',
                  background: isSelected ? brand.blue : brand.gray100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icons.FileText size={14} style={{ color: isSelected ? brand.white : brand.gray600 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: isSelected ? '600' : '500',
                    color: isSelected ? brand.blue : brand.gray800,
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {form.name[language]}
                  </div>
                  <div style={{ fontSize: '10px', color: brand.gray400, marginTop: '2px' }}>
                    {form.sections.length} {language === 'en' ? 'sections' : 'sections'}
                    {hasUploadedTemplate && (
                      <span style={{ color: brand.success, marginLeft: '6px' }}>
                        + {language === 'en' ? 'custom' : 'perso.'}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Icons.Check size={14} style={{ color: brand.blue, flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: UPLOAD CUSTOM PDF TEMPLATE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Upload area */}
        <label className="ams-upload-zone" style={{
          ...styles.uploadZone,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          minHeight: '160px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: brand.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: brand.shadow,
          }}>
            <Icons.Upload size={22} style={{ color: brand.blue }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: brand.blue }}>
              {language === 'en' ? 'Upload Custom Template' : 'Télécharger un Modèle'}
            </div>
            <div style={{ fontSize: '11px', color: brand.gray600, marginTop: '4px' }}>
              {language === 'en' ? 'Fillable PDF — auto-detected & mapped' : 'PDF remplissable — détection automatique'}
            </div>
            <div style={{ fontSize: '10px', color: brand.gray400, marginTop: '6px', lineHeight: '1.4' }}>
              {language === 'en'
                ? 'Available to your account immediately. Requires admin approval for global automation.'
                : 'Disponible pour votre compte immédiatement. Nécessite l\'approbation admin pour l\'automatisation globale.'}
            </div>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleTemplateUpload}
            style={{ display: 'none' }}
          />
          {pendingTemplates.filter(t => t.status === 'pending_approval').length > 0 && (
            <span style={styles.badge('warning')}>
              {pendingTemplates.filter(t => t.status === 'pending_approval').length} {language === 'en' ? 'pending approval' : 'en attente'}
            </span>
          )}
        </label>

        {/* Loaded / uploaded templates list */}
        <div style={{
          ...styles.section,
          marginBottom: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ ...styles.sectionTitle, fontSize: '14px', marginBottom: '12px', paddingBottom: '8px' }}>
            <Icons.Clipboard size={14} style={{ marginRight: '8px' }} />
            {language === 'en' ? 'Uploaded Templates' : 'Modèles Téléchargés'}
            <span style={{ marginLeft: 'auto', fontFamily: brand.fontBody, fontWeight: '600', fontSize: '11px', color: brand.gray400 }}>
              {Object.keys(pdfTemplates).length}
            </span>
          </h3>
          {Object.keys(pdfTemplates).length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: brand.gray400,
              fontSize: '12px',
              fontStyle: 'italic',
              padding: '16px 0',
            }}>
              {language === 'en' ? 'No custom templates uploaded yet' : 'Aucun modèle téléchargé'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.entries(pdfTemplates).map(([formId, template]) => (
                <div key={formId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: brand.white,
                  borderRadius: brand.radius,
                  border: `1px solid ${brand.gray200}`,
                }}>
                  <Icons.File size={14} style={{ color: brand.success, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '500', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formSchemas[formId]?.name[language] || formId}
                  </span>
                  <span style={{ ...styles.badge('success'), padding: '2px 8px', fontSize: '10px' }}>
                    {template.fields.length} {language === 'en' ? 'fields' : 'champs'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 3: PDF SETTINGS ── */}
      <div style={{ ...styles.section, marginTop: '16px' }}>
        <h3 style={{ ...styles.sectionTitle, fontSize: '14px', marginBottom: '12px', paddingBottom: '8px' }}>
          <Icons.Settings size={14} style={{ marginRight: '8px' }} />
          {t('pdfSettings')}
        </h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={pdfData.settings.includeHeader}
              onChange={(e) => setPdfData(prev => ({
                ...prev,
                settings: { ...prev.settings, includeHeader: e.target.checked }
              }))}
            />
            <span style={{ fontSize: '13px' }}>{t('includeHeader')}</span>
          </label>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={pdfData.settings.includeFooter}
              onChange={(e) => setPdfData(prev => ({
                ...prev,
                settings: { ...prev.settings, includeFooter: e.target.checked }
              }))}
            />
            <span style={{ fontSize: '13px' }}>{t('includeFooter')}</span>
          </label>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={pdfData.settings.includeSignature}
              onChange={(e) => setPdfData(prev => ({
                ...prev,
                settings: { ...prev.settings, includeSignature: e.target.checked }
              }))}
            />
            <span style={{ fontSize: '13px' }}>{t('includeSignature')}</span>
          </label>
        </div>
      </div>

      {/* ── SECTION 4: SELECTED FORM + GENERATE ── */}
      <div style={{
        marginTop: '16px',
        padding: '20px 24px',
        background: brand.blueLight,
        borderRadius: brand.radiusMd,
        border: `1px solid #bae6fd`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', color: brand.gray600, marginBottom: '4px' }}>
            {language === 'en' ? 'Selected Form' : 'Formulaire Sélectionné'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: brand.blue, fontFamily: brand.fontHeading }}>
            {formSchemas[selectedForm]?.name[language] || selectedForm}
            {pdfTemplates[selectedForm] && (
              <span style={{ marginLeft: '10px', ...styles.badge('success'), fontSize: '10px' }}>
                {language === 'en' ? 'Custom template loaded' : 'Modèle personnalisé chargé'}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={generatePDF}
          >
            <Icons.FileText size={14} />
            {pdfTemplates[selectedForm]
              ? (language === 'en' ? 'Fill Template' : 'Remplir le Modèle')
              : t('generatePdf')
            }
          </button>
          {pdfData.generated && (
            <>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => window.open(pdfData.pdfUrl, '_blank')}
              >
                <Icons.Eye size={14} /> {t('previewPdf')}
              </button>
              <button
                style={{ ...styles.button, ...styles.successButton }}
                onClick={downloadPDF}
              >
                <Icons.Download size={14} /> {t('downloadPdf')}
              </button>
            </>
          )}
        </div>
      </div>

      {pdfData.generated && (
        <div style={{ ...styles.alert('success'), marginTop: '16px' }}>
          <Icons.CheckCircle size={16} style={{ marginRight: '8px' }} />
          {pdfTemplates[selectedForm]
            ? (language === 'en' ? 'PDF form fields filled successfully' : 'Champs du formulaire PDF remplis avec succès')
            : 'PDF generated successfully and ready for download'
          }
        </div>
      )}
    </div>
  );

  const renderStep5Bundle = () => (
    <div>
      <h2 style={styles.stepTitle}>{t('bundleTitle')}</h2>
      <p style={styles.stepDescription}>{t('bundleDescription')}</p>

      {/* HITL Approval Gate */}
      <div style={styles.approvalCard}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.AlertTriangle size={18} /> {t('approvalRequired')}
        </h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('approverName')}</label>
          <input
            type="text"
            style={styles.input}
            value={bundleData.approverName}
            onChange={(e) => setBundleData(prev => ({ ...prev, approverName: e.target.value }))}
            placeholder={t('approverName')}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('approvalNotes')}</label>
          <textarea
            style={styles.textarea}
            value={bundleData.approvalNotes}
            onChange={(e) => setBundleData(prev => ({ ...prev, approvalNotes: e.target.value }))}
            placeholder={t('approvalNotes')}
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            style={{ ...styles.button, ...styles.successButton }}
            onClick={() => handleApproval('approved')}
            disabled={!bundleData.approverName}
          >
            {t('approve')}
          </button>
          <button
            style={{ ...styles.button, ...styles.dangerButton }}
            onClick={() => handleApproval('rejected')}
          >
            {t('reject')}
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => handleApproval('changes_requested')}
          >
            {t('requestChanges')}
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <span style={styles.badge(
            bundleData.approvalStatus === 'approved' ? 'success' :
            bundleData.approvalStatus === 'rejected' ? 'error' :
            bundleData.approvalStatus === 'changes_requested' ? 'warning' : 'default'
          )}>
            {bundleData.approvalStatus === 'approved' ? t('approved') :
             bundleData.approvalStatus === 'rejected' ? t('rejected') :
             bundleData.approvalStatus === 'changes_requested' ? t('requestChanges') :
             t('approvalPending')}
          </span>
        </div>
      </div>

      {/* Bundle Contents */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('bundleContents')}</h3>

        <div style={styles.listItem}>
          <span>Patient Consent</span>
          <span style={styles.badge(consentData.consentObtained ? 'success' : 'error')}>
            {consentData.consentObtained ? 'Complete' : 'Incomplete'}
          </span>
        </div>

        <div style={styles.listItem}>
          <span>Audio Recording</span>
          <span style={styles.badge(recordingData.audioUrl ? 'success' : 'error')}>
            {recordingData.audioUrl ? 'Uploaded' : 'Missing'}
          </span>
        </div>

        <div style={styles.listItem}>
          <span>Clinical Notes</span>
          <span style={styles.badge(notesData.transcription ? 'success' : 'error')}>
            {notesData.transcription ? 'Complete' : 'Empty'}
          </span>
        </div>

        <div style={styles.listItem}>
          <span>PDF Document</span>
          <span style={styles.badge(pdfData.generated ? 'success' : 'error')}>
            {pdfData.generated ? 'Generated' : 'Not Generated'}
          </span>
        </div>

        <div style={styles.listItem}>
          <span>HITL Approval</span>
          <span style={styles.badge(
            bundleData.approvalStatus === 'approved' ? 'success' : 'warning'
          )}>
            {bundleData.approvalStatus === 'approved' ? 'Approved' : 'Pending'}
          </span>
        </div>
      </div>

      {bundleData.approvalStatus === 'approved' && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => {
              setBundleData(prev => ({ ...prev, status: 'submitted', submittedAt: new Date().toISOString() }));
              addAlert('success', 'Bundle submitted successfully');
            }}
          >
            {t('submitBundle')}
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={downloadPDF}
          >
            {t('exportBundle')}
          </button>
        </div>
      )}

      {bundleData.status === 'submitted' && (
        <div style={{ ...styles.alert('success'), marginTop: '24px' }}>
          <Icons.CheckCircle size={16} style={{ marginRight: '8px' }} />
          Bundle submitted at {new Date(bundleData.submittedAt).toLocaleString()}
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1Consent();
      case 2: return renderStep2Recording();
      case 3: return renderStep3Notes();
      case 4: return renderStep4PDF();
      case 5: return renderStep5Bundle();
      default: return null;
    }
  };

  // ============================================================================
  // MODALS
  // ============================================================================
  const renderLockScreen = () => (
    <div style={styles.modal}>
      <div style={{ ...styles.modalContent, textAlign: 'center', maxWidth: '420px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: brand.blueLight, display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <Icons.Lock size={32} style={{ color: brand.blue }} />
        </div>
        <h2 style={{ ...styles.modalTitle, textAlign: 'center' }}>{t('locked')}</h2>
        <div style={{
          background: brand.gray50, border: `1px solid ${brand.gray200}`,
          borderRadius: brand.radius, padding: '16px', marginBottom: '20px',
        }}>
          <p style={{ color: brand.gray800, fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
            {language === 'en'
              ? 'Recurring autolock — 2 min compliance function'
              : 'Verrouillage automatique récurrent — fonction de conformité 2 min'}
          </p>
          <p style={{ color: brand.gray500, fontSize: '12px', marginTop: '8px' }}>
            {language === 'en'
              ? 'This session was automatically locked due to inactivity to comply with healthcare data protection standards.'
              : 'Cette session a été automatiquement verrouillée en raison de l\'inactivité pour se conformer aux normes de protection des données de santé.'}
          </p>
        </div>

        <button
          style={{ ...styles.button, ...styles.blueButton, width: '100%', justifyContent: 'center', padding: '12px' }}
          onClick={handleUnlock}
        >
          <Icons.Unlock size={16} /> {t('unlock')}
        </button>
      </div>
    </div>
  );

  const renderTimeoutWarning = () => (
    <div style={styles.modal}>
      <div style={{ ...styles.modalContent, textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: brand.orangeLight, display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <Icons.Clock size={32} style={{ color: brand.orange }} />
        </div>
        <h2 style={{ ...styles.modalTitle, textAlign: 'center' }}>{t('sessionTimeout')}</h2>
        <p style={{ marginBottom: '20px', color: brand.gray600, fontSize: '14px' }}>
          {t('sessionExpiring')} <strong style={{ color: brand.orange, fontSize: '20px', fontFamily: brand.fontHeading }}>{timeoutSeconds}</strong> {language === 'en' ? 'seconds' : 'secondes'}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{ ...styles.button, ...styles.blueButton, flex: 1, justifyContent: 'center', padding: '12px' }}
            onClick={extendSession}
          >
            {t('extendSession')}
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton, flex: 1, justifyContent: 'center', padding: '12px' }}
            onClick={() => setIsLocked(true)}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // CONSENT POPUP
  // ============================================================================
  const renderConsentPopup = () => {
    if (!showConsentPopup) return null;
    const patientName = consentData.patientName || '___________';
    const today = new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA');
    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, maxWidth: '560px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="/ams-logo.png" alt="AMS" style={{ height: '36px', marginBottom: '10px', filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(1200%) hue-rotate(180deg)' }} />
            <h2 style={{ fontFamily: brand.fontHeading, fontSize: '20px', fontWeight: '700', color: brand.blue }}>
              {language === 'en' ? 'Electronic Consent Form' : 'Formulaire de Consentement Électronique'}
            </h2>
            <p style={{ fontSize: '11px', color: brand.gray600, marginTop: '4px' }}>
              AMS Centre Médical et de Réadaptation
            </p>
          </div>

          {/* Consent body */}
          <div style={{
            background: brand.gray50,
            borderRadius: brand.radiusMd,
            border: `1px solid ${brand.gray200}`,
            padding: '20px',
            marginBottom: '20px',
            fontSize: '13px',
            color: brand.gray800,
            lineHeight: '1.7',
          }}>
            <p style={{ marginBottom: '12px' }}>
              {language === 'en'
                ? `I, `
                : `Je, `}
              <strong style={{ color: brand.blue, borderBottom: `1px solid ${brand.blue}`, paddingBottom: '1px' }}>
                {patientName}
              </strong>
              {language === 'en'
                ? `, hereby consent to the audio recording of my clinical session at AMS Centre Médical et de Réadaptation for the purposes of medical transcription and documentation.`
                : `, consens par la présente à l'enregistrement audio de ma séance clinique au Centre Médical et de Réadaptation AMS aux fins de transcription et de documentation médicale.`}
            </p>
            <p style={{ marginBottom: '12px' }}>
              {language === 'en'
                ? 'I understand that:'
                : 'Je comprends que :'}
            </p>
            <ul style={{ paddingLeft: '18px', marginBottom: '12px' }}>
              <li>{language === 'en' ? 'The recording will be used solely for clinical documentation purposes' : 'L\'enregistrement sera utilisé uniquement à des fins de documentation clinique'}</li>
              <li>{language === 'en' ? 'My data will be handled in accordance with Quebec privacy regulations (Loi 25)' : 'Mes données seront traitées conformément aux réglementations québécoises (Loi 25)'}</li>
              <li>{language === 'en' ? 'I may withdraw my consent at any time by notifying my clinician' : 'Je peux retirer mon consentement à tout moment en avisant mon clinicien'}</li>
              <li>{language === 'en' ? 'All recordings are processed locally and not shared with third parties' : 'Tous les enregistrements sont traités localement et non partagés avec des tiers'}</li>
            </ul>
            <p style={{ fontSize: '12px', color: brand.gray600 }}>
              {language === 'en' ? 'Date:' : 'Date :'} {today} &nbsp;&middot;&nbsp; {language === 'en' ? 'Patient ID:' : 'ID Patient :'} {consentData.patientId || '—'}
            </p>
          </div>

          {/* Consent checkbox */}
          <div style={{
            padding: '16px',
            background: consentData.consentObtained ? brand.successBg : brand.orangeLight,
            borderRadius: brand.radiusMd,
            border: `1.5px solid ${consentData.consentObtained ? brand.successBdr : brand.orange}`,
            marginBottom: '20px',
            transition: 'all 0.2s ease',
          }}>
            <label style={{ ...styles.checkbox, gap: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ ...styles.checkboxInput, width: '22px', height: '22px', accentColor: brand.success }}
                checked={consentData.consentObtained}
                onChange={(e) => setConsentData(prev => ({
                  ...prev,
                  consentObtained: e.target.checked,
                  consentType: 'electronic',
                  timestamp: e.target.checked ? new Date().toISOString() : null
                }))}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: consentData.consentObtained ? '#166534' : brand.gray900 }}>
                  {language === 'en'
                    ? `I, ${patientName}, agree to the terms above`
                    : `Je, ${patientName}, accepte les conditions ci-dessus`}
                </div>
                <div style={{ fontSize: '11px', color: brand.gray600, marginTop: '3px' }}>
                  {language === 'en' ? 'Electronic consent — check to proceed' : 'Consentement électronique — cochez pour continuer'}
                </div>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{ ...styles.button, ...styles.secondaryButton, flex: 1, justifyContent: 'center' }}
              onClick={() => setShowConsentPopup(false)}
            >
              {t('cancel')}
            </button>
            <button
              style={{
                ...styles.button, ...styles.blueButton, flex: 1, justifyContent: 'center',
                ...(!consentData.consentObtained ? styles.disabledButton : {})
              }}
              disabled={!consentData.consentObtained}
              onClick={() => {
                setShowConsentPopup(false);
                setCurrentStep(2);
                setUsageStats(prev => {
                  const updated = { ...prev, totalPatients: prev.totalPatients + 1, sessionsToday: prev.sessionsToday + 1, sessionsThisWeek: prev.sessionsThisWeek + 1, lastSessionDate: new Date().toISOString() };
                  localStorage.setItem('ams_usage_stats', JSON.stringify(updated));
                  return updated;
                });
                addAlert('success', language === 'en' ? 'Consent recorded — ready to record' : 'Consentement enregistré — prêt à enregistrer');
              }}
            >
              <Icons.ArrowRight size={14} />
              {language === 'en' ? 'Continue' : 'Continuer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // DASHBOARD PAGE
  // ============================================================================
  const renderDashboard = () => {
    const statCards = [
      { label: language === 'en' ? 'Total Patients' : 'Patients Totaux', value: usageStats.totalPatients, icon: Icons.User, color: brand.blue },
      { label: language === 'en' ? 'Today\'s Sessions' : 'Sessions Aujourd\'hui', value: usageStats.sessionsToday, icon: Icons.Clock, color: brand.orange },
      { label: language === 'en' ? 'This Week' : 'Cette Semaine', value: usageStats.sessionsThisWeek, icon: Icons.Chart, color: brand.success },
      { label: language === 'en' ? 'Total Hours' : 'Heures Totales', value: usageStats.totalHours.toFixed(1), icon: Icons.Mic, color: '#8b5cf6' },
    ];

    return (
      <div>
        <h2 style={styles.stepTitle}>
          {language === 'en' ? 'Dashboard' : 'Tableau de Bord'}
        </h2>
        <p style={styles.stepDescription}>
          {language === 'en' ? 'Overview of your transcription activity' : 'Aperçu de votre activité de transcription'}
        </p>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {statCards.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} style={{
                background: brand.white,
                borderRadius: brand.radiusMd,
                padding: '20px',
                border: `1px solid ${brand.gray200}`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <StatIcon size={22} style={{ color: stat.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: brand.fontHeading, color: brand.gray900, lineHeight: '1' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: brand.gray600, marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Icons.Play size={14} style={{ marginRight: '8px' }} />
            {language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton, padding: '14px 28px' }}
              onClick={() => {
                setShowConsentPopup(true);
              }}
            >
              <Icons.Plus size={14} />
              {language === 'en' ? 'New Transcription' : 'Nouvelle Transcription'}
            </button>
            <button
              style={{ ...styles.button, ...styles.blueButton, padding: '14px 28px' }}
              onClick={() => setActivePage('pdfManager')}
            >
              <Icons.Folder size={14} />
              {language === 'en' ? 'Manage PDF Templates' : 'Gérer les Modèles PDF'}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Icons.Clock size={14} style={{ marginRight: '8px' }} />
            {language === 'en' ? 'Recent Activity' : 'Activité Récente'}
          </h3>
          {usageStats.totalPatients === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: brand.gray400, fontSize: '13px' }}>
              {language === 'en' ? 'No sessions recorded yet. Start your first transcription!' : 'Aucune session enregistrée. Commencez votre première transcription!'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {usageStats.lastSessionDate && (
                <div style={styles.listItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.CheckCircle size={14} style={{ color: brand.success }} />
                    <span style={{ fontSize: '13px' }}>
                      {language === 'en' ? 'Last session' : 'Dernière session'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: brand.gray600 }}>
                    {new Date(usageStats.lastSessionDate).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // PDF MANAGER PAGE
  // ============================================================================
  const renderPdfManager = () => (
    <div>
      <h2 style={styles.stepTitle}>
        <Icons.Folder size={22} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
        {language === 'en' ? 'PDF Template Manager' : 'Gestionnaire de Modèles PDF'}
      </h2>
      <p style={styles.stepDescription}>
        {language === 'en'
          ? 'Upload new fielded PDFs, view existing templates, and manage your form library.'
          : 'Téléchargez de nouveaux PDF, consultez les modèles existants et gérez votre bibliothèque de formulaires.'}
      </p>

      {/* Upload new template */}
      <label className="ams-upload-zone" style={{
        ...styles.uploadZone,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        minHeight: '140px',
        cursor: 'pointer',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: brand.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: brand.shadow,
        }}>
          <Icons.Upload size={26} style={{ color: brand.blue }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: brand.blue, fontFamily: brand.fontHeading }}>
            {language === 'en' ? 'Upload New PDF Template' : 'Télécharger un Nouveau Modèle PDF'}
          </div>
          <div style={{ fontSize: '12px', color: brand.gray600, marginTop: '4px' }}>
            {language === 'en' ? 'Fillable PDF forms — fields are auto-detected and mapped to assessment types' : 'Formulaires PDF remplissables — les champs sont détectés et mappés automatiquement'}
          </div>
          <div style={{ fontSize: '11px', color: brand.gray400, marginTop: '8px', maxWidth: '480px', lineHeight: '1.5' }}>
            {language === 'en'
              ? 'Uploaded PDFs can be used by your account immediately by choosing it after the recording, but require admin or developer approval before being added to the global system\'s automation.'
              : 'Les PDF téléchargés peuvent être utilisés par votre compte immédiatement en les choisissant après l\'enregistrement, mais nécessitent l\'approbation d\'un administrateur ou développeur avant d\'être ajoutés à l\'automatisation globale du système.'}
          </div>
        </div>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleTemplateUpload}
          style={{ display: 'none' }}
        />
      </label>

      {/* Pending approval */}
      {pendingTemplates.filter(t => t.status === 'pending_approval').length > 0 && (
        <div style={{ ...styles.section, background: brand.orangeLight, border: `1.5px solid ${brand.orange}`, marginBottom: '24px' }}>
          <h3 style={{ ...styles.sectionTitle, color: brand.warningText, borderBottomColor: brand.orange }}>
            <Icons.AlertTriangle size={14} style={{ marginRight: '8px' }} />
            {language === 'en' ? 'Pending Approval' : 'En Attente d\'Approbation'}
            <span style={{ ...styles.badge('warning'), marginLeft: 'auto' }}>
              {pendingTemplates.filter(t => t.status === 'pending_approval').length}
            </span>
          </h3>
          {pendingTemplates.filter(t => t.status === 'pending_approval').map(tmpl => (
            <div key={tmpl.id} style={{
              ...styles.listItem,
              background: brand.white,
              border: `1px solid ${brand.warningBdr}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <Icons.File size={16} style={{ color: brand.orange }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{tmpl.fileName}</div>
                  <div style={{ fontSize: '11px', color: brand.gray600 }}>
                    {tmpl.fieldCount} {language === 'en' ? 'fields' : 'champs'} &middot;
                    {tmpl.detectedFormType && ` ${language === 'en' ? 'Detected:' : 'Détecté:'} ${formSchemas[tmpl.detectedFormType]?.name[language] || tmpl.detectedFormType} (${tmpl.detectedConfidence}%)`}
                  </div>
                </div>
              </div>
              <button
                style={{ ...styles.button, ...styles.blueButton, fontSize: '11px', padding: '6px 14px' }}
                onClick={() => {
                  setCurrentPendingTemplate(tmpl);
                  setShowTemplateApproval(true);
                }}
              >
                {language === 'en' ? 'Review' : 'Examiner'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Built-in templates */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.FileText size={14} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Built-in Templates' : 'Modèles Intégrés'}
          <span style={{
            marginLeft: 'auto', fontSize: '11px', fontWeight: '600', color: brand.gray400,
            fontFamily: brand.fontBody, textTransform: 'uppercase',
          }}>
            {Object.keys(formSchemas).length} {language === 'en' ? 'forms' : 'formulaires'}
          </span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.entries(formSchemas).map(([key, form]) => {
            const hasCustom = !!pdfTemplates[key];
            return (
              <div key={key} style={{
                ...styles.listItem,
                padding: '12px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', minWidth: '32px',
                    background: hasCustom ? `${brand.success}12` : brand.gray100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icons.FileText size={14} style={{ color: hasCustom ? brand.success : brand.gray600 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: brand.gray900 }}>
                      {form.name[language]}
                    </div>
                    <div style={{ fontSize: '11px', color: brand.gray400 }}>
                      {form.sections.length} {language === 'en' ? 'sections' : 'sections'} &middot; {form.sections.reduce((acc, s) => acc + s.fields.length, 0)} {language === 'en' ? 'fields' : 'champs'}
                      {hasCustom && (
                        <span style={{ color: brand.success, marginLeft: '6px' }}>
                          &middot; {language === 'en' ? 'Custom template loaded' : 'Modèle personnalisé'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {hasCustom && (
                    <span style={{ ...styles.badge('success'), fontSize: '10px' }}>
                      {pdfTemplates[key].fields.length} {language === 'en' ? 'mapped' : 'mappés'}
                    </span>
                  )}
                  <button
                    style={{ ...styles.button, ...styles.secondaryButton, fontSize: '11px', padding: '5px 12px', textTransform: 'none' }}
                    onClick={() => {
                      setSelectedForm(key);
                      setActivePage('transcription');
                      setCurrentStep(4);
                    }}
                  >
                    {language === 'en' ? 'Use' : 'Utiliser'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded/custom templates */}
      {Object.keys(pdfTemplates).length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Icons.Cloud size={14} style={{ marginRight: '8px' }} />
            {language === 'en' ? 'Custom Uploaded Templates' : 'Modèles Personnalisés Téléchargés'}
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '600', color: brand.gray400, fontFamily: brand.fontBody }}>
              {Object.keys(pdfTemplates).length}
            </span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(pdfTemplates).map(([formId, template]) => (
              <div key={formId} style={styles.listItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <Icons.File size={14} style={{ color: brand.success }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>
                      {formSchemas[formId]?.name[language] || formId}
                    </div>
                    <div style={{ fontSize: '11px', color: brand.gray400 }}>
                      {template.fileName} &middot; {template.fields.length} {language === 'en' ? 'fields' : 'champs'}
                      {template.approvedAt && ` &middot; ${new Date(template.approvedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // SETTINGS PAGE
  // ============================================================================
  const renderSettings = () => (
    <div>
      <h2 style={styles.stepTitle}>
        {language === 'en' ? 'Settings' : 'Paramètres'}
      </h2>
      <p style={styles.stepDescription}>
        {language === 'en' ? 'Configure your transcription suite preferences' : 'Configurez vos préférences de transcription'}
      </p>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Globe size={14} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Language' : 'Langue'}
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{ ...styles.button, ...(language === 'en' ? styles.blueButton : styles.secondaryButton) }}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button
            style={{ ...styles.button, ...(language === 'fr' ? styles.blueButton : styles.secondaryButton) }}
            onClick={() => setLanguage('fr')}
          >
            Français
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Shield size={14} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Security' : 'Sécurité'}
        </h3>
        <p style={{ fontSize: '13px', color: brand.gray600, marginBottom: '12px' }}>
          {language === 'en' ? 'Session auto-locks after 2 minutes of inactivity. PIN: 1234 (demo).' : 'La session se verrouille automatiquement après 2 minutes d\'inactivité. NIP: 1234 (démo).'}
        </p>
        <button
          style={{ ...styles.button, ...styles.dangerButton }}
          onClick={() => setIsLocked(true)}
        >
          <Icons.Lock size={14} />
          {language === 'en' ? 'Lock Session Now' : 'Verrouiller Maintenant'}
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Chart size={14} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Reset Statistics' : 'Réinitialiser les Statistiques'}
        </h3>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={() => {
            const reset = { totalPatients: 0, totalRecordings: 0, totalHours: 0, sessionsToday: 0, sessionsThisWeek: 0, lastSessionDate: null, dailyLog: [] };
            setUsageStats(reset);
            localStorage.setItem('ams_usage_stats', JSON.stringify(reset));
            addAlert('info', language === 'en' ? 'Statistics reset' : 'Statistiques réinitialisées');
          }}
        >
          <Icons.Trash size={14} />
          {language === 'en' ? 'Reset All Stats' : 'Réinitialiser'}
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // PRIVACY POLICY PAGE
  // ============================================================================
  const renderPrivacy = () => (
    <div>
      <h2 style={styles.stepTitle}>
        {language === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
      </h2>
      <p style={styles.stepDescription}>
        {language === 'en' ? 'How we handle your data' : 'Comment nous traitons vos données'}
      </p>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Shield size={14} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Data Handling' : 'Traitement des Données'}
        </h3>
        <div style={{ fontSize: '13px', color: brand.gray800, lineHeight: '1.7' }}>
          <p style={{ marginBottom: '12px' }}>
            {language === 'en'
              ? 'AMS Transcription Suite processes all data locally in your browser. No patient data is transmitted to external servers.'
              : 'La Suite de Transcription AMS traite toutes les données localement dans votre navigateur. Aucune donnée patient n\'est transmise à des serveurs externes.'}
          </p>
          <p style={{ marginBottom: '12px' }}>
            {language === 'en'
              ? 'Audio recordings, clinical notes, and PDF documents remain on your device until explicitly exported or submitted through approved channels.'
              : 'Les enregistrements audio, les notes cliniques et les documents PDF restent sur votre appareil jusqu\'à ce qu\'ils soient explicitement exportés ou soumis par des canaux approuvés.'}
          </p>
          <p>
            {language === 'en'
              ? 'This application is designed to comply with Quebec privacy regulations (Loi 25) and Canadian healthcare data protection standards.'
              : 'Cette application est conçue pour se conformer aux réglementations québécoises sur la vie privée (Loi 25) et aux normes canadiennes de protection des données de santé.'}
          </p>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Lock size={14} style={{ marginRight: '8px' }} />
          {language === 'en' ? 'Security Measures' : 'Mesures de Sécurité'}
        </h3>
        <div style={{ fontSize: '13px', color: brand.gray800, lineHeight: '1.7' }}>
          <ul style={{ paddingLeft: '18px' }}>
            <li>{language === 'en' ? 'Automatic session lock after 2 minutes of inactivity' : 'Verrouillage automatique de session après 2 minutes d\'inactivité'}</li>
            <li>{language === 'en' ? 'Compliance-based session auto-lock (2 min inactivity)' : 'Verrouillage automatique de conformité (2 min d\'inactivité)'}</li>
            <li>{language === 'en' ? 'Human-in-the-Loop (HITL) approval gates' : 'Portes d\'approbation humaine (HITL)'}</li>
            <li>{language === 'en' ? 'No external API calls with patient data' : 'Aucun appel API externe avec des données patient'}</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // HOW IT WORKS PAGE
  // ============================================================================
  const renderHowItWorks = () => {
    const flowSteps = language === 'en' ? [
      {
        num: '1',
        title: 'Patient Consent',
        icon: Icons.Shield,
        desc: 'Enter patient information (name, ID, date of birth). Click Next to trigger the electronic consent popup — the patient\'s name is pre-filled automatically. The patient checks "I agree" to unlock the workflow.',
        color: brand.blue,
      },
      {
        num: '2',
        title: 'Audio Recording',
        icon: Icons.Mic,
        desc: 'Record the clinical session directly in-browser using the MediaRecorder API, or upload a pre-recorded audio file. The recording captures the full consultation for transcription.',
        color: brand.orange,
      },
      {
        num: '3',
        title: 'Clinical Notes → PDF Population',
        icon: Icons.FileText,
        desc: 'Review and edit transcribed clinical notes. Select a PDF template (e.g., McKenzie Lumbar, Knee Evaluation, Berg Balance). Each form field you fill here directly populates the corresponding field in the PDF template — this is form population, not just data entry.',
        color: brand.blue,
      },
      {
        num: '4',
        title: 'PDF Generation',
        icon: Icons.File,
        desc: 'The system uses pdf-lib to open the selected PDF template and fill every mapped field with the data from Step 3. You can preview the populated PDF, adjust settings (page size, margins), and regenerate as needed.',
        color: brand.orange,
      },
      {
        num: '5',
        title: 'Documentation Bundle',
        icon: Icons.Package,
        desc: 'All artifacts — consent record, audio file, clinical notes, and populated PDF — are bundled together. A Human-in-the-Loop (HITL) approval gate ensures a clinician reviews and approves before final submission.',
        color: brand.blue,
      },
    ] : [
      {
        num: '1',
        title: 'Consentement du Patient',
        icon: Icons.Shield,
        desc: 'Entrez les informations du patient (nom, ID, date de naissance). Cliquez sur Suivant pour déclencher la fenêtre de consentement électronique — le nom du patient est pré-rempli automatiquement. Le patient coche « J\'accepte » pour débloquer le flux.',
        color: brand.blue,
      },
      {
        num: '2',
        title: 'Enregistrement Audio',
        icon: Icons.Mic,
        desc: 'Enregistrez la session clinique directement dans le navigateur via l\'API MediaRecorder, ou téléchargez un fichier audio pré-enregistré.',
        color: brand.orange,
      },
      {
        num: '3',
        title: 'Notes Cliniques → Population PDF',
        icon: Icons.FileText,
        desc: 'Révisez et modifiez les notes cliniques transcrites. Sélectionnez un modèle PDF. Chaque champ que vous remplissez ici remplit directement le champ correspondant dans le modèle PDF — c\'est de la population de formulaire, pas simplement de la saisie de données.',
        color: brand.blue,
      },
      {
        num: '4',
        title: 'Génération PDF',
        icon: Icons.File,
        desc: 'Le système utilise pdf-lib pour ouvrir le modèle PDF sélectionné et remplir chaque champ avec les données de l\'étape 3. Vous pouvez prévisualiser, ajuster et régénérer.',
        color: brand.orange,
      },
      {
        num: '5',
        title: 'Dossier de Documentation',
        icon: Icons.Package,
        desc: 'Tous les éléments — consentement, audio, notes et PDF rempli — sont regroupés. Une porte d\'approbation HITL assure une révision clinicienne avant la soumission finale.',
        color: brand.blue,
      },
    ];

    return (
      <div>
        <h2 style={styles.stepTitle}>
          {language === 'en' ? 'How It Works' : 'Comment ça Marche'}
        </h2>
        <p style={styles.stepDescription}>
          {language === 'en'
            ? 'Complete workflow from patient consent to finalized documentation bundle'
            : 'Flux de travail complet du consentement patient au dossier finalisé'}
        </p>

        {/* Flow diagram */}
        <div style={{ position: 'relative', marginTop: '24px' }}>
          {flowSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={idx} style={{ display: 'flex', marginBottom: idx < flowSteps.length - 1 ? '0' : '0' }}>
                {/* Left column: number + connector line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', flexShrink: 0 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: step.color, color: brand.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: brand.fontHeading, fontWeight: '700', fontSize: '16px',
                    boxShadow: `0 2px 8px ${step.color}40`,
                  }}>
                    {step.num}
                  </div>
                  {idx < flowSteps.length - 1 && (
                    <div style={{
                      width: '2px', flex: 1, minHeight: '24px',
                      background: `linear-gradient(to bottom, ${step.color}, ${flowSteps[idx + 1].color})`,
                    }} />
                  )}
                </div>

                {/* Right column: content card */}
                <div style={{
                  ...styles.section,
                  flex: 1, marginLeft: '16px', marginBottom: idx < flowSteps.length - 1 ? '8px' : '0',
                }}>
                  <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StepIcon size={16} style={{ color: step.color }} />
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: brand.gray700, lineHeight: '1.7' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key concepts */}
        <div style={{ ...styles.section, marginTop: '24px' }}>
          <h3 style={styles.sectionTitle}>
            <Icons.Info size={14} style={{ marginRight: '8px', color: brand.blue }} />
            {language === 'en' ? 'Key Concepts' : 'Concepts Clés'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '12px' }}>
            {[
              {
                title: language === 'en' ? 'PDF Population' : 'Population PDF',
                desc: language === 'en'
                  ? 'Clinical notes and form fields from Step 3 are mapped directly to fields in the PDF template. Each form schema defines pdfField mappings that correspond to the fillable fields in the template.'
                  : 'Les notes cliniques et les champs du formulaire de l\'étape 3 sont directement mappés aux champs du modèle PDF.',
                icon: Icons.FileText,
              },
              {
                title: language === 'en' ? 'HITL Approval' : 'Approbation HITL',
                desc: language === 'en'
                  ? 'Human-in-the-Loop gates ensure a clinician reviews every generated document before it is finalized. No automated submission without human verification.'
                  : 'Les portes HITL garantissent qu\'un clinicien révise chaque document avant finalisation.',
                icon: Icons.CheckCircle,
              },
              {
                title: language === 'en' ? 'Bilingual Support' : 'Support Bilingue',
                desc: language === 'en'
                  ? 'Full EN/FR support throughout the application, including Quebec French medical terminology and compliance with Loi 25.'
                  : 'Support complet EN/FR incluant la terminologie médicale québécoise et la conformité à la Loi 25.',
                icon: Icons.Globe,
              },
              {
                title: language === 'en' ? 'Custom Templates' : 'Modèles Personnalisés',
                desc: language === 'en'
                  ? 'Physiotherapists can upload their own fielded PDF templates via the PDF Manager. Uploaded templates are available to the uploader immediately; global automation requires admin approval.'
                  : 'Les physiothérapeutes peuvent télécharger leurs propres modèles PDF via le Gestionnaire PDF. Disponibles immédiatement pour l\'utilisateur; l\'automatisation globale nécessite l\'approbation admin.',
                icon: Icons.Upload,
              },
            ].map((concept, idx) => {
              const ConceptIcon = concept.icon;
              return (
                <div key={idx} style={{
                  padding: '14px', background: brand.gray50,
                  border: `1px solid ${brand.gray200}`, borderRadius: brand.radius,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ConceptIcon size={14} style={{ color: brand.blue }} />
                    <span style={{ fontFamily: brand.fontHeading, fontWeight: '600', fontSize: '13px', color: brand.gray900 }}>
                      {concept.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: brand.gray600, lineHeight: '1.6' }}>{concept.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER ACTIVE PAGE CONTENT
  // ============================================================================
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard': return renderDashboard();
      case 'pdfManager': return renderPdfManager();
      case 'settings': return renderSettings();
      case 'privacy': return renderPrivacy();
      case 'howItWorks': return renderHowItWorks();
      case 'transcription':
      default:
        return (
          <>
            {renderProgressBar()}
            <div style={styles.content}>
              {renderCurrentStep()}
              <div style={styles.buttonGroup}>
                <button
                  style={{
                    ...styles.button,
                    ...styles.secondaryButton,
                    ...(currentStep === 1 ? styles.disabledButton : {})
                  }}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <Icons.ArrowLeft size={14} />
                  {t('previous')}
                </button>
                {currentStep < 5 ? (
                  <button
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                      ...(!validateStep(currentStep) ? styles.disabledButton : {})
                    }}
                    onClick={nextStep}
                  >
                    {t('next')}
                    <Icons.ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    style={{
                      ...styles.button,
                      ...styles.successButton,
                      ...(bundleData.approvalStatus !== 'approved' ? styles.disabledButton : {})
                    }}
                    disabled={bundleData.approvalStatus !== 'approved'}
                    onClick={() => {
                      setBundleData(prev => ({ ...prev, status: 'submitted' }));
                      addAlert('success', 'Documentation bundle finalized');
                    }}
                  >
                    <Icons.Send size={14} />
                    {t('submitBundle')}
                  </button>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  // ============================================================================
  // SIDEBAR NAVIGATION ITEMS
  // ============================================================================
  const sidebarItems = [
    { id: 'dashboard', icon: Icons.Chart, label: { en: 'Dashboard', fr: 'Tableau de Bord' } },
    { id: 'transcription', icon: Icons.Mic, label: { en: 'Transcription', fr: 'Transcription' } },
    { id: 'pdfManager', icon: Icons.Folder, label: { en: 'PDF Templates', fr: 'Modèles PDF' } },
    { id: 'settings', icon: Icons.Settings, label: { en: 'Settings', fr: 'Paramètres' } },
    { id: 'privacy', icon: Icons.Shield, label: { en: 'Privacy Policy', fr: 'Confidentialité' } },
    { id: 'howItWorks', icon: Icons.Book, label: { en: 'How It Works', fr: 'Comment ça Marche' } },
  ];

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }

          input:focus, textarea:focus, select:focus {
            border-color: ${brand.blue} !important;
            box-shadow: 0 0 0 3px rgba(0, 117, 183, 0.15) !important;
          }

          button:hover:not(:disabled) {
            filter: brightness(1.05);
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          }

          button:active:not(:disabled) {
            filter: brightness(0.97);
          }

          /* Progress step hover */
          .ams-progress-step:hover {
            background: ${brand.gray50};
          }

          /* Upload zone hover */
          .ams-upload-zone:hover {
            background: #dceefb !important;
            border-color: ${brand.blueDark} !important;
          }

          /* List item hover */
          .ams-list-item:hover {
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          }

          /* Custom checkbox accent */
          input[type="checkbox"] {
            accent-color: ${brand.blue};
          }

          /* Audio player styling */
          audio {
            border-radius: 6px;
            background: ${brand.gray50};
          }

          /* Print-friendly */
          @media print {
            body { background: white; }
          }
        `}
      </style>

      {/* ---- TOAST ALERTS ---- */}
      {renderAlerts()}
      {isLocked && renderLockScreen()}
      {showTimeoutWarning && !isLocked && renderTimeoutWarning()}
      {renderTemplateApprovalModal()}
      {renderConsentPopup()}

      {/* ---- TOP NAVIGATION BAR ---- */}
      <nav style={styles.topBar}>
        <div style={styles.topBarInner}>
          <div style={styles.logoArea}>
            <img
              src="/ams-logo.png"
              alt="AMS Centre Médical et de Réadaptation"
              style={{ height: '46px', width: 'auto' }}
            />
            <div style={{
              width: '1px',
              height: '32px',
              background: 'rgba(255,255,255,0.25)',
              marginLeft: '4px',
            }} />
            <span style={{
              fontFamily: brand.fontHeading,
              fontSize: '22px',
              fontWeight: '700',
              color: brand.white,
              letterSpacing: '-0.5px',
            }}>
              Transcription Suite
            </span>
          </div>
          <div style={styles.headerControls}>
            <button
              style={styles.headerBtn}
              onClick={() => setLanguage(lang => lang === 'en' ? 'fr' : 'en')}
              title={language === 'en' ? 'Passer au français' : 'Switch to English'}
            >
              <Icons.Globe size={14} />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
              style={{ ...styles.headerBtn, ...styles.headerBtnDanger }}
              onClick={() => setIsLocked(true)}
              title={language === 'en' ? 'Lock session' : 'Verrouiller la session'}
            >
              <Icons.Lock size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ---- APP BODY: SIDEBAR + CONTENT ---- */}
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 68px)',
      }}>
        {/* ---- LEFT SIDEBAR ---- */}
        <aside style={{
          width: sidebarCollapsed ? '60px' : '220px',
          background: brand.white,
          borderRight: `1px solid ${brand.gray200}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          flexShrink: 0,
          position: 'sticky',
          top: '68px',
          height: 'calc(100vh - 68px)',
          overflow: 'hidden',
        }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarCollapsed(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-end',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: `1px solid ${brand.gray200}`,
              cursor: 'pointer',
              color: brand.gray400,
              transition: 'color 0.15s',
            }}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed
              ? <Icons.ArrowRight size={14} />
              : <Icons.ArrowLeft size={14} />
            }
          </button>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sidebarItems.map(item => {
              const ItemIcon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: sidebarCollapsed ? '10px' : '10px 14px',
                    borderRadius: brand.radius,
                    border: 'none',
                    background: isActive ? brand.blueLight : 'transparent',
                    color: isActive ? brand.blue : brand.gray600,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '500',
                    fontFamily: brand.fontBody,
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    width: '100%',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.label[language]}
                >
                  <ItemIcon size={16} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{item.label[language]}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${brand.gray200}`,
              fontSize: '10px',
              color: brand.gray400,
              lineHeight: '1.4',
            }}>
              AMS v4.0
            </div>
          )}
        </aside>

        {/* ---- MAIN CONTENT AREA ---- */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            maxWidth: '1060px',
            margin: '0 auto',
            padding: '24px 28px 48px',
          }}>
            <div style={{
              ...styles.card,
              ...(activePage !== 'transcription' ? { padding: '0' } : {}),
            }}>
              {activePage !== 'transcription' ? (
                <div style={styles.content}>
                  {renderActivePage()}
                </div>
              ) : (
                renderActivePage()
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
