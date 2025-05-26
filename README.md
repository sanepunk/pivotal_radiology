# TB Screening & Reporting SPA

A **secure**, **responsive** React single-page application (SPA) for tuberculosis (TB) screening, imaging analysis, visualization, and secure PDF reporting. Built with:

- **React** (CRA or Vite)
- **React Router** for client-side routing
- **Axios** for HTTP calls
- **Three.js** for 3D visualization
- **react-pdf** or **jsPDF** for PDF generation
- **Tailwind CSS** (or plain CSS modules) for styling

---

## 🚀 Features

1. **Authentication & Entry**  
   - Sign In / Sign Up with password (min 8 chars, special + alphanumeric), CAPTCHA, OTP  
   - Resend OTP, secure session handling  
   - Top menu: Help | Contact Us | Home | Back | Forward | Logout  

2. **Patient Profile & History**  
   - First Visit: collect name, age, sex, mobile, email, WhatsApp, address, geolocation  
   - Revisit: search by name, address, cell no, UID, referring Dr, visit date, TB status  
   - Display past‐visit summaries; choose existing or new visit  
   - Auto‐generate or override unique alphanumeric UID  

3. **Imaging & Analysis**  
   - Upload DICOM / PNG / JPEG  
   - `POST /api/analyze` with `{ uid, file }`  
   - Overlay 200×200 loading GIF during analysis  
   - Display diagnosis: **Tuberculosis** or **Healthy** with navy‐blue badges  

4. **Visualization**  
   - Segmentation (canvas mask) or 3D Viewer (Three.js/WebGL)  
   - Controls: rotate L/R, zoom, toggle left/right lobe, thermal on/off  
   - Progress bars on visualization requests  
   - Skip visualization option  

5. **Reporting**  
   - Preview in DOC-style template with tick-boxes  
   - Auto-fill UID, metadata, date/time, result, images  
   - Three-column comparison: original X-ray, 2D+thermal, 3D view  
   - Generate **password-protected** PDF via react-pdf or jsPDF  
   - “Download Secure Report” button; tick-boxes remain editable pre-export  

6. **UI/UX & Styling**  
   - Theme: Navy Blue `#000080` (primary), White `#FFFFFF` (text), Complementary Green (healthy)  
   - Font: Times New Roman (body 12pt; H4 16pt; H2 20pt)  
   - Buttons ≥ 1 in² clickable  
   - Footer with disclaimer, copyright, T&C, Privacy, Disclaimer  

---