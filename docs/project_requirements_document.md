# Project Requirements Document (PRD)

## 1. Project Overview

AlagaDocs is an AI-powered platform designed to streamline medical transcription and documentation. It helps doctors, nurses, and other healthcare professionals quickly turn recorded audio into structured medical notes. By automating the transcription process and formatting the output into industry-standard templates, the platform tackles the time-consuming and error-prone nature of manual documentation. The driving goal is to free up critical time for patient care while ensuring that every detail of a patient’s encounter is captured accurately.

The platform is being built to address the challenges of busy clinical environments where accurate and efficient documentation is paramount. It focuses on providing a user-friendly interface that allows for seamless audio uploads, real-time editing of transcriptions, and convenient data transfers to existing EMR systems. Success will be measured by improvements in documentation speed, higher transcription accuracy rates, consistent compliance with HIPAA standards, and overall positive user feedback from healthcare professionals.

## 2. In-Scope vs. Out-of-Scope

### In-Scope

*   **User Registration & Authentication:** Implementation of Google, Facebook, and Email login options.
*   **Role Selection:** Allow users (doctors, nurses, transcriptionists, etc.) to select their role during login for a personalized experience.
*   **Audio Handling:** Features that let users upload pre-recorded audio files (MP3, WAV) and record voice directly through the app.
*   **AI-Powered Transcription:** Convert speech to text using OpenAI Whisper API, optimized for medical terminology.
*   **Intelligent Text Structuring:** Automatically format transcribed text into structured medical notes (Chief Complaint, History of Present Illness, Assessment & Plan). We can use GPT -4 for this.
*   **Real-Time Editing:** Enable users to modify the transcription immediately after processing.
*   **Copy-Paste for EMR:** Provide an easy-to-use copy feature for transferring notes into EMR systems.
*   **Billing and Payment:** Integrate flexible payment options (Gcash, Paymaya, bank/card transfers) supporting subscriptions or pay-per-use models.
*   **User Feedback:** Capture ratings and reviews to improve transcription quality over time.
*   **Mobile Responsiveness:** Ensure the web interface is accessible and user-friendly on various devices (desktop, tablet, mobile).

### Out-of-Scope

*   **Direct API EMR Integration (initial phase):** The first version will focus on facilitating the copy-paste workflow for EMR systems rather than direct API connections.
*   **Dedicated Mobile App:** While the platform will be mobile-responsive, developing a native mobile app will be deferred to a later phase.
*   **Complex Telemedicine Integrations:** Direct integration with telemedicine platforms and advanced EHR systems will be considered for future development.
*   **Non-Core AI Enhancements:** Advanced features like speech summarization and voice command navigation are long-term ideas and not included in the initial release.

## 3. User Flow

A typical user begins their journey by signing up or logging in via email, Google, or Facebook. After authentication, they are immediately redirected to a role selection screen where they pick whether they are a doctor, nurse, transcriptionist, or others . This choice tailors the interface to display relevant options such as customized text templates and workflow settings. Once their role is selected, users land on a dashboard that clearly outlines the main functions of the platform and provides easy navigation toward audio upload or recording.

After selecting the audio input method, users proceed to record their voice or upload pre-recorded audio files. The system then processes the audio using the AI-powered transcription engine to convert speech into text, automatically structuring it into a familiar medical documentation format. If needed, users can review and edit the transcript in real time for accuracy. Finally, the platform offers a simple copy option that allows users to transfer the finalized notes to their EMR system, completing the documentation process efficiently.

## 4. Core Features

*   **User Role Selection (/role-selection):**

    *   Choose roles such as Doctor, Nurse, or Therapist.
    *   Customize text structuring based on the selected role.

*   **Audio Upload & Voice Recording (/upload):**

    *   Upload common audio file formats (MP3, WAV).
    *   Record voice directly within the application.

*   **AI Transcription (/transcribe):**

    *   Convert speech into text leveraging AI-powered transcription.
    *   Optimize transcription accuracy with specialized medical terminology support.

*   **Intelligent Text Structuring (/structured-output):**

    *   Automatically apply a formatted structure (Chief Complaint, History of Present Illness, Assessment & Plan).
    *   Allow users to modify the default structure if necessary.

*   **Real-Time Editing (/edit-transcript):**

    *   Enable users to manually correct transcription errors immediately.
    *   Provide on-screen editing tools with straightforward interaction.

*   **Copy-to-EMR Feature (/copy):**

    *   Simplify the process of transferring structured notes.
    *   Ensure compatibility with various EMR systems through copy-paste functionality.

*   **User Authentication & Secure Accounts (/login, /signup, /profile):**

    *   Support multiple authentication methods (Google, Facebook, Email).
    *   Store user preferences and transcription history securely.

*   **Flexible Payment System (/billing):**

    *   Implement dynamic pricing models (subscription or pay-per-use).
    *   Support regional payment methods (Gcash, Paymaya, bank/card transfers).

