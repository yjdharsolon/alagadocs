
# File Handling Data Flow

This document details how files are selected, validated, and processed in the Upload feature.

## File Selection Flow

```
User selects file ──► FileUploader.handleFileChange ──► validateAndProcessFile
                                                          │
                                                          ▼
                      ┌────────────────────── onFileSelect (prop) ◄───┐
                      │                                               │
                      ▼                                               │
useFileHandling.handleFileSelect ──► Update file state ──► UploadForm
```

## Recording Flow

```
User starts recording ──► AudioRecorder.startRecording ──► MediaRecorder API
                                                             │
User stops recording ──► AudioRecorder.stopRecording ────────┘
                                │
                                ▼
                      Process audio into File
                                │
                                ▼
            onRecordingComplete (prop) ──► useFileHandling.handleRecordingComplete
                                                     │
                                                     ▼
                                              Update file state ──► UploadForm
```

## Direct Text Input Flow

```
User types text ──► DirectInputCard.onChange ──► setDirectInput ──► UploadForm
```

## File Validation Logic

The `validateAndProcessFile` function in the FileUploader component performs these checks:

1. **File Type Validation**:
   ```typescript
   if (!selectedFile.type.includes('audio/')) {
     toast.error('Please upload an audio file');
     return;
   }
   ```

2. **File Size Validation**:
   ```typescript
   if (selectedFile.size > 50 * 1024 * 1024) {
     toast.error('File size should be less than 50MB');
     return;
   }
   ```

## Input Method Selection

The `InputSelectionHandler` component automatically determines which input method is active:

```typescript
const determineActiveInputMethod = () => {
  if (file) return 'audio';
  if (directInput.trim().length > 0) return 'text';
  return inputMethod;
};
```

This allows the system to:
- Use audio processing when a file is selected/recorded
- Use text processing when direct text is entered
- Support switching between methods
