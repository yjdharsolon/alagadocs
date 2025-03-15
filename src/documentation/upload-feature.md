
# Upload Feature Documentation

## Overview

The Upload feature enables users to upload or record audio files for transcription within the AlagaDocs application. This document provides a comprehensive overview of the component architecture, data flow, and interactions within the upload feature.

## Component Hierarchy

```
UploadPageContent
├── UploadPageHeader
├── PatientDisplayCard
├── StoragePermissionAlert
├── UploadForm
│   ├── PatientInfoCard
│   ├── FileInputCard
│   │   └── FileUploader
│   ├── RecordingCard
│   │   └── AudioRecorder
│   │       ├── RecordingControls
│   │       ├── AudioPreview
│   │       └── RecordingNameDialog
│   ├── UploadProgress
│   └── SubmitButton
└── ResetPermissionsButton
```

## Key Components

### UploadPageContent
- **Purpose**: Container component for the entire upload page
- **Responsibilities**: 
  - Initializes storage bucket
  - Manages permissions and errors
  - Retrieves and displays current patient information
- **Key State**: 
  - `error`: Stores error messages related to storage or permissions
  - `currentPatient`: Stores the currently selected patient information

### UploadForm
- **Purpose**: Handles the audio file input, recording, and submission
- **Responsibilities**: 
  - Manages audio file selection/recording
  - Validates and submits audio for transcription
  - Displays progress during upload and transcription
- **Key State**:
  - `file`: The selected or recorded audio file
  - `isUploading`: Indicates if an upload is in progress
  - `isRecording`: Indicates if recording is active
  - `uploadProgress`: The percentage of upload/transcription completion

### FileInputCard & FileUploader
- **Purpose**: Provides UI for selecting audio files
- **Responsibilities**:
  - Handles file selection via browse or drag-and-drop
  - Validates file type and size
  - Displays selected file information

### RecordingCard & AudioRecorder
- **Purpose**: Provides UI for recording audio directly in the browser
- **Responsibilities**:
  - Manages microphone access and recording state
  - Processes and formats recorded audio
  - Provides playback controls for reviewing recordings

### SubmitButton
- **Purpose**: Initiates the upload and transcription process
- **Responsibilities**:
  - Validates form state before submission
  - Prevents duplicate submissions
  - Shows current processing step during upload

## Data Flow

1. **Patient Selection**:
   - User selects a patient on the Select Patient page
   - Patient data is stored in sessionStorage
   - UploadPageContent/UploadForm retrieves and displays patient info

2. **Audio Source Selection**:
   - User either uploads a file via FileUploader or records via AudioRecorder
   - File data is stored in the `file` state in useFileHandling hook

3. **Upload & Transcription Process**:
   ```
   User clicks "Submit" → 
   useUploadForm.handleFormSubmit → 
   useUploadProcess.handleSubmit → 
   uploadAudio service → 
   transcribeAudio service → 
   Navigate to transcription editing
   ```

4. **Progress Tracking**:
   - useUploadProgress hook manages the upload stages (verifying, uploading, transcribing)
   - Progress percentage and step labels are updated throughout the process
   - UI components reflect current status to user

## Key Hooks

### useUploadForm
- **Purpose**: Orchestrates the entire upload workflow
- **Dependencies**: useFileHandling, useUploadProgress, useUploadAuth, useUploadProcess
- **Key Functions**:
  - `handleFormSubmit`: Coordinates the upload process and handles navigation
  - `changePatient`: Allows user to select a different patient

### useFileHandling
- **Purpose**: Manages file selection and recording processes
- **Key Functions**:
  - `handleFileSelect`: Processes and validates selected files
  - `handleRecordingComplete`: Processes completed recordings

### useUploadProcess
- **Purpose**: Handles the actual upload and transcription logic
- **Key Functions**:
  - `handleSubmit`: Executes the upload to storage and transcription via API
  - `getStepLabel`: Provides human-readable progress information

### useAudioRecording
- **Purpose**: Manages browser audio recording functionality
- **Key Functions**:
  - `startRecording`: Initializes microphone access and recording
  - `stopRecording`: Finalizes recording and processes audio data

## Error Handling

1. **Authentication Errors**:
   - useUploadAuth detects authentication issues
   - ErrorAlert component displays auth errors with login/logout options

2. **Permission Errors**:
   - StoragePermissionAlert displays storage bucket permission issues
   - ResetPermissionsButton allows users to fix permission problems

3. **Recording/Upload Errors**:
   - Audio recording errors are handled in useAudioRecording
   - Upload/transcription errors are managed in useUploadProcess
   - All errors are displayed to users with appropriate recovery options

## State Management

The upload feature uses React's useState and useCallback hooks for local state management:

1. **File State**: 
   - Managed by useFileHandling
   - Stores the current audio file and recording status

2. **Upload State**: 
   - Managed by useUploadProcess
   - Tracks upload progress, current step, and error conditions

3. **Authentication State**: 
   - Managed by useUploadAuth
   - Tracks session validity and authentication errors

## API Services

### uploadAudio
- **Purpose**: Uploads audio file to Supabase storage
- **Process**:
  1. Verifies user session
  2. Creates unique filename
  3. Creates initial transcription record in database
  4. Uploads file to storage bucket
  5. Returns public URL for transcription

### transcribeAudio
- **Purpose**: Processes audio through OpenAI Whisper API
- **Process**:
  1. Sends audio URL to serverless function
  2. Transcribes audio to text
  3. Updates transcription record with results
  4. Returns transcription text and metadata

## User Flow

1. User navigates to upload page (with patient already selected)
2. User either:
   - Uploads an audio file by browsing or drag-and-drop
   - Records audio directly in the browser
3. User reviews and confirms the audio selection
4. User clicks "Continue to Transcription"
5. System uploads the audio, displays progress
6. System transcribes the audio, continuing to display progress
7. Upon completion, user is navigated to the transcription editor

## Edge Cases

1. **Authentication Timeout**: 
   - Session is verified before upload
   - Token refresh is attempted if needed
   - User is prompted to re-login if session cannot be refreshed

2. **Browser Compatibility**: 
   - Audio recording checks for browser support
   - Fallback to file upload if recording is not supported

3. **Large Files**: 
   - Files are validated for size (max 50MB)
   - Progress tracking provides feedback for large uploads

4. **Network Issues**: 
   - Retry logic is implemented for failed uploads
   - Transcription process includes multiple retry attempts

## Future Enhancements

1. **Batch Uploads**: Allow multiple files to be uploaded and processed in sequence
2. **Enhanced Recording Settings**: Provide audio quality and format options
3. **Mobile Optimization**: Improve recording experience on mobile devices
4. **Real-time Transcription**: Begin transcription while upload is still in progress
