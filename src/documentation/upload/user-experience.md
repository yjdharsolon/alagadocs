
# Upload Feature User Experience

This document details the user flow and interaction design of the Upload feature.

## User Flow

```
1. Select Patient ──► 2. Navigate to Upload Page ──► 3. Choose Input Method
          │                        │                           │
          │                        │                           ▼
          │                        │             ┌─────► a. Upload Audio File
          │                        │             │
          │                        │             ├─────► b. Record Audio
          │                        │             │
          │                        │             └─────► c. Direct Text Input
          │                        │                           │
          │                        │                           ▼
          │                        │                    4. Submit Content
          │                        │                           │
          │                        │                           ▼
          └────────────────────────┘             5. View Progress Feedback
                                                          │
                                                          ▼
                                              6. Navigate to Editor
```

## Key Interaction Points

### 1. Patient Selection

- **Required Step**: Upload requires a selected patient
- **Validation**: Redirects to patient selection if missing
- **UI Feedback**: Displays selected patient card at top of page

### 2. Input Method Selection

The user can choose from:

- **File Upload**:
  - Drag-and-drop interface
  - Browse files button
  - File type and size validation
  - File details display after selection

- **Voice Recording**:
  - Simple record/stop controls
  - Real-time recording duration
  - Audio preview after recording
  - Optional recording naming

- **Direct Text Input**:
  - Textarea for typing/pasting text
  - Side-by-side with audio options
  - No file upload required

### 3. Submission Feedback

- **Submit Button States**:
  - Disabled when no content available
  - Disabled during upload/recording
  - Shows current step during processing

- **Progress Tracking**:
  - Progress bar with percentage
  - Step labels (Verifying, Uploading, Transcribing)
  - Spinner animation during processing

### 4. Error Recovery

- **User-Friendly Errors**:
  - Toast notifications for validation errors
  - Alert components for system errors
  - Clear recovery options

- **Permission Fixing**:
  - One-click permission resolution
  - Progress indicator during fix
  - Success/failure notification

## Mobile Experience

The UI adapts for mobile devices with:

- **Responsive Layout**:
  - Stack layout instead of side-by-side on small screens
  - Appropriately sized touch targets
  - Simplified drag-and-drop experience

- **Recording Optimization**:
  - Simplified recording UI on mobile
  - Device-appropriate microphone access

## Component Interactions

```
FileUploader ◄──► FileInputCard ◄──┐
                                   │
RecordingCard ◄──► AudioRecorder ◄─┤
                                   ├──► UploadFormLayout ◄──► UploadForm
DirectInputCard ◄─────────────────┤
                                   │
UploadProgress ◄───────────────────┘
```

Each component is designed to:
- Provide clear feedback on current state
- Handle errors gracefully
- Guide the user to the next step
- Prevent invalid actions (like submitting without content)

## Accessibility Considerations

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Appropriate ARIA labels on interactive elements
- **Progress Announcements**: Upload progress is conveyed visually and programmatically
- **Error Announcements**: Errors are announced to screen readers via toast notifications
