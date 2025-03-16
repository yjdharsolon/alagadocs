
# Upload Feature Component Architecture

## Component Hierarchy

```
UploadPageContent
├── UploadPageHeader
├── PatientDisplayHandler
│   └── PatientDisplayCard
├── StorageInitializer
├── PermissionsManager
│   ├── StoragePermissionAlert
│   └── ResetPermissionsButton
└── UploadForm
    ├── InputSelectionHandler
    ├── FormSubmitHandler
    │   └── TextPreviewModal
    └── UploadFormLayout
        ├── PatientInfoCard
        ├── FileInputCard
        │   └── FileUploader
        ├── RecordingCard
        │   └── AudioRecorder
        │       ├── RecordingControls
        │       ├── AudioPreview
        │       └── RecordingNameDialog
        ├── DirectInputCard
        ├── UploadProgress
        └── SubmitButton
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
  - User authentication state via `useAuth` hook

### StorageInitializer
- **Purpose**: Initializes the storage bucket for the user
- **Responsibilities**:
  - Ensures storage bucket exists for the user
  - Handles initialization errors

### PermissionsManager
- **Purpose**: Manages storage permissions and errors
- **Responsibilities**:
  - Displays permission errors
  - Provides UI for fixing permissions
  - Handles retrying initialization

### PatientDisplayHandler
- **Purpose**: Manages patient selection and display
- **Responsibilities**:
  - Retrieves patient information from session storage
  - Redirects to patient selection if no patient is selected
  - Displays the current patient information

### UploadForm
- **Purpose**: Handles the input selection, form submission, and layout
- **Responsibilities**: 
  - Coordinates the overall form functionality
  - Manages state for patient information
  - Handles the input method selection

### InputSelectionHandler
- **Purpose**: Determines which input method is active
- **Responsibilities**:
  - Tracks whether audio or text input is being used
  - Updates the input method based on user interaction

### FormSubmitHandler
- **Purpose**: Manages the form submission process
- **Responsibilities**:
  - Handles direct text input preview
  - Manages the upload process
  - Handles navigation after submission

### UploadFormLayout
- **Purpose**: Provides the UI layout for the upload form
- **Responsibilities**:
  - Renders the file input and recording components
  - Renders the direct text input component
  - Displays upload progress and submit button
