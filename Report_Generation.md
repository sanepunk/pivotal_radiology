# I. Patient Information
- **Name:** John Doe  
- **Patient ID:** 123456  
- **Age / Sex:** 42 / Male  
- **Date of X-ray:** 2025-05-29  
- **Facility:** Example General Hospital  

---

# II. X-Ray Details
- **View:** Posteroanterior (PA)  
- **Date:** 2025-05-29 10:15 AM  
- **Technician:** A. Smith, RT(R)  
- **Reporting Radiologist:** Dr. Jane Patel, MD  

---

# III. Radiology Report

## Overall Impression  
Findings are **suggestive of active pulmonary tuberculosis**.  

## Specific Findings

| Location             | Finding                                                                  |
|----------------------|--------------------------------------------------------------------------|
| **Right Upper Lobe** | Patchy, nodular opacities with increased density (early infiltrates)     |
| **Left Upper Lobe**  | Small, thin-walled cavitary lesion (~1.2 cm)                             |
| **Hilar Regions**    | Bilateral hilar lymphadenopathy; nodes enlarged to ~2 cm                 |
| **Pleural Spaces**   | No significant pleural effusion or pneumothorax                          |
| **Other**            | No miliary pattern; lung bases clear; cardiac silhouette normal          |

---

# IV. Recommendations
1. **Microbiological Confirmation**  
   - Sputum AFB smear and culture (×3)  
   - Molecular testing (e.g., Xpert MTB/RIF)  
2. **Treatment Referral**  
   - Refer to TB clinic for initiation of anti-tubercular therapy  
3. **Follow-Up Imaging**  
   - Repeat chest X-ray after 2 months of therapy to assess response  

---

# V. Additional Notes
- **Clinical Correlation Required:** Correlate with symptoms (cough, fever, weight loss) and HIV status.  
- **Differential Diagnoses:** Fungal infection (e.g., histoplasmosis), malignancy—consider based on context.  
- **Risk Factors:** History of prior TB; HIV-positive status increases reactivation risk.  

> **Key Point:** A chest X-ray can raise strong suspicion for TB but **cannot** confirm diagnosis—combine with microbiology and clinical assessment before treatment decisions.  

---

# VI. Image Comparison (1 row × 3 columns)  
Below the report you may present three side-by-side images for direct comparison:

| 1) Input X-ray as received     | 2) Processed X-ray + Thermal Overlay            | 3) 3D View (Dr’s chosen angle)                 |
|--------------------------------|--------------------------------------------------|-------------------------------------------------|
| ![Input X-ray](pivotal_backend\uploads\PTB8C9796AC_1748424222.405435_im1.jpg) | ![Thermal Overlay](pivotal_backend\uploads\PTB8C9796AC_1748424222.405435_im1.jpg)         | ![3D Tilted View](pivotal_backend\uploads\PTB8C9796AC_1748424222.405435_im1.jpg)          |

1. **Input X-ray**: Raw DICOM or JPEG as acquired.  
2. **Thermal Overlay**: System-generated 2D heatmap overlay highlighting regions of high TB probability.  
3. **3D View**: Doctor’s selected perspective—e.g. tilted/zoomed view of the region of interest (top/middle/bottom, front/back).  

*Replace the `path/to/...` placeholders with your actual image file names or URLs.*  
