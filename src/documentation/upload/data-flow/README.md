
# Upload Feature Data Flow

This directory contains detailed information about the data flow within the Upload feature, explaining how data moves through the components and services.

## Contents

- [File Handling](./file-handling.md) - How files are selected, validated, and processed
- [Form Submission](./form-submission.md) - The submission flow and state management
- [Upload Process](./upload-process.md) - The upload, transcription, and navigation process

## Data Flow Overview

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

- **Audio File**: The audio file selected or recorded by the user
- **Patient Information**: Data about the selected patient
- **Upload Progress**: Information about the current upload status
- **Transcription Data**: The results of the transcription process

## API Services

The Upload feature interacts with several API services:

- **Storage Initialization**: Ensures storage buckets exist
- **Audio Upload**: Uploads audio files to secure storage
- **Audio Transcription**: Transcribes audio to text
