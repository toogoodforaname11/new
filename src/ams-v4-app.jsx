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
// FORM SCHEMAS - 3 Built-in (expandable to 14)
// ============================================================================
const formSchemas = {
  general: {
    id: 'general',
    name: { en: 'General Assessment', fr: 'Évaluation Générale' },
    sections: [
      {
        title: { en: 'Chief Complaint', fr: 'Plainte Principale' },
        fields: [
          { id: 'chiefComplaint', type: 'textarea', required: true },
          { id: 'duration', type: 'text', required: true },
          { id: 'severity', type: 'select', options: ['mild', 'moderate', 'severe'], required: true }
        ]
      },
      {
        title: { en: 'History', fr: 'Historique' },
        fields: [
          { id: 'presentIllness', type: 'textarea', required: true },
          { id: 'pastMedical', type: 'textarea', required: false },
          { id: 'medications', type: 'textarea', required: false },
          { id: 'allergies', type: 'text', required: true }
        ]
      },
      {
        title: { en: 'Assessment', fr: 'Évaluation' },
        fields: [
          { id: 'vitalSigns', type: 'textarea', required: true },
          { id: 'physicalExam', type: 'textarea', required: true },
          { id: 'diagnosis', type: 'textarea', required: true },
          { id: 'plan', type: 'textarea', required: true }
        ]
      }
    ]
  },
  progress: {
    id: 'progress',
    name: { en: 'Progress Notes', fr: 'Notes d\'Évolution' },
    sections: [
      {
        title: { en: 'Subjective', fr: 'Subjectif' },
        fields: [
          { id: 'subjective', type: 'textarea', required: true },
          { id: 'painLevel', type: 'number', min: 0, max: 10, required: false }
        ]
      },
      {
        title: { en: 'Objective', fr: 'Objectif' },
        fields: [
          { id: 'vitalSigns', type: 'textarea', required: true },
          { id: 'physicalFindings', type: 'textarea', required: true }
        ]
      },
      {
        title: { en: 'Assessment & Plan', fr: 'Évaluation et Plan' },
        fields: [
          { id: 'assessment', type: 'textarea', required: true },
          { id: 'plan', type: 'textarea', required: true },
          { id: 'followUp', type: 'text', required: false }
        ]
      }
    ]
  },
  discharge: {
    id: 'discharge',
    name: { en: 'Discharge Summary', fr: 'Résumé de Sortie' },
    sections: [
      {
        title: { en: 'Admission Information', fr: 'Information d\'Admission' },
        fields: [
          { id: 'admissionDate', type: 'date', required: true },
          { id: 'dischargeDate', type: 'date', required: true },
          { id: 'admissionDiagnosis', type: 'textarea', required: true }
        ]
      },
      {
        title: { en: 'Hospital Course', fr: 'Évolution Hospitalière' },
        fields: [
          { id: 'hospitalCourse', type: 'textarea', required: true },
          { id: 'procedures', type: 'textarea', required: false },
          { id: 'complications', type: 'textarea', required: false }
        ]
      },
      {
        title: { en: 'Discharge Plan', fr: 'Plan de Sortie' },
        fields: [
          { id: 'dischargeDiagnosis', type: 'textarea', required: true },
          { id: 'medications', type: 'textarea', required: true },
          { id: 'instructions', type: 'textarea', required: true },
          { id: 'followUp', type: 'textarea', required: true }
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
  // PDF GENERATION (using pdf-lib)
  // ============================================================================
  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
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

        page.drawText('Medical Documentation Report', {
          x: margin,
          y: yPosition,
          size: 12,
          font,
          color: rgb(0.4, 0.4, 0.4)
        });
        yPosition -= 40;

        // Horizontal line
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

      // Clinical Notes Section
      page.drawText('CLINICAL NOTES', {
        x: margin,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.4)
      });
      yPosition -= 25;

      // Transcription content
      if (notesData.transcription) {
        const transcriptionLines = notesData.transcription.split('\n');
        transcriptionLines.forEach(line => {
          if (yPosition < 100) {
            // Add new page if needed
            const newPage = pdfDoc.addPage([612, 792]);
            yPosition = height - 50;
          }

          // Word wrap for long lines
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

          if (currentLine) {
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

      // Form Data
      yPosition -= 20;
      const schema = formSchemas[selectedForm];
      if (schema && Object.keys(notesData.formData).length > 0) {
        page.drawText(`FORM: ${schema.name[language].toUpperCase()}`, {
          x: margin,
          y: yPosition,
          size: 14,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.4)
        });
        yPosition -= 25;

        Object.entries(notesData.formData).forEach(([key, value]) => {
          if (value && yPosition > 100) {
            page.drawText(`${key}: ${value}`, {
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

        page.drawText('AMS Transcription Suite v4.0', {
          x: width - margin - 150,
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

        page.drawText('Signature', {
          x: margin,
          y: 105,
          size: 10,
          font,
          color: rgb(0.3, 0.3, 0.3)
        });

        page.drawLine({
          start: { x: width - margin - 200, y: 120 },
          end: { x: width - margin, y: 120 },
          thickness: 1,
          color: rgb(0, 0, 0)
        });

        page.drawText('Date', {
          x: width - margin - 200,
          y: 105,
          size: 10,
          font,
          color: rgb(0.3, 0.3, 0.3)
        });
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

      addAlert('success', 'PDF generated successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      addAlert('error', 'Failed to generate PDF');
    }
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

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={generatePDF}
        >
          {t('generatePdf')}
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
          ✓ PDF generated successfully and ready for download
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
