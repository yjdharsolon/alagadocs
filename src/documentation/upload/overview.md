
# Upload Feature Overview

## Purpose

The Upload feature enables users to upload or record audio files for transcription within the AlagaDocs application. This feature also supports direct text input as an alternative to audio transcription.

## Key Functionality

- **Multiple Input Methods**: Support for audio file upload, direct voice recording, and text input
- **Patient Context**: Maintains patient information context during the upload process
- **Progress Tracking**: Real-time feedback on upload and transcription progress
- **Error Handling**: Robust error handling with user-friendly recovery options
- **Storage Management**: Automatically manages storage permissions and initialization

## Feature Flow

1. User selects a patient (required before upload)
2. User navigates to the upload page
3. User can:
   - Upload an audio file via browse or drag-and-drop
   - Record audio directly in the browser
   - Enter text directly in the text input area
4. User submits the content (file or text)
5. For audio:
   - System uploads the file to secure storage
   - System transcribes the audio using AI
   - User is navigated to the transcript editor
6. For direct text:
   - System processes the text
   - User is navigated to the text editor

## Technical Foundation

The Upload feature is built using React components with a modular architecture. It leverages:

- React hooks for state management and logic
- Supabase for authentication, storage, and serverless functions
- OpenAI's Whisper API for transcription (via serverless functions)
- Browser's MediaRecorder API for direct recording
