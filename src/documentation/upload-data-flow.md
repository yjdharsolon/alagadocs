
# Upload Feature Data Flow

This document provides detailed information about the data flow within the Upload feature, explaining how data moves through the components and services.

## Data Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  File Selection ├────►│  Form Submission├────►│  Upload Process │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   useFileHandling    │     │   useUploadForm    │     │   useUploadProcess   │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  File/Recording │     │  Form State     │     │  Upload Services│
│  Components     │     │  Management     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Data Objects

### Audio File
- **Type**: `File` object
- **Origin**: FileUploader component or AudioRecorder component
- **Flow**: 
  ```
  FileUploader/AudioRecorder → 
  useFileHandling.handleFileSelect/handleRecordingComplete → 
  useUploadForm.file state → 
  useUploadProcess.handleSubmit → 
  uploadAudio service
  ```

### Patient Information
- **Type**: `Patient` object
- **Origin**: SessionStorage (from previous patient selection)
- **Flow**:
  ```
  sessionStorage.getItem('selectedPatient') → 
  UploadPageContent.currentPatient → 
  PatientDisplayCard → 
  UploadForm → 
  uploadAudio service (patientId parameter)
  ```

### Upload Progress
- **Type**: Number (percentage) and Step string
- **Origin**: useUploadProgress hook
- **Flow**:
  ```
  useUploadProcess.startProgressTracking → 
  useUploadProgress state updates → 
  useUploadForm → 
  UploadProgress component & SubmitButton
  ```

### Transcription Data
- **Type**: Object with text, audio URL, and metadata
- **Origin**: transcribeAudio service
- **Flow**:
  ```
  transcribeAudio → 
  useUploadProcess → 
  useUploadForm.handleFormSubmit → 
  Navigate to editor with state → 
  sessionStorage ('lastTranscriptionResult')
  ```

## API Requests

### Storage Initialization
```typescript
// Called by UploadPageContent on mount
supabase.functions.invoke('ensure-transcription-bucket')
  .then(({ error }) => {
    // Handle error if needed
  });
```

### Audio Upload
```typescript
// Called by useUploadProcess.handleSubmit
const audioUrl = await uploadAudio(file, patientId);
```

### Audio Transcription
```typescript
// Called by useUploadProcess.handleSubmit after upload
const transcriptionData = await transcribeAudio(audioUrl);
```

## State Management Flow

### Upload State Flow
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

### Error State Flow
```
1. Error occurs during upload:
   - useUploadProcess catches error
   - Error message stored in useUploadForm.error state
   - ErrorAlert component displays the message
   - Upload state is reset

2. Error handling differs by type:
   - Authentication errors → offer logout/login
   - Permission errors → offer fix permissions button
   - Network errors → offer retry
```

## Event Handling

### File Upload Events
```
1. User clicks FileUploader area or drops a file
2. onChange/onDrop handlers call handleFileSelect
3. File is validated and stored in state
4. UI updates to show file details
```

### Recording Events
```
1. User clicks "Record" button
2. startRecording requests microphone access
3. MediaRecorder API starts capturing audio
4. UI updates to show recording state and time
5. User clicks "Stop" to end recording
6. Audio is processed into a File object
7. handleRecordingComplete stores the file
```

### Form Submission Events
```
1. User clicks "Continue to Transcription"
2. handleClick event calls handleFormSubmit
3. Form validation occurs
4. If valid, upload process begins
5. UI shows progress and disables button
6. On completion, navigation to editor occurs
```

## Edge Case Handling

### Session Timeout
```
1. Before upload, verifyAndRefreshSession is called
2. If session is about to expire, token is refreshed
3. If refresh fails, user receives authentication error
4. User can click "Logout and Login Again" to reset session
```

### Upload Failures
```
1. uploadAudio includes retry logic (3 attempts)
2. On persistent failure, error is propagated up
3. Error is displayed to user with appropriate actions
4. Transcription record is still created for recovery
```

### Transcription Failures
```
1. transcribeAudio includes retry logic (5 attempts)
2. On persistent failure, error is propagated up
3. Pending transcription data is stored in sessionStorage
4. User can retry or recover data later
```

## Recovery Mechanisms

### Transcription Recovery
```
1. On successful upload but failed transcription:
   - pendingTranscription object stored in sessionStorage
   - User navigated to editor with pending=true
   - EditTranscript page can attempt to recover transcription

2. On successful transcription:
   - lastTranscriptionResult stored in sessionStorage
   - User can recover from browser crash/navigation
```

## Performance Considerations

### Large File Handling
- File size is validated (max 50MB)
- Progress tracking provides user feedback
- Upload uses chunked upload strategy internally

### Mobile Optimization
- UI is responsive with mobile-specific layouts
- Recording interface is simplified on mobile
- Mobile browser compatibility is checked before recording

### Network Considerations
- Retry mechanisms for unstable connections
- Progress indicators to prevent user abandonment
- Error recovery options for failed uploads
