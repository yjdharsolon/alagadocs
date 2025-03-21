✅ **I fully understand.**  

### **Finalized Lovable.dev Prompt for Prescription PDF Generation**  
This prompt ensures that **all details (Doctor’s Info, Patient’s Info, and Footer) are dynamically fetched from the app’s User Profile and Patient’s Profile** to avoid manual data entry.

---

## **📌 Lovable.dev Prompt for Generating a Prescription PDF**
```plaintext
### **Role & Goal**
You are an **expert PDF generator** for **medical prescriptions** using **Lovable.dev**. Your task is to create a **properly formatted** and **professionally structured** PDF prescription document that follows Philippine medical standards.

---

## **📌 DATA SOURCE REQUIREMENTS**
- **Doctor’s Information (Header & Footer) → Must be dynamically fetched from the User Profile.**
- **Patient’s Information (Patient Details) → Must be dynamically fetched from the Patient’s Profile.**
- **No manual entry should be needed for these sections unless explicitly modified by the user.**
- **The date should auto-generate to the current date unless overridden manually.**

---

## **📌 PDF STRUCTURE & FORMAT**  
### **1️⃣ HEADER SECTION**
- The **header** must contain **two justified columns** dynamically populated from the **User Profile**:
  - **Column 1 (70% width, aligned left)**:
    - **Doctor's Full Name (Bold, 15pt)**
    - **Specialty (11pt)**
    - **Office Hours (11pt)**
    - **Contact Number (11pt)**
  - **Column 2 (30% width, aligned left within its space)**:
    - **Clinic Name (Bold, 15pt)**
    - **Clinic Address (11pt)**

✅ **Doctor-related details should be automatically pulled from the User Profile.**  
✅ **No extra spacing between lines.**  
✅ **Add space before and after the separator line.**  
✅ **Separator line:** A thin, full-width line placed below the header.

---

### **2️⃣ PATIENT INFORMATION**
- **Font Size:** 11pt
- **Aligned left, justified where necessary**
- **Fields & Format:**
  - **NAME:** Underlined (_________________________)
  - **AGE:** Two-digit space (__)
  - **SEX:** Four-letter space (____)
  - **ADDRESS:** Underlined (_________________________)
- **AGE, SEX, and ADDRESS must be in a single line.**  
- **No extra spaces between these details.**
- **Date (current date, right-aligned)** should be on the next line.

✅ **Patient-related details should be automatically pulled from the Patient’s Profile.**  
✅ **Date should auto-generate but allow manual override if needed.**  

---

### **3️⃣ Rx LOGO (PRESCRIPTION SYMBOL)**
- **Font Size:** 18pt  
- **Position:** Indent Left  
- **Spacing:** A small space before the medications section.

---

### **4️⃣ MEDICATIONS SECTION**
- **Title "Medications:" (Bold, 12pt)**
- **Medication Details Format (11pt, no extra spaces within each set):**
  ```
  1. <Generic Name> (<Brand Name, if applicable>) <Dosage> <Formulation>   Qty: <Quantity>
     <Special Instructions / Signatura>
  ```
  - **Medication name, dosage, and formulation must be left-aligned.**
  - **Quantity must be right-aligned.**
  - **No extra spaces within each medication set.**
  - **Add double spacing (2x) between different medications.**

✅ **Example:**
```
1. Aspirin (Bayer) 81 mg Tablet   Qty: 30
   Take 1 tablet once daily after meals

2. Atorvastatin (Lipitor) 20 mg Tablet   Qty: 30
   Take 1 tablet once daily at bedtime
```

---

### **5️⃣ PRESCRIBER'S DETAILS (FOOTER)**
- **Font Size:**
  - **Doctor's Name (Bold, 12pt)**
  - **PRC, S2, PTR (Regular, 11pt)**
- **Alignment & Positioning:**
  - **Position:** Always at the bottom of the page (no extra spacing pushing it down).
  - **Occupies 20-30% of the right side of the paper but is indented left within that area.**
  - **All details must be close together with no extra spacing between lines.**
  - **Should be dynamically fetched from the User Profile.**

✅ **Example Format (Fetched Dynamically from User Profile):**
```
                           Dr. Maria Santos, MD
                           PRC No.: 123456
                           S2 No.: 789123 (If applicable)
                           PTR No.: 654321
```

---

## **📌 FUNCTIONAL REQUIREMENTS**
✅ **Use PDF formatting elements correctly (header, body, footer).**  
✅ **Ensure text alignment is perfect (justified where required, indented properly).**  
✅ **No unnecessary spacing in any section.**  
✅ **All fields should be dynamically replaceable (Doctor’s info, Patient’s info, Medications).**  
✅ **Prescriber’s details must always stay at the bottom of the page.**  
✅ **Date should auto-generate (or allow manual entry).**  

---

### **📌 OUTPUT EXPECTATION**
The output should be a **high-quality, structured PDF document** that adheres strictly to the above format. **Text should be well-aligned, professional-looking, and properly formatted.**

---

## **🚀 FINAL INSTRUCTIONS**
✅ **Ensure all elements follow the correct font size and spacing.**  
✅ **Check that the footer remains on the same page (no forced page breaks).**  
✅ **Test with sample patient and doctor details before finalizing.**  
✅ **Generate a downloadable PDF file.**  
```

---

### **📌 How to Use This Prompt in Lovable.dev**
1. **Copy the prompt above** and **paste it into Lovable.dev's custom prompt field**.  
2. **Lovable.dev should automatically pull data from the User Profile and Patient Profile.**  
3. **Run the prompt** and check the output.  
4. **Test with sample data** to ensure everything aligns correctly.  
5. **Download the generated PDF** and verify if it follows your requested format.  

---

✅ **This prompt ensures that Lovable.dev dynamically pulls doctor and patient details, eliminates manual entry, and generates a structured, professional prescription PDF with perfect alignment.**  
