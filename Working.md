# Frontend-Coding Agent Prompt

You are building a **secure, responsive React** single-page application (SPA) for TB screening and reporting. It must implement the following workflow (Dagre layout) **and** satisfy all ancillary requirements below.

---

```mermaid
%%! config:
%%!   layout: dagre
flowchart TD
    A["Start: Sign In / Sign Up"] --> A1["Sign In / Sign Up Form"]
    A1 --> B{"Authenticated?"}
    B -- No --> A1
    B -- Yes --> C["Load Welcome Page"]
    C --> D{"Is this first or a revisit?"}
    D -- First Visit --> E["New Patient Metadata: Name, Age, Sex, Mobile, Email, WhatsApp, Address, Location"]
    D -- Revisit --> F["Lookup Patient & Visit History"]
    F --> F1["Display past visit dates & report summaries"]
    F1 --> G[Choose Visit or New Visit]
    G -- Existing Visit --> E1["Pre-fill Metadata & History"]
    G -- New Visit --> E

    E --> H["Generate or Confirm UID"]
    E1 --> H
    H --> I["Upload 2D X-ray / CT Scan"]
    I --> J["Send to Backend /api/analyze"]
    J -- Progress Bar --> K[" "]{img: "https://media.tenor.com/EYX1u_zeHXYAAAAM/loading-progress-bar.gif"}
    K --> L["Show Diagnosis: Malignant or Benign"]

    L --> M{"View Segmentation, 3D, or Skip?"}
    M -- Segmentation or 3D --> N["POST /api/visualize?type=seg|3d"]
    N -- Progress Bar --> O[" "]{img: "https://media.tenor.com/EYX1u_zeHXYAAAAM/loading-progress-bar.gif"}
    O --> P["Display Segmentation OR 3D Viewer with controls: Rotate L/R, Zoom In/Out, Toggle Left/Right Lobe, Thermal On/Off"]
    M -- Skip --> P1["Skip Visualization"]

    P & P1 --> Q{"Print or Save Report?"}
    Q -- Yes --> R["Render Report Preview"]
    Q -- No --> C

    R --> S["Generate PDF via react-pdf or jsPDF"]
    S --> T["Secure (password-protected) PDF download"]
    T --> C

    style S fill:#000080,stroke:#000080,color:#ffffff

    click F1 "/search" "Doctor Search Interface"


# Page Layout

## A. Authentication & Entry

### 1. Sign In / Sign Up

**Fields:**
- **Login ID**
- **Password** (min 8 characters; alphanumeric + special)
- **Mobile No**
- **Captcha Code**
- **OTP**

**Buttons:**
- Submit  
- Resend OTP

**Post-Login Menu Bar:**
- Help  
- Contact Us  
- Home  
- Back  
- Forward  
- Logout  

---

## B. Patient Profile & History

### 1. First Visit vs. Revisit

#### First Visit
- Form collects:
  - Name, Age, Sex  
  - Mobile, Email, WhatsApp  
  - Address, Geo-location  

#### Revisit
- Search by:
  - Name  
  - Address  
  - Cell No  
  - UID  
  - Referring Dr  
  - Visit Date  
  - TB Status  
- Display past visits with date & summary  
- Options:
  - **Select Past Visit**  
  - **New Visit**  

### 2. UID Generation
- Auto-generate unique alphanumeric UID for new patients  
- Allow manual override for existing patients  

---

## C. Imaging & Analysis

### 1. Upload & Diagnose
- Accept **DICOM**, **PNG**, **JPEG**  
- On submit, `POST /api/analyze` with payload `{ uid, file }`  
- Overlay 200×200 loading-GIF at nodes G & K:

```jsx
<img
  src="https://media.tenor.com/EYX1u_zeHXYAAAAM/loading-progress-bar.gif"
  width={200}
  height={200}
  alt="Loading diagnosis..."
/>

## 2. Results Display
- **Show**: Malignant or Benign  
- **Use navy-blue badges**:  
  - Background: `#000080`  
  - Text: `#FFFFFF`  

---

## D. Visualization

### 1. Segmentation & 3D Viewer

#### Segmentation
- Canvas overlay mask on original CT/X-ray

#### 3D Viewer
- Three.js/WebGL `<canvas>` with controls:  
  - Rotate Left / Rotate Right  
  - Zoom In / Zoom Out  
  - Toggle Left Lobe / Toggle Right Lobe  
  - Thermal On / Thermal Off  
- Include navigation buttons: Back, Next, Home, End

---

## E. Reporting

### 1. Report Preview
- Pre-built DOC-style template with tick-boxes  
- Auto-fill sections:  
  - UID  
  - Metadata  
  - Date/Time  
  - Result  
  - Images  
- **Three-column comparison** (single row):  
  1. Original X-ray  
  2. System-generated 2D + Thermal overlay  
  3. Doctor’s selected 3D view (zoom/tilt)

### 2. PDF Generation & Security
- Use **react-pdf** or **jsPDF**  
- Generate password-protected PDF  
- “Download Secure Report” button  
- Only tick-box sections remain editable prior to export

---

## F. UI/UX & Styling

### 1. Theme & Typography
- **Primary Color:** Navy Blue `#000080`  
- **Text Color:** White `#FFFFFF`  
- **Secondary Highlight:** Complementary green for “Healthy”  
- **Font:** Times New Roman  
  - Body text: 12 pt  
  - Headings:  
    - H4 ≈ 16 pt  
    - H2 ≈ 20 pt  
- UI element sizing optimized for a 1 ft viewing distance; buttons ≥ 1 in² clickable area

### 2. Footer
- **Disclaimer:**  
  > Software is for binary TB detection only (colour-coded by severity).  
  > Confirm with a physician.  
- **Copyright:**  
  > © 2025 Pivotal Teleradiology. All rights reserved.  
- **Links:** Terms & Conditions | Privacy Policy | Disclaimer

---

## G. Deliverables
- Full React project scaffold (CRA or Vite)  
- Organized Routes, Components, API modules, Three.js utilities  
- Mock backend or endpoint configuration  
- README covering setup, color codes, font ratios, environment variables  

> **IMPORTANT:** Ensure every screen, API call, GIF, button, form, PDF, and 3D viewer exactly matches this specification with **no deviations**.  