*   **Customizable Text Structuring (/customize-format):**

    *   Allow users to save custom templates for medical documentation.
    *   Use dynamic text prompts to facilitate tailored documentation.

*   **User Ratings & Reviews (/ratings):**

    *   Provide a mechanism for users to rate transcription accuracy.
    *   Collect feedback for continuous AI and feature improvement.

## 5. Tech Stack & Tools

*   **Frontend:**

    *   Next.js 14 with TypeScript for building a robust and scalable web interface.
    *   Tailwind CSS along with shadcn/UI and Radix UI to achieve a minimalist and modern look.
    *   Lucide Icons for enhanced UI visual elements.

*   **Backend & Storage:**

    *   Supabase for the database, authentication services, and file storage.
    *   OpenAI Whisper API to drive the AI-powered audio transcription.

*   **AI Integration:**

    *   GPT-4 for refining intelligent text structuring, generating dynamic text prompts, and enhancing feedback-driven improvement mechanisms.

*   **IDE & Plugin Integrations:**

    *   Tools like Lovable.dev can be used to generate front-end and full-stack web apps based on the structure provided.
    *   Potential integrations include plugins that support debugging and code quality, such as Windsurf or Cursor, to streamline the development process.

## 6. Non-Functional Requirements

*   **Performance:**

    *   The system should handle moderate to high concurrent usage with efficient bandwidth management.
    *   Audio processing and transcription should occur with minimal delay (targeting response times within a few seconds post-upload in average network conditions).

*   **Security & Compliance:**

    *   Enforce HIPAA compliance by implementing data encryption (both at rest and in transit), secure access controls, and audit logging.
    *   Ensure that third-party services (Supabase, OpenAI APIs) adhere to HIPAA standards.
    *   Regular security audits must be performed to identify vulnerabilities.

*   **Usability:**

    *   The platform should provide a clean, intuitive user interface with seamless navigation.
    *   It should be fully responsive and work smoothly on both desktops and mobile devices.
    *   Prioritize accessibility and simplicity for busy healthcare professionals.

*   **Reliability:**

    *   Provide robust error handling and system monitoring to ensure minimal downtime.
    *   Ensure data backup protocols meet regulatory requirements for medical records retention (minimum 6 years where applicable).

## 7. Constraints & Assumptions

*   **Compliance Dependency:**

    *   The platform is required to be HIPAA-compliant, which influences data storage, transfer, and processing strategies.

*   **System Load:**

    *   Expect moderate to high concurrent audio uploads, especially during peak clinical hours, requiring scalable server architecture and efficient bandwidth management.

*   **Audio File Characteristics:**

    *   Users may upload audio files ranging from 1MB to 100MB, so file storage solutions and processing pipelines must be designed for varying file sizes.

*   **Third-Party Services:**

    *   The operation of the system depends on the availability and stable API performance of services like Supabase, OpenAI Whisper API, and GPT-4.

*   **Mobile vs. Desktop:**

    *   Initially, the focus will be on a responsive web design rather than a dedicated mobile app, with the assumption that a future version may include a native mobile application.

*   **Regional Payment Flexibility:**

    *   The payment system must support adaptable methods (Gcash, Paymaya, bank/card transfers) to accommodate users in different regions.

## 8. Known Issues & Potential Pitfalls

*   **API Limitations & Rate Limits:**

    *   Relying on external APIs (OpenAI Whisper, GPT-4) may lead to rate limiting or downtime during high-load scenarios. Implementing caching strategies and fallback mechanisms can help mitigate these issues.

*   **Transcription Accuracy:**

    *   Despite state-of-the-art technology, transcription errors may occur due to diverse accents, languages, or background noise. Integrating an intuitive editing interface and feedback loop will be crucial for continuous improvement.

*   **Compliance Risks:**

    *   Handling sensitive medical data under HIPAA regulations introduces high standards for data security and privacy. Regular audits, stringent encryption protocols, and audit trails are non-negotiable measures to reduce risk.

*   **Scalability Challenges:**

    *   As the platform scales, managing large volumes of high-quality audio data and ensuring consistent performance will be challenging. Preparing an infrastructure that can scale dynamically and planning for regular performance reviews are key steps.

*   **User Experience During High Load:**

    *   During peak clinical hours, system performance can degrade, affecting the user experience. Load testing, efficient CPU and memory management, and proper scaling strategies (e.g., auto-scaling on cloud infrastructure) will be important to address this.

This document provides a clear, step-by-step description of the project’s requirements, ensuring that no details are left for guesswork. All subsequent technical documents (Tech Stack, Frontend Guidelines, Backend Structure, App Flow, File Structure, IDE rules, etc.) will reference this PRD as the single source of truth for building a reliable, user-friendly, and secure AI-powered medical transcription and documentation platform.
