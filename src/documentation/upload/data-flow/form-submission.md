
# Form Submission Data Flow

This document details the form submission process in the Upload feature.

## Submission Flow

```
User clicks Submit ──► SubmitButton.handleClick ──► FormSubmitHandler.handleFormSubmit
       │                                                       │
       │                                                       ▼
       │                                   ┌─────► If text input: show preview
       │                                   │                    │
       │                                   │                    ▼
       └───────────────────────────────────┘       TextPreviewModal
                                                            │
                                                            ▼
                                                  User confirms ──► Continue submission
                                                            │
                                                            ▼
                                           If audio: processUpload() ──► useUploadProcess.handleSubmit
                                                            │
                                                            ▼
                                            Store results in sessionStorage
                                                            │
                                                            ▼
                                            Navigate to edit-transcript page
```

## State Management During Submission

```
1. Initial state: 
   {
     isUploading: false,
     uploadProgress: 0,
     currentStep: 'idle'
   }

2. On submission:
   {
     isUploading: true,
     uploadProgress: 5,
     currentStep: 'verifying'
   }

3. During upload:
   {
     isUploading: true,
     uploadProgress: 10-75,
     currentStep: 'uploading'
   }

4. During transcription:
   {
     isUploading: true,
     uploadProgress: 80-99,
     currentStep: 'transcribing'
   }

5. On completion:
   {
     isUploading: false,
     uploadProgress: 100,
     currentStep: 'idle'
   }
```

## Direct Text vs. Audio Processing

The FormSubmitHandler component handles two distinct paths:

### Direct Text Path

```typescript
if (directInput.trim() !== '' && inputMethod === 'text') {
  const directInputResult = {
    transcriptionData: {
      text: directInput,
      duration: null
    },
    audioUrl: '',
    transcriptionId: `direct-${Date.now()}`,
    patientId: patientId || null,
    patientName: patientName || null
  };
  
  sessionStorage.setItem('lastTranscriptionResult', JSON.stringify(directInputResult));
  
  navigate('/edit-transcript', {
    state: directInputResult
  });
  return;
}
```

### Audio Path

```typescript
const result = await processUpload();

if (result && result.transcriptionData) {
  sessionStorage.setItem('lastTranscriptionResult', JSON.stringify({
    transcriptionData: result.transcriptionData,
    audioUrl: result.audioUrl || '',
    transcriptionId: result.transcriptionId || '',
    patientId: patientId || null,
    patientName: patientName || null
  }));
  
  navigate('/edit-transcript', {
    state: {
      transcriptionData: result.transcriptionData,
      audioUrl: result.audioUrl || '',
      transcriptionId: result.transcriptionId || '',
      patientId: patientId || null,
      patientName: patientName || null
    }
  });
}
```

## Text Preview Functionality

For direct text input, a preview is shown before submission:

```typescript
if (directInput.trim() !== '' && inputMethod === 'text') {
  if (!showPreview) {
    setShowPreview(true);
    return;
  }
}
```

The TextPreviewModal component then allows the user to:
- Review their input
- Make changes (by closing the modal)
- Continue with submission
