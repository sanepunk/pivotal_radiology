import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// VTK.js imports
import '@kitware/vtk.js/favicon';
import '@kitware/vtk.js/Rendering/Profiles/Volume';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';

// Force DataAccessHelper to have access to various data source
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';

function VTK3DViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageData } = location.state || {};
  const containerRef = useRef(null);
  const vtkContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [viewer, setViewer] = useState(null);

  // Get URL from location.state (imageData.rendering_3d)
  const getVolumeURL = () => {
    // Check if we have imageData with rendering_3d from location.state
    if (imageData && imageData.rendering_3d) {
      return `http://localhost:8000${imageData.rendering_3d}`;
    }
    
    // Check for direct fileURL in location.state
    if (location.state && location.state.fileURL) {
      return location.state.fileURL;
    }
    
    // Try URL parameters as fallback
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fileURLParam = urlParams.get('fileURL');
      if (fileURLParam) return fileURLParam;
    }
    
    // Default demo file
    return 'https://data.kitware.com/api/v1/item/59cdbb588d777f31ac63de08/download';
  };

  const volumeURL = getVolumeURL();

  const createViewer = async (container, url) => {
    try {
      // Create a dedicated div for VTK that React won't touch
      const vtkDiv = document.createElement('div');
      vtkDiv.style.width = '100%';
      vtkDiv.style.height = '100%';
      container.appendChild(vtkDiv);
      vtkContainerRef.current = vtkDiv;

      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0.96, 0.96, 0.96],
        rootContainer: vtkDiv,
        containerStyle: { height: '100%', width: '100%' }
      });

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      // Use XMLImageDataReader directly for .vti files
      const reader = vtkXMLImageDataReader.newInstance();
      const actor = vtkVolume.newInstance();
      const mapper = vtkVolumeMapper.newInstance();
      
      // Configure mapper to avoid "too many steps" error
      mapper.setSampleDistance(2.0); // Increased sample distance
      mapper.setMaximumSamplesPerRay(500); // Reduced max samples
      mapper.setAutoAdjustSampleDistances(true);
      actor.setMapper(mapper);
      mapper.setInputConnection(reader.getOutputPort());

      // Create color and opacity transfer functions for TB detection
      const ctfun = vtkColorTransferFunction.newInstance();
      const ofun = vtkPiecewiseFunction.newInstance();
      
      // Initial setup - will be adjusted based on actual data
      
      actor.getProperty().setRGBTransferFunction(0, ctfun);
      actor.getProperty().setScalarOpacity(0, ofun);
      actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
      actor.getProperty().setInterpolationTypeToLinear();
      actor.getProperty().setShade(true);
      actor.getProperty().setAmbient(0.2);
      actor.getProperty().setDiffuse(0.7);
      actor.getProperty().setSpecular(0.3);
      actor.getProperty().setSpecularPower(8.0);

      renderer.addActor(actor);

      // Load the data directly as a .vti file
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const success = reader.parseAsArrayBuffer(arrayBuffer);
      
      if (!success) {
        throw new Error('Failed to parse VTI file');
      }

      // Get data range and available arrays for debugging
      const data = reader.getOutputData();
      const pointData = data.getPointData();
      
      console.log('Available arrays:', pointData.getNumberOfArrays());
      for (let i = 0; i < pointData.getNumberOfArrays(); i++) {
        const array = pointData.getArray(i);
        const name = array.getName();
        const range = array.getRange();
        console.log(`Array ${i}: ${name}, Range: [${range[0]}, ${range[1]}]`);
      }
      
      // Check for TB and XRay arrays (like in PyVista code)
      let tbArray = null;
      let xrayArray = null;
      
      for (let i = 0; i < pointData.getNumberOfArrays(); i++) {
        const array = pointData.getArray(i);
        const name = array.getName();
        if (name === 'TB') tbArray = array;
        if (name === 'XRay') xrayArray = array;
      }
      
      if (tbArray && xrayArray) {
        console.log('Found TB and XRay arrays - setting up dual volume visualization');
        
        // Use TB array as primary (matching PyVista approach)
        pointData.setActiveScalars('TB');
        
        // TB-focused color mapping (hot colormap equivalent)
        ctfun.removeAllPoints();
        ctfun.addRGBPoint(0.0, 0.0, 0.0, 0.0);      // Black (no TB)
        ctfun.addRGBPoint(0.25, 0.5, 0.0, 0.0);     // Dark red
        ctfun.addRGBPoint(0.5, 1.0, 0.0, 0.0);      // Red
        ctfun.addRGBPoint(0.75, 1.0, 0.5, 0.0);     // Orange
        ctfun.addRGBPoint(1.0, 1.0, 1.0, 0.0);      // Yellow-white
        
        // TB opacity (0 to 0.9 range from PyVista)
        ofun.removeAllPoints();
        ofun.addPoint(0.0, 0.0);    // Transparent for no TB
        ofun.addPoint(0.1, 0.0);    // Still transparent for low values
        ofun.addPoint(0.5, 0.5);    // Medium opacity for medium TB
        ofun.addPoint(1.0, 0.9);    // High opacity for high TB
        
      } else {
        // Fallback: use first available array or default scalar
        const activeArray = pointData.getScalars();
        const range = activeArray ? activeArray.getRange() : [0, 1];
        console.log('Using active scalars with range:', range);
        
        // Adjust for normalized data (0-1 range, common in medical imaging)
        if (range[0] >= 0 && range[1] <= 1) {
          console.log('Detected normalized data (0-1 range)');
          
          ctfun.removeAllPoints();
          ofun.removeAllPoints();
          
          // Grayscale to highlight structures (viridis-like)
          ctfun.addRGBPoint(0.0, 0.0, 0.0, 0.0);      // Black
          ctfun.addRGBPoint(0.2, 0.1, 0.1, 0.3);      // Dark purple
          ctfun.addRGBPoint(0.4, 0.2, 0.4, 0.6);      // Purple
          ctfun.addRGBPoint(0.6, 0.1, 0.6, 0.8);      // Blue-purple
          ctfun.addRGBPoint(0.8, 0.2, 0.8, 0.9);      // Magenta
          ctfun.addRGBPoint(1.0, 0.9, 0.9, 0.9);      // Light
          
          ofun.addPoint(0.0, 0.0);    // Transparent
          ofun.addPoint(0.1, 0.0);    // Still transparent
          ofun.addPoint(0.3, 0.2);    // Low opacity
          ofun.addPoint(0.6, 0.6);    // Medium opacity
          ofun.addPoint(1.0, 0.8);    // High opacity
          
        } else {
          // Handle other data ranges
          const min = range[0];
          const max = range[1];
          const mid = (min + max) / 2;
          
          ctfun.removeAllPoints();
          ofun.removeAllPoints();
          
          ctfun.addRGBPoint(min, 0.0, 0.0, 0.0);
          ctfun.addRGBPoint(mid, 0.5, 0.5, 0.8);
          ctfun.addRGBPoint(max, 1.0, 1.0, 1.0);
          
          ofun.addPoint(min, 0.0);
          ofun.addPoint(min + (max - min) * 0.2, 0.0);
          ofun.addPoint(mid, 0.4);
          ofun.addPoint(max, 0.8);
        }
      }

      renderer.resetCamera();
      renderWindow.render();

      return {
        actor,
        renderer,
        renderWindow,
        reader,
        mapper,
        fullScreenRenderer
      };
    } catch (err) {
      console.error('Error creating viewer:', err);
      throw err;
    }
  };

  const loadVolumeData = async (url) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      console.log('Loading VTI file from:', url);
      
      if (containerRef.current) {
        // Clear container but let VTK manage its own DOM
        if (vtkContainerRef.current) {
          vtkContainerRef.current.remove();
          vtkContainerRef.current = null;
        }
        
        setProgress(30);
        const viewerInstance = await createViewer(containerRef.current, url);
        setProgress(100);
        
        setViewer(viewerInstance);
        setLoading(false);
        setModelLoaded(true);
      }
    } catch (err) {
      console.error('Error loading volume data:', err);
      setError(`Failed to load 3D model: ${err.message}`);
      setLoading(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    // Exit early if container is not available
    if (!containerRef.current) return;
    
    // Check if we have image data
    if (!imageData || !imageData.rendering_3d) {
      // If no imageData, try to load from URL anyway (could be demo or fallback)
      if (volumeURL.includes('localhost')) {
        setError("No 3D model data available");
        setLoading(false);
        return;
      }
    }

    // Small delay to ensure React has finished its DOM operations
    const timer = setTimeout(() => {
      loadVolumeData(volumeURL);
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (viewer?.fullScreenRenderer) {
        try {
          viewer.fullScreenRenderer.delete();
        } catch (e) {
          console.warn('Error during VTK cleanup:', e);
        }
      }
      if (vtkContainerRef.current) {
        try {
          vtkContainerRef.current.remove();
        } catch (e) {
          console.warn('Error removing VTK container:', e);
        }
        vtkContainerRef.current = null;
      }
    };
  }, [imageData, volumeURL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (viewer?.fullScreenRenderer) {
        try {
          viewer.fullScreenRenderer.delete();
        } catch (e) {
          console.warn('Error during component unmount cleanup:', e);
        }
      }
      if (viewer?.actors) {
        viewer.actors.forEach(({ actor }) => {
          try {
            if (actor.delete) actor.delete();
          } catch (e) {
            console.warn('Error cleaning up actor:', e);
          }
        });
      }
    };
  }, [viewer]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-4"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-blue-600">3D Lung Volume Viewer</h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Volume</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => loadVolumeData(volumeURL)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-4"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-blue-600">3D Lung Volume Viewer</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div 
            ref={containerRef}
            className="relative w-full overflow-hidden rounded bg-gray-100"
            style={{ height: '70vh' }}
          >
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Loading 3D model...</h3>
                  <p className="text-gray-600">Progress: {progress}%</p>
                  <div className="w-64 bg-gray-200 rounded-full h-2 mt-4 mx-auto">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {modelLoaded && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded z-40">
                <p className="text-sm">
                  TB Detection - 3D Volume
                </p>
              </div>
            )}

            {volumeURL && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded z-40 max-w-md">
                <p className="text-xs mb-1">Loading from:</p>
                <p className="text-sm truncate">
                  {volumeURL.length > 50 ? `...${volumeURL.slice(-50)}` : volumeURL}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Mouse Controls:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• <strong>Left-click + drag:</strong> Rotate the volume</p>
              <p>• <strong>Middle-click + drag:</strong> Pan the view</p>
              <p>• <strong>Right-click + drag:</strong> Zoom in/out</p>
              <p>• <strong>Mouse wheel:</strong> Zoom in/out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VTK3DViewer;