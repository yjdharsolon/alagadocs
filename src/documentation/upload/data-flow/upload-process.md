
# Upload Process Data Flow

This document details the upload and transcription process in the Upload feature.

## Upload and Transcription Flow

```
useUploadProcess.handleSubmit ──► uploadAudio service ──► Supabase Storage
                                          │
                                          ▼
                                 Create transcription record
                                          │
                                          ▼
                                 Upload file to storage
                                          │
                                          ▼
                          transcribeAudio service ──► OpenAI Whisper API
                                          │
                                          ▼
                                  Return transcription data
                                          │
                                          ▼
                            Store in sessionStorage and navigate
```

## Key API Requests

### Storage Initialization
```typescript
// Called by StorageInitializer on mount
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

## Upload Service Implementation

The `uploadAudio` service handles file uploads with these key steps:

1. **Authentication Check**:
   ```typescript
   const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
   
   if (sessionError || !sessionData.session) {
     throw new Error('Authentication error. Please log in again.');
   }
   ```

2. **Create Transcription Record**:
   ```typescript
   const transcriptionData = {
     audio_url: publicUrl,
     user_id: userId,
     text: '',
     status: 'pending',
     patient_id: patientId || null
   };
   
   const { data: insertData, error: transcriptionError } = await supabase
     .from('transcriptions')
     .insert(transcriptionData)
     .select();
   ```

3. **Upload File with Retry Logic**:
   ```typescript
   let attempts = 0;
   const maxAttempts = 3;
   
   while (attempts < maxAttempts) {
     attempts++;
     
     try {
       const { data, error } = await supabase.storage
         .from('transcriptions')
         .upload(filePath, file, uploadOptions);
         
       if (error) {
         if (attempts >= maxAttempts) {
           // Return the URL anyway if we have a transcription record
           if (insertData) {
             return publicUrl;
           }
           throw error;
         }
         continue;
       }
       
       return publicUrl;
     } catch (uploadError) {
       // Retry logic
     }
   }
   ```

## Progress Tracking

The `useUploadProgress` hook provides real-time feedback with these steps:

1. **Verifying** (5%): Initial authentication and setup
2. **Uploading** (10-75%): File upload to storage
3. **Transcribing** (80-99%): Audio transcription process
4. **Complete** (100%): Process finished, ready for navigation

## Recovery Mechanisms

### Session Storage Backup

The `lastTranscriptionResult` object is stored in sessionStorage:

```typescript
sessionStorage.setItem('lastTranscriptionResult', JSON.stringify({
  transcriptionData: result.transcriptionData,
  audioUrl: result.audioUrl || '',
  transcriptionId: result.transcriptionId || '',
  patientId: patientId || null,
  patientName: patientName || null
}));
```

This allows for:
- Recovery from browser crashes
- Restoration after accidental navigation
- Data preservation during page refreshes
