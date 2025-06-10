# Lung Background Image Instructions

## Background Image Implementation
The TB Screening System now includes a subtle lung background image on most pages to enhance the medical theme. 

## How to Test the Background

1. Navigate to `/app/test-background` to see an interactive test page with adjustable settings
2. Use the sliders to find the optimal opacity, contrast, and brightness settings
3. Copy the generated settings to update the BackgroundWrapper component

## Enhanced Components

Several components have been created to improve the display of the background image:

1. **BackgroundWrapper**: Adds the lung background to any page
2. **MedicalPaper**: A styled Paper component that works well with the background

## Troubleshooting

If the background doesn't appear on pages:

1. Check that the image file exists at `src/assets/background.jpg`
2. Ensure the `BackgroundWrapper` component is properly imported and used in each page
3. Verify that no CSS is overriding the background (z-index issues)
4. Check browser console for any image loading errors
5. Try increasing opacity in `BackgroundWrapper.jsx` for better visibility

## Implementation Options

There are three ways to add the background to pages:

1. **Individual Page Method** (Current): Import `BackgroundWrapper` in each page component
   ```jsx
   import BackgroundWrapper from '../components/BackgroundWrapper';
   import MedicalPaper from '../components/MedicalPaper';
   
   return (
     <Layout>
       <BackgroundWrapper>
         <Container>
           <MedicalPaper>
             {/* Page content */}
           </MedicalPaper>
         </Container>
       </BackgroundWrapper>
     </Layout>
   );
   ```

2. **Global Method**: Wrap all Routes in App.jsx with the BackgroundWrapper component
   ```jsx
   <Router basename='/app'>
     <BackgroundWrapper>
       <Routes>
         {/* All routes */}
       </Routes>
     </BackgroundWrapper>
   </Router>
   ```

3. **Layout Integration**: Add the background directly to the Layout component
   ```jsx
   const Layout = ({ children }) => {
     // Background logic here
     return (
       <Container>
         {/* Background element */}
         {children}
       </Container>
     );
   };
   ```

To add the lung background image to your project:

1. Place your desired lung image at `src/assets/background.jpg`
2. Use the `BackgroundWrapper` component around the content of each page
3. For consistent styling, use the `MedicalPaper` component for content containers

The image will be automatically applied as a light background to all pages except:
- Landing page
- Report page
- PDF page

The opacity is set to 15% to ensure it doesn't interfere with the content while providing a medical theme to the application.

## Troubleshooting

If the image doesn't appear:
1. Make sure the file is named exactly `lung-background.png`
2. Ensure it's placed in the correct directory: `pivotal_frontend/src/assets/`
3. Try rebuilding the application after adding the image

You can adjust the opacity and sizing in the `LungBackground.jsx` component if needed. 