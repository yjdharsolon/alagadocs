
# Upload Feature Error Handling

This document details how errors are handled in the Upload feature.

## Error Types and Handling

### Authentication Errors

**Sources:**
- Session timeout
- Invalid credentials
- Token expiration

**Handling:**
- Error state is set in `useUploadForm`
- `ErrorAlert` component displays the error
- "Logout and Login Again" button is provided

```typescript
// In ErrorAlert.tsx
{error.includes('authentication') && (
  <Button 
    variant="outline" 
    onClick={onLogoutAndLogin}
  >
    Logout and Login Again
  </Button>
)}
```

### Storage Permission Errors

**Sources:**
- Missing storage bucket
- Insufficient permissions
- RLS policy issues

**Handling:**
- `PermissionsManager` catches and displays errors
- `StoragePermissionAlert` shows specialized UI
- "Fix Permissions" button calls serverless function

```typescript
// In PermissionsManager.tsx
const fixPermissions = async () => {
  try {
    setFixingPermissions(true);
    setError(null);
    
    const { data, error } = await supabase.functions.invoke('fix-storage-permissions');
    
    if (error) {
      setError('Could not fix permissions. Please try again or contact support.');
    } else {
      toast.success('Storage permissions fixed! Please try uploading again.');
    }
  } catch (err) {
    setError('Error fixing permissions. Please try again.');
  } finally {
    setFixingPermissions(false);
  }
};
```

### File Validation Errors

**Sources:**
- Unsupported file types
- File size exceeded
- Corrupted files

**Handling:**
- Validation in `FileUploader` component
- Toast notifications for user feedback
- Prevent invalid files from being processed

```typescript
// In FileUploader.tsx
const validateAndProcessFile = (selectedFile: File) => {
  if (!selectedFile.type.includes('audio/')) {
    toast.error('Please upload an audio file');
    return;
  }
  
  if (selectedFile.size > 50 * 1024 * 1024) {
    toast.error('File size should be less than 50MB');
    return;
  }
  
  onFileSelect(selectedFile);
};
```

### Upload/Transcription Errors

**Sources:**
- Network failures
- API limits exceeded
- Server errors

**Handling:**
- Retry logic in `uploadAudio` service (3 attempts)
- Fallback to use existing transcription record if available
- Error message propagation to UI

## Recovery Mechanisms

### Transcription Recovery Flow

```
Upload fails but record exists ──► Continue with transcription
                │
                ▼
Transcription fails ──► Store pendingTranscription in sessionStorage
                │
                ▼
      Navigate to editor ──► EditTranscript page attempts recovery
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

## Retry Mechanisms

```typescript
// Storage initialization retry
const handleRetry = async () => {
  setRetrying(true);
  if (onRetryInit) {
    await onRetryInit();
  }
  setRetrying(false);
  toast.success('Storage initialization attempted again');
};

// Upload retry logic
let attempts = 0;
const maxAttempts = 3;

while (attempts < maxAttempts) {
  attempts++;
  
  try {
    // Upload attempt
    if (error) {
      // Handle error and continue
      continue;
    }
    return publicUrl;
  } catch (uploadError) {
    // Handle error and maybe retry
  }
}
```
