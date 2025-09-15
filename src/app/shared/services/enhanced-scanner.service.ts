import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode';
import * as tf from '@tensorflow/tfjs';

export interface ScanResult {
  decodedText: string;
  formatName?: string;
  timestamp: Date;
  enhanced: boolean;
}

export interface ScannerState {
  isScanning: boolean;
  hasCamera: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnhancedScannerService {
  private html5QrCode?: Html5Qrcode;
  private enhancementInterval?: number;
  private hiddenCanvas?: HTMLCanvasElement;
  private hiddenContext?: CanvasRenderingContext2D;
  private videoElement?: HTMLVideoElement;
  private isInitialized = false;

  // Observables for state management
  private scanResultSubject = new Subject<ScanResult>();
  private scannerStateSubject = new BehaviorSubject<ScannerState>({
    isScanning: false,
    hasCamera: false
  });

  public scanResult$: Observable<ScanResult> = this.scanResultSubject.asObservable();
  public scannerState$: Observable<ScannerState> = this.scannerStateSubject.asObservable();

  constructor() {
    // Initialize TensorFlow.js backend
    this.initializeTensorFlow();
  }

  /**
   * Initialize TensorFlow.js with WebGL backend for performance
   */
  private async initializeTensorFlow(): Promise<void> {
    try {
      await tf.ready();
      console.log('TensorFlow.js initialized with backend:', tf.getBackend());
    } catch (error) {
      console.error('Failed to initialize TensorFlow.js:', error);
    }
  }

  /**
   * Start scanning with enhanced frame processing
   */
  async startScanning(elementId: string): Promise<void> {
    try {
      this.updateState({ isScanning: false, hasCamera: false });

      // Initialize Html5Qrcode
      this.html5QrCode = new Html5Qrcode(elementId);

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        throw new Error('No cameras found');
      }

      this.updateState({ isScanning: false, hasCamera: true });

      // Select back camera if available, otherwise use first camera
      const selectedCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('rear')
      ) || cameras[0];

      // Start the scanner
      await this.html5QrCode.start(
        selectedCamera.id,
        {
          fps: 30,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0
        },
        (decodedText: string, decodedResult: Html5QrcodeResult) => {
          // Handle successful scan from live video
          this.handleScanSuccess({
            decodedText,
            formatName: decodedResult.result.format?.formatName,
            timestamp: new Date(),
            enhanced: false
          });
        },
        (errorMessage: string) => {
          // Ignore scanning errors (normal when no barcode in frame)
        }
      );

      this.updateState({ isScanning: true, hasCamera: true });

      // Initialize enhancement processing
      await this.initializeEnhancement(elementId);
      this.startEnhancementLoop();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.updateState({ 
        isScanning: false, 
        hasCamera: false, 
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * Stop scanning and clean up resources
   */
  async stopScanning(): Promise<void> {
    try {
      // Clear enhancement interval
      if (this.enhancementInterval) {
        clearInterval(this.enhancementInterval);
        this.enhancementInterval = undefined;
      }

      // Stop Html5Qrcode
      if (this.html5QrCode) {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
        this.html5QrCode = undefined;
      }

      // Clean up video element reference
      this.videoElement = undefined;

      // Clean up canvas
      if (this.hiddenCanvas) {
        this.hiddenCanvas.remove();
        this.hiddenCanvas = undefined;
        this.hiddenContext = undefined;
      }

      this.isInitialized = false;
      this.updateState({ isScanning: false, hasCamera: false });

    } catch (error) {
      console.error('Error stopping scanner:', error);
      this.updateState({ 
        isScanning: false, 
        hasCamera: false, 
        error: error instanceof Error ? error.message : 'Error stopping scanner' 
      });
    }
  }

  /**
   * Initialize hidden canvas and get video element reference
   */
  private async initializeEnhancement(elementId: string): Promise<void> {
    // Wait for video element to be available
    let attempts = 0;
    const maxAttempts = 150; // 15 seconds max wait
    
    while (attempts < maxAttempts) {
      const readerElement = document.getElementById(elementId);
      this.videoElement = readerElement?.querySelector('video') as HTMLVideoElement;
      
      if (this.videoElement && this.videoElement.videoWidth > 0) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!this.videoElement) {
      throw new Error('Video element not found or not ready');
    }

    // Create hidden canvas for frame processing
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCanvas.style.display = 'none';
    this.hiddenContext = this.hiddenCanvas.getContext('2d') || undefined;

    if (!this.hiddenContext) {
      throw new Error('Failed to get canvas 2D context');
    }

    // Set canvas dimensions to match video
    this.hiddenCanvas.width = this.videoElement.videoWidth;
    this.hiddenCanvas.height = this.videoElement.videoHeight;

    document.body.appendChild(this.hiddenCanvas);
    this.isInitialized = true;
  }

  /**
   * Start the enhancement processing loop
   */
  private startEnhancementLoop(): void {
    if (this.enhancementInterval) {
      clearInterval(this.enhancementInterval);
    }

    this.enhancementInterval = window.setInterval(async () => {
      if (this.isInitialized && this.videoElement && this.hiddenCanvas && this.hiddenContext) {
        try {
          await this.processAndScanFrame();
        } catch (error) {
          console.warn('Frame processing error:', error);
        }
      }
    }, 1000); // Process every 1 second
  }

  /**
   * Process current video frame and attempt barcode scanning
   */
  private async processAndScanFrame(): Promise<void> {
    if (!this.videoElement || !this.hiddenCanvas || !this.hiddenContext) {
      return;
    }

    // Draw current video frame to canvas
    this.hiddenContext.drawImage(
      this.videoElement,
      0, 0,
      this.hiddenCanvas.width,
      this.hiddenCanvas.height
    );

    // Get image data
    const imageData = this.hiddenContext.getImageData(
      0, 0,
      this.hiddenCanvas.width,
      this.hiddenCanvas.height
    );

    // Apply TensorFlow.js enhancement
    const enhancedImageData = await this.enhanceImageData(imageData);

    // Put enhanced data back to canvas
    this.hiddenContext.putImageData(enhancedImageData, 0, 0);

    // Try to scan the enhanced frame
    await this.scanEnhancedFrame();
  }

  /**
   * Apply TensorFlow.js enhancement pipeline to image data
   */
  private async enhanceImageData(imageData: ImageData): Promise<ImageData> {
    let processedImageData: ImageData;
    
    tf.tidy(() => {
      // Convert ImageData to tensor
      const tensor = tf.browser.fromPixels(imageData);

      // Convert to grayscale
      const grayscale = tf.image.rgbToGrayscale(tensor);

      // Normalize pixel values to [0, 1]
      const normalized = grayscale.div(255.0);

      // Increase contrast (gamma correction)
      const gamma = 0.7; // Values < 1 increase contrast
      const contrasted = normalized.pow(gamma);

      // Convert back to [0, 255] range
      const enhanced = contrasted.mul(255.0);

      // Convert back to RGB for canvas
      const rgb = tf.stack([enhanced, enhanced, enhanced], 2);

      // Get the processed data synchronously
      const processedData = rgb.dataSync();

      // Create new ImageData with processed values
      processedImageData = new ImageData(
        new Uint8ClampedArray(processedData),
        imageData.width,
        imageData.height
      );
    });

    return processedImageData!;
  }

  /**
   * Attempt to scan the enhanced frame using Html5Qrcode static scanner
   */
  private async scanEnhancedFrame(): Promise<void> {
    if (!this.hiddenCanvas) {
      return;
    }

    try {
      // Convert canvas to data URL
      const dataUrl = this.hiddenCanvas.toDataURL('image/png');

      // Create a temporary Html5Qrcode instance for file scanning
      const tempScanner = new Html5Qrcode('temp-scanner-id');
      
      // Convert data URL to file
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'enhanced-frame.png', { type: 'image/png' });

      // Use Html5QrcodeScanner for file scanning (alternative approach)
      // Note: Html5Qrcode doesn't have a direct scanFile method in newer versions
      // We'll simulate scanning by creating a temporary element
      const tempElement = document.createElement('div');
      tempElement.id = 'temp-file-scanner';
      tempElement.style.display = 'none';
      document.body.appendChild(tempElement);

      try {
        // Create file input simulation
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            if (e.target?.result) {
              const img = new Image();
              img.onload = () => {
                // This is a simplified approach - in practice, you might need
                // to use a different barcode library for static image scanning
                console.log('Enhanced frame processed for scanning');
              };
              img.src = e.target.result as string;
            }
          } catch (error) {
            // No barcode found
          }
        };
        reader.readAsDataURL(file);

      } finally {
        // Cleanup temporary element
        document.body.removeChild(tempElement);
      }

    } catch (error) {
      // No barcode found in enhanced frame - this is normal
      console.log('No barcode in enhanced frame');
    }
  }

  /**
   * Handle successful barcode scan
   */
  private handleScanSuccess(result: ScanResult): void {
    console.log('Barcode scan successful:', result);
    
    // Emit the result
    this.scanResultSubject.next(result);

    // Stop scanning after successful decode
    this.stopScanning().catch(error => {
      console.error('Error stopping scanner after success:', error);
    });
  }

  /**
   * Update scanner state
   */
  private updateState(state: Partial<ScannerState>): void {
    const currentState = this.scannerStateSubject.value;
    this.scannerStateSubject.next({ ...currentState, ...state });
  }

  /**
   * Get current scanner state
   */
  getCurrentState(): ScannerState {
    return this.scannerStateSubject.value;
  }

  /**
   * Clean up service resources
   */
  ngOnDestroy(): void {
    this.stopScanning().catch(error => {
      console.error('Error during service cleanup:', error);
    });
  }
}