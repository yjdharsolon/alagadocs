
# Upload Components Reference

This document provides detailed information about each component in the Upload feature, including props, state, and interactions.

## Main Components

### UploadPageContent

**Purpose**: Main container for the upload page.

**Key Props**: None

**Key State**:
- `error`: String | null - Current error message
- `retrying`: Boolean - If currently retrying storage initialization
- `fixingPermissions`: Boolean - If currently fixing permissions
- `currentPatient`: Patient | null - Currently selected patient

**Key Functions**:
- `initializeStorageBucket()`: Ensures storage is ready
- `fixPermissions()`: Calls edge function to fix permissions
- `handleRetry()`: Retries storage initialization
- `changePatient()`: Navigates to patient selection

**Child Components**:
- UploadPageHeader
- PatientDisplayCard
- StoragePermissionAlert
- UploadForm
- ResetPermissionsButton

**Code Example**:
```jsx
<UploadPageContent>
  <UploadPageHeader title="Upload Audio" description="..." />
  {currentPatient && <PatientDisplayCard patient={currentPatient} />}
  <StoragePermissionAlert error={error} onRetry={handleRetry} />
  <UploadForm />
  <ResetPermissionsButton onClick={fixPermissions} />
</UploadPageContent>
```

### UploadForm

**Purpose**: Handles audio input and submission flow.

**Key Props**:
- `onTranscriptionComplete`: Function - Callback when transcription is done

**Key State**:
- `navigating`: Boolean - If currently navigating to next page
- `patientId`: String | null - ID of selected patient
- `patientName`: String | null - Name of selected patient

**Key Functions**:
- `handleSubmit()`: Processes the submission and handles navigation

**Child Components**:
- ErrorAlert
- PatientInfoCard
- FileInputCard
- RecordingCard
- UploadProgress
- SubmitButton

**Code Example**:
```jsx
<UploadForm onTranscriptionComplete={(data, url, id) => {
  // Handle transcription completion
}}>
  <PatientInfoCard patientName={patientName} />
  <FileInputCard file={file} onFileSelect={handleFileSelect} />
  <RecordingCard onRecordingComplete={handleRecordingComplete} />
  <UploadProgress uploadProgress={uploadProgress} />
  <SubmitButton onSubmit={handleSubmit} />
</UploadForm>
```

## File Input Components

### FileInputCard

**Purpose**: Container for file upload functionality.

**Key Props**:
- `file`: File | null - The currently selected file
- `onFileSelect`: Function - Callback when file is selected

**Child Components**:
- FileUploader

**Code Example**:
```jsx
<FileInputCard 
  file={file} 
  onFileSelect={handleFileSelect} 
/>
```

### FileUploader

**Purpose**: UI for file selection via browse or drag-drop.

**Key Props**:
- `file`: File | null - The currently selected file
- `onFileSelect`: Function - Callback when file is selected

**Key State**:
- `isDragging`: Boolean - If file is being dragged over component

**Key Functions**:
- `handleFileChange()`: Processes selected files
- `validateAndProcessFile()`: Validates file type and size
- `handleDrop()`: Handles dropped files

**Code Example**:
```jsx
<FileUploader 
  file={file} 
  onFileSelect={(file) => {
    setFile(file);
    toast.success('File selected');
  }} 
/>
```

## Recording Components

### RecordingCard

**Purpose**: Container for audio recording functionality.

**Key Props**:
- `onRecordingComplete`: Function - Callback when recording is complete
- `isRecording`: Boolean - If currently recording
- `setIsRecording`: Function - Updates recording state
- `isUploading`: Boolean - If currently uploading

**Child Components**:
- AudioRecorder

**Code Example**:
```jsx
<RecordingCard 
  onRecordingComplete={handleRecordingComplete}
  isRecording={isRecording}
  setIsRecording={setIsRecording}
  isUploading={isUploading}
/>
```

### AudioRecorder

**Purpose**: Interface for recording audio in browser.

**Key Props**:
- `onRecordingComplete`: Function - Callback when recording is complete
- `isRecording`: Boolean - If currently recording
- `setIsRecording`: Function - Updates recording state

**Key State**:
- `isPlayingPreview`: Boolean - If audio preview is playing

**Child Components**:
- RecordingControls
- AudioPreview
- RecordingNameDialog

**Uses Hooks**:
- useAudioRecording - Manages recording functionality

**Code Example**:
```jsx
<AudioRecorder
  onRecordingComplete={(file) => {
    setFile(file);
    toast.success('Recording saved');
  }}
  isRecording={isRecording}
  setIsRecording={setIsRecording}
/>
```

### RecordingControls

**Purpose**: UI controls for starting/stopping recording.

**Key Props**:
- `isRecording`: Boolean - If currently recording
- `isPlayingPreview`: Boolean - If audio preview is playing
- `startRecording`: Function - Starts recording
- `stopRecording`: Function - Stops recording

**Code Example**:
```jsx
<RecordingControls
  isRecording={isRecording}
  isPlayingPreview={isPlayingPreview}
  startRecording={startRecording}
  stopRecording={stopRecording}
/>
```

### AudioPreview

**Purpose**: UI for playing and managing recorded audio.

**Key Props**:
- `audioPreviewRef`: React.RefObject - Reference to audio element
- `audioPreview`: String - URL of audio preview
- `isPlayingPreview`: Boolean - If audio is playing
- `togglePlayPreview`: Function - Toggles play/pause
- `resetRecording`: Function - Clears recording
- `recordingTime`: Number - Duration of recording in seconds
- `formatTime`: Function - Formats time for display

**Code Example**:
```jsx
<AudioPreview
  audioPreviewRef={audioPreviewRef}
  audioPreview={audioPreview}
  isPlayingPreview={isPlayingPreview}
  togglePlayPreview={togglePlayPreview}
  resetRecording={resetRecording}
  recordingTime={recordingTime}
  formatTime={formatTime}
/>
```

## Progress and Submission Components

### UploadProgress

**Purpose**: Displays upload and transcription progress.

**Key Props**:
- `uploadProgress`: Number - Current progress percentage
- `currentStep`: String - Current step in the process

**Code Example**:
```jsx
<UploadProgress
  uploadProgress={75}
  currentStep="transcribing"
/>
```

### SubmitButton

**Purpose**: Button to initiate upload and transcription.

**Key Props**:
- `isUploading`: Boolean - If currently uploading
- `isRecording`: Boolean - If currently recording
- `hasFile`: Boolean - If file is selected
- `onSubmit`: Function - Callback when button is clicked
- `getStepLabel`: Function - Gets current step label

**Key Functions**:
- `handleClick()`: Handles click with event prevention

**Code Example**:
```jsx
<SubmitButton
  isUploading={isUploading}
  isRecording={isRecording}
  hasFile={!!file}
  onSubmit={handleSubmit}
  getStepLabel={getStepLabel}
/>
```

## Alert and Info Components

### StoragePermissionAlert

**Purpose**: Displays storage-related errors.

**Key Props**:
- `error`: String | null - Current error message
- `onRetry`: Function - Retries storage initialization
- `onFixPermissions`: Function - Attempts to fix permissions
- `retrying`: Boolean - If currently retrying
- `fixingPermissions`: Boolean - If fixing permissions

**Code Example**:
```jsx
<StoragePermissionAlert 
  error={error}
  onRetry={handleRetry}
  onFixPermissions={fixPermissions}
  retrying={retrying}
  fixingPermissions={fixingPermissions}
/>
```

### ErrorAlert

**Purpose**: Displays general errors with appropriate actions.

**Key Props**:
- `error`: String - Error message
- `onLogoutAndLogin`: Function - Handles logout and login

**Code Example**:
```jsx
<ErrorAlert 
  error="Authentication error occurred"
  onLogoutAndLogin={handleLogoutAndLogin}
/>
```

### PatientInfoCard

**Purpose**: Displays current patient information.

**Key Props**:
- `patientName`: String | undefined - Patient name
- `patientId`: String | null | undefined - Patient ID

**Code Example**:
```jsx
<PatientInfoCard 
  patientName="John Doe"
  patientId="P123456"
/>
```

### PatientDisplayCard

**Purpose**: Displays patient with change option.

**Key Props**:
- `patient`: Patient - Patient object
- `onChangePatient`: Function - Handles patient change

**Code Example**:
```jsx
<PatientDisplayCard 
  patient={currentPatient}
  onChangePatient={changePatient}
/>
```

## Core Hooks

### useUploadForm

**Purpose**: Orchestrates the upload process.

**Parameters**:
- `patientId`: String | undefined - Optional patient ID

**Returns**:
- `file`: File | null - Selected audio file
- `isUploading`: Boolean - If upload in progress
- `isRecording`: Boolean - If recording in progress
- `uploadProgress`: Number - Upload progress percentage
- `error`: String | null - Current error message
- `handleFileSelect`: Function - Handles file selection
- `handleRecordingComplete`: Function - Handles recording completion
- `handleSubmit`: Function - Processes form submission
- And more state/handlers

**Example Usage**:
```jsx
const {
  file,
  isUploading,
  handleFileSelect,
  handleSubmit
} = useUploadForm(patientId);
```

### useFileHandling

**Purpose**: Manages file selection and recording.

**Returns**:
- `file`: File | null - Current audio file
- `isRecording`: Boolean - If recording in progress
- `setIsRecording`: Function - Updates recording state
- `handleFileSelect`: Function - Processes file selection
- `handleRecordingComplete`: Function - Processes recording completion

**Example Usage**:
```jsx
const {
  file,
  isRecording,
  handleFileSelect
} = useFileHandling();
```

### useUploadProcess

**Purpose**: Manages upload and transcription process.

**Parameters**:
- `setError`: Function - Error handler function

**Returns**:
- `isUploading`: Boolean - If upload in progress
- `uploadProgress`: Number - Upload progress percentage
- `currentStep`: String - Current process step
- `handleSubmit`: Function - Processes upload and transcription
- `getStepLabel`: Function - Gets human-readable step label

**Example Usage**:
```jsx
const {
  isUploading,
  uploadProgress,
  handleSubmit
} = useUploadProcess(setError);
```

### useAudioRecording

**Purpose**: Manages audio recording functionality.

**Parameters**:
- `onRecordingComplete`: Function - Callback for completed recording
- `isRecording`: Boolean - Recording state
- `setIsRecording`: Function - Updates recording state
- `setIsPlayingPreview`: Function - Updates playback state

**Returns**:
- `startRecording`: Function - Initiates recording
- `stopRecording`: Function - Stops recording
- `audioPreview`: String | null - Preview URL
- `recordingTime`: Number - Recording duration
- And more state/handlers

**Example Usage**:
```jsx
const {
  startRecording,
  stopRecording,
  audioPreview
} = useAudioRecording({
  onRecordingComplete,
  isRecording,
  setIsRecording,
  setIsPlayingPreview
});
```
