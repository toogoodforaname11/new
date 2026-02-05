import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ============================================================================
// AMS TRANSCRIPTION SUITE v4.0
// Complete React application with:
// - pdf-lib integration (NOT PyPDF)
// - Bilingual EN/FR support
// - Security gates & auto-lock
// - 5-step workflow (consent → record → notes → PDF → bundle)
// - 3 built-in form schemas (expandable to 14)
// - HITL (Human-in-the-Loop) approval gates
// ============================================================================

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
    step3: 'Notes',
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
    notesTitle: 'Clinical Notes',
    notesDescription: 'Review and edit transcribed notes',
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
    enterPin: 'Enter PIN to unlock',
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
    step3: 'Notes',
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
    notesTitle: 'Notes Cliniques',
    notesDescription: 'Réviser et modifier les notes transcrites',
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
    enterPin: 'Entrez le NIP pour déverrouiller',
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
    pdfTemplate: '/forms/mckenzie-lumbar.pdf',
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
    pdfTemplate: '/forms/mckenzie-cervical.pdf',
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
    pdfTemplate: '/forms/mckenzie-thoracic.pdf',
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
    pdfTemplate: '/forms/mckenzie-upper-extremity.pdf',
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
    pdfTemplate: '/forms/mckenzie-lower-extremity.pdf',
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
    pdfTemplate: '/forms/hip-assessment.pdf',
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
    pdfTemplate: '/forms/knee-assessment.pdf',
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
    pdfTemplate: '/forms/shoulder-assessment.pdf',
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
    pdfTemplate: '/forms/ankle-assessment.pdf',
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
    pdfTemplate: '/forms/wrist-assessment.pdf',
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
    pdfTemplate: '/forms/berg-balance.pdf',
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
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: '1200px',
    margin: '0 auto',
    overflow: 'hidden'
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.8,
    marginTop: '4px'
  },
  headerControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  langToggle: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 32px',
    background: '#f8f9fa',
    borderBottom: '1px solid #e9ecef'
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  progressCircle: (active, completed) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: completed ? '#28a745' : active ? '#667eea' : '#dee2e6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: active ? '0 0 0 4px rgba(102, 126, 234, 0.3)' : 'none'
  }),
  progressLabel: (active) => ({
    marginTop: '8px',
    fontSize: '12px',
    fontWeight: active ? '600' : '400',
    color: active ? '#667eea' : '#6c757d'
  }),
  content: {
    padding: '32px'
  },
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px'
  },
  stepDescription: {
    fontSize: '16px',
    color: '#6c757d',
    marginBottom: '32px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  inputFocus: {
    borderColor: '#667eea'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '120px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: 'white',
    cursor: 'pointer'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
  },
  checkboxInput: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  button: {
    padding: '14px 28px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  secondaryButton: {
    background: '#f8f9fa',
    color: '#333',
    border: '2px solid #e9ecef'
  },
  successButton: {
    background: '#28a745',
    color: 'white'
  },
  dangerButton: {
    background: '#dc3545',
    color: 'white'
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    marginTop: '32px',
    flexWrap: 'wrap'
  },
  alert: (type) => ({
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#cce5ff',
    color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#004085',
    border: `1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeeba' : '#b8daff'}`
  }),
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1a1a2e'
  },
  section: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e9ecef'
  },
  badge: (type) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : type === 'error' ? '#f8d7da' : '#e9ecef',
    color: type === 'success' ? '#155724' : type === 'warning' ? '#856404' : type === 'error' ? '#721c24' : '#333'
  }),
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: '#fff5f5',
    borderRadius: '12px',
    border: '2px solid #fc8181'
  },
  recordingDot: {
    width: '12px',
    height: '12px',
    background: '#e53e3e',
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite'
  },
  approvalCard: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    border: '2px solid #f59e0b'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #e9ecef'
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function AMSTranscriptionSuite() {
  // State management
  const [language, setLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(60);
  const [pin, setPin] = useState('');
  const [selectedForm, setSelectedForm] = useState('general');

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

    // Show warning at 4 minutes
    inactivityTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      setTimeoutSeconds(60);

      // Start countdown
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

      // Auto-lock at 5 minutes
      setTimeout(() => {
        clearInterval(countdownInterval);
      }, 60000);
    }, 240000); // 4 minutes
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
    if (pin === '1234') { // Demo PIN
      setIsLocked(false);
      setPin('');
      resetInactivityTimer();
      addAlert('success', 'Session unlocked');
    } else {
      addAlert('error', 'Invalid PIN');
    }
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
  const fillPdfFormFields = async (pdfDoc, schema, formData) => {
    try {
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      // Log available fields for debugging
      console.log('Available PDF fields:', fields.map(f => f.getName()));

      // Iterate through schema sections and fields
      schema.sections.forEach(section => {
        section.fields.forEach(fieldDef => {
          const value = formData[fieldDef.id];
          if (value === undefined || value === null || value === '') return;

          const pdfFieldName = fieldDef.pdfField;
          if (!pdfFieldName) return;

          try {
            // Handle different field types
            if (fieldDef.type === 'checkbox') {
              const checkBox = form.getCheckBox(pdfFieldName);
              if (value === true || value === 'true' || value === 'on') {
                checkBox.check();
              } else {
                checkBox.uncheck();
              }
            } else if (fieldDef.type === 'select') {
              // Try dropdown first, fall back to text field
              try {
                const dropdown = form.getDropdown(pdfFieldName);
                dropdown.select(value);
              } catch {
                const textField = form.getTextField(pdfFieldName);
                textField.setText(String(value));
              }
            } else {
              // Text, textarea, date, number - all go to text fields
              const textField = form.getTextField(pdfFieldName);
              textField.setText(String(value));
            }
          } catch (fieldError) {
            console.warn(`Could not fill field "${pdfFieldName}":`, fieldError.message);
          }
        });
      });

      // Add patient info from consent
      const patientFields = {
        'Patient Name': consentData.patientName,
        'Date of Birth': consentData.dateOfBirth,
        'Patient ID': consentData.patientId,
        'Visit Date': new Date().toISOString().split('T')[0]
      };

      Object.entries(patientFields).forEach(([fieldName, value]) => {
        if (!value) return;
        try {
          const textField = form.getTextField(fieldName);
          textField.setText(String(value));
        } catch {
          // Field doesn't exist, skip
        }
      });

      // Flatten form to make fields non-editable (optional)
      // form.flatten();

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

          page.drawText('⚠️ PROTOTYPE - NOT FOR PRODUCTION USE', {
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
            <span>⚠️</span>
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
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>
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
              <div style={{ color: '#dc3545' }}>
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
                  <span style={{ color: '#667eea' }}>{field.type}</span>: {field.name}
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
               consentData.patientId &&
               consentData.consentObtained;
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
          {alert.type === 'success' && '✓'}
          {alert.type === 'error' && '✕'}
          {alert.type === 'warning' && '⚠'}
          {alert.type === 'info' && 'ℹ'}
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );

  const renderProgressBar = () => (
    <div style={styles.progressBar}>
      {[1, 2, 3, 4, 5].map(step => (
        <div key={step} style={styles.progressStep}>
          <div style={styles.progressCircle(currentStep === step, currentStep > step)}>
            {currentStep > step ? '✓' : step}
          </div>
          <span style={styles.progressLabel(currentStep === step)}>
            {t(`step${step}`)}
          </span>
        </div>
      ))}
    </div>
  );

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
            {t('patientName')} <span style={{ color: '#dc3545' }}>*</span>
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
            {t('patientId')} <span style={{ color: '#dc3545' }}>*</span>
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
          <label style={styles.label}>{t('consentType')}</label>
          <select
            style={styles.select}
            value={consentData.consentType}
            onChange={(e) => setConsentData(prev => ({ ...prev, consentType: e.target.value }))}
          >
            <option value="verbal">{t('verbalConsent')}</option>
            <option value="written">{t('writtenConsent')}</option>
            <option value="electronic">{t('electronicConsent')}</option>
          </select>
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

      <div style={{ ...styles.section, marginTop: '24px' }}>
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            style={styles.checkboxInput}
            checked={consentData.consentObtained}
            onChange={(e) => setConsentData(prev => ({
              ...prev,
              consentObtained: e.target.checked,
              timestamp: e.target.checked ? new Date().toISOString() : null
            }))}
          />
          <span style={{ fontWeight: '600' }}>
            {t('consentObtained')} <span style={{ color: '#dc3545' }}>*</span>
          </span>
        </label>
        {consentData.timestamp && (
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
            Recorded: {new Date(consentData.timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2Recording = () => (
    <div>
      <h2 style={styles.stepTitle}>{t('recordingTitle')}</h2>
      <p style={styles.stepDescription}>{t('recordingDescription')}</p>

      {recordingData.isRecording && (
        <div style={styles.recordingIndicator}>
          <div style={styles.recordingDot} />
          <span style={{ fontWeight: '600', color: '#e53e3e' }}>
            Recording... {formatDuration(recordingData.duration)}
          </span>
          {recordingData.isPaused && <span style={styles.badge('warning')}>Paused</span>}
        </div>
      )}

      <div style={{ ...styles.section, marginTop: '24px' }}>
        <h3 style={styles.sectionTitle}>{t('recordingTitle')}</h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {!recordingData.isRecording ? (
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={startRecording}
            >
              {t('startRecording')}
            </button>
          ) : (
            <>
              <button
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={stopRecording}
              >
                {t('stopRecording')}
              </button>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={pauseRecording}
              >
                {recordingData.isPaused ? t('resumeRecording') : t('pauseRecording')}
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={styles.label}>{t('uploadAudio')}</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            style={{ ...styles.input, padding: '10px' }}
          />
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
                    {field.required && <span style={{ color: '#dc3545' }}> *</span>}
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

      {/* Upload Custom PDF Template Section */}
      <div style={{ ...styles.section, background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px dashed #667eea' }}>
        <h3 style={styles.sectionTitle}>
          {language === 'en' ? 'Upload Custom PDF Template' : 'Télécharger un Modèle PDF Personnalisé'}
        </h3>
        <p style={{ fontSize: '14px', color: '#4c51bf', marginBottom: '16px' }}>
          {language === 'en'
            ? 'Upload a fillable PDF form. AI will auto-detect the form type and extract fields. Requires your approval before use.'
            : 'Téléchargez un formulaire PDF remplissable. L\'IA détectera automatiquement le type et extraira les champs. Nécessite votre approbation.'
          }
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ ...styles.button, ...styles.primaryButton, cursor: 'pointer' }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleTemplateUpload}
              style={{ display: 'none' }}
            />
            {language === 'en' ? 'Choose PDF Template' : 'Choisir un Modèle PDF'}
          </label>

          {pendingTemplates.filter(t => t.status === 'pending_approval').length > 0 && (
            <span style={styles.badge('warning')}>
              {pendingTemplates.filter(t => t.status === 'pending_approval').length} pending approval
            </span>
          )}
        </div>

        {/* Show loaded templates */}
        {Object.keys(pdfTemplates).length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <strong style={{ fontSize: '14px' }}>
              {language === 'en' ? 'Loaded Templates:' : 'Modèles Chargés:'}
            </strong>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {Object.entries(pdfTemplates).map(([formId, template]) => (
                <span key={formId} style={{ ...styles.badge('success'), fontSize: '11px' }}>
                  {formSchemas[formId]?.name[language] || formId}: {template.fields.length} fields
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Settings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('pdfSettings')}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            <span>{t('includeHeader')}</span>
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
            <span>{t('includeFooter')}</span>
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
            <span>{t('includeSignature')}</span>
          </label>
        </div>
      </div>

      {/* Selected Form Info */}
      <div style={{ ...styles.alert('info'), marginTop: '16px' }}>
        <strong>{language === 'en' ? 'Selected Form:' : 'Formulaire Sélectionné:'}</strong>{' '}
        {formSchemas[selectedForm]?.name[language] || selectedForm}
        {pdfTemplates[selectedForm] && (
          <span style={{ marginLeft: '12px', ...styles.badge('success') }}>
            Template loaded ({pdfTemplates[selectedForm].fields.length} fields)
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={generatePDF}
        >
          {pdfTemplates[selectedForm]
            ? (language === 'en' ? 'Fill PDF Template' : 'Remplir le Modèle PDF')
            : t('generatePdf')
          }
        </button>

        {pdfData.generated && (
          <>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => window.open(pdfData.pdfUrl, '_blank')}
            >
              {t('previewPdf')}
            </button>

            <button
              style={{ ...styles.button, ...styles.successButton }}
              onClick={downloadPDF}
            >
              {t('downloadPdf')}
            </button>
          </>
        )}
      </div>

      {pdfData.generated && (
        <div style={{ ...styles.alert('success'), marginTop: '24px' }}>
          {pdfTemplates[selectedForm]
            ? (language === 'en' ? '✓ PDF form fields filled successfully' : '✓ Champs du formulaire PDF remplis avec succès')
            : '✓ PDF generated successfully and ready for download'
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
          <span>⚠</span> {t('approvalRequired')}
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
          ✓ Bundle submitted at {new Date(bundleData.submittedAt).toLocaleString()}
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
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>{t('locked')}</h2>
        <p style={{ marginBottom: '20px', color: '#6c757d' }}>{t('enterPin')}</p>

        <input
          type="password"
          style={styles.input}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN (demo: 1234)"
          maxLength={4}
          onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
        />

        <button
          style={{ ...styles.button, ...styles.primaryButton, width: '100%', marginTop: '16px' }}
          onClick={handleUnlock}
        >
          {t('unlock')}
        </button>
      </div>
    </div>
  );

  const renderTimeoutWarning = () => (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>{t('sessionTimeout')}</h2>
        <p style={{ marginBottom: '20px', color: '#6c757d' }}>
          {t('sessionExpiring')} <strong>{timeoutSeconds}</strong> seconds
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{ ...styles.button, ...styles.primaryButton, flex: 1 }}
            onClick={extendSession}
          >
            {t('extendSession')}
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton, flex: 1 }}
            onClick={() => setIsLocked(true)}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );

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
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }

          button:active:not(:disabled) {
            transform: translateY(0);
          }
        `}
      </style>

      {renderAlerts()}
      {isLocked && renderLockScreen()}
      {showTimeoutWarning && !isLocked && renderTimeoutWarning()}
      {renderTemplateApprovalModal()}

      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>{t('appTitle')}</h1>
            <p style={styles.subtitle}>{t('subtitle')}</p>
          </div>
          <div style={styles.headerControls}>
            <button
              style={styles.langToggle}
              onClick={() => setLanguage(lang => lang === 'en' ? 'fr' : 'en')}
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
              style={{ ...styles.langToggle, background: 'rgba(220, 53, 69, 0.2)', borderColor: 'rgba(220, 53, 69, 0.4)' }}
              onClick={() => setIsLocked(true)}
            >
              Lock
            </button>
          </div>
        </header>

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
                {t('submitBundle')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
