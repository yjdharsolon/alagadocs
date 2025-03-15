Here's the **final refined version** of your **"Workflow"** document, incorporating your update that after the end of a consultation, the app should return to the **Select Patient** page.

---

# **AlagaDocs Workflow**

## **1. User Authentication & Role Selection**
- **Login:** Users must log in to access the system.  
- **Select Role:** The user selects their role (Doctor, Nurse, etc.). *(All roles have equal access control.)*  

## **2. Patient Management**
- **Patient Search:** Before starting a consultation, the user searches for an existing patient.  
  - If the patient exists → Select patient profile and proceed.  
  - If the patient is new → Register a new patient.  
- **Patient Registration (For New Patients):**  
  - Full Name  
  - Birthdate  
  - **Auto-computed Age** (based on birthdate and current date)  
  - Contact Information  
- **Patient Access Restriction:**  
  - Each patient record is **only accessible to the doctor who registered them**. Other doctors cannot view or edit these records.  

## **3. Consultation & Transcription Process**
- **Start Consultation:** After selecting or registering a patient, the consultation begins.  
- **Voice Recording / Manual Input:**  
  - If using voice recording, the **file name should be the patient’s full name**.  
  - If manually typing, the user inputs notes directly.  
- **Transcription:** Converts recorded audio into text.  
- **Text Structuring:** The system organizes the transcription into a structured format.  

## **4. Document Processing & Storage**
- **Template Generation:** Converts structured text into predefined medical templates.  
- **Review Before Saving:**  
  - Users **must review and confirm** that all data is correct before saving.  
  - **Edits are not allowed after saving.**  
- **Save & Export Options:**  
  - **Save within the app** (under the patient’s profile).  
  - **Copy to EMR** (for direct pasting).  
  - **Export as PDF** (with AlagaDocs branding, patient details, and timestamp).  

## **5. Patient Records & Follow-Up**
- **All interactions are stored under the patient’s profile.**  
- **Next consultations:**  
  - If the patient returns, the doctor can access past notes and continue from previous records, eliminating the need for re-registration.  

## **6. Audit & Security**
- **Audit Log:**  
  - The system tracks **who accessed or modified a patient’s records**.  
  - Logs include timestamps and user actions.  

## **7. General Workflow Summary**
1. **Login**  
2. **Select Role**  
3. **Search for Patient**  
   - If patient exists → Select  
   - If new → Register  
4. **Start Consultation**  
5. **Voice Recording / Manual Typing**  
6. **Transcribe**  
7. **Text Structuring**  
8. **Template Generation**  
9. **Review & Confirm Data** *(No edits allowed after saving.)*  
10. **Save / Copy / Export to PDF**  
11. **End Consultation** → Automatically return to Select Patient Page*  

---

### **Final Confirmation**
✅ The app will return to the **Select Patient** page immediately after the consultation ends.  
✅ No edits are allowed after saving, so users must confirm data before saving.  
✅ Patients are only accessible to the doctor who registered them.  
✅ Audit logs will track all access and modifications.  

Let me know if this is **final** or if you have any last tweaks! 🚀
