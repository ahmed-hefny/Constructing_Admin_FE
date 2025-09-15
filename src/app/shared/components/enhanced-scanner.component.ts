import { 
  Component, 
  OnInit, 
  AfterViewInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EnhancedScannerService, ScanResult, ScannerState } from '../services/enhanced-scanner.service';

@Component({
  selector: 'app-enhanced-scanner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="enhanced-scanner-container">
      <h2 class="text-center">Enhanced Barcode Scanner POC using AI</h2>
      
      <!-- Scanner Status -->
      <div class="status-section">
        <div class="status-indicator" [ngClass]="{
          'status-scanning': scannerState.isScanning,
          'status-ready': scannerState.hasCamera && !scannerState.isScanning,
          'status-error': scannerState.error
        }">
          @switch (true) {
            @case (scannerState.isScanning) {
              <span>🔍 Scanning for barcodes...</span>
            }
            @case (scannerState.hasCamera && !scannerState.isScanning) {
              <span>📷 Camera ready</span>
            }
            @case (!!scannerState.error) {
              <span>❌ {{ scannerState.error }}</span>
            }
            @default {
              <span>⏳ Initializing...</span>
            }
          }
        </div>
      </div>

      <!-- Scanner Area -->
      <div class="scanner-section">
        <div class="scanner-wrapper">
          <div id="reader" #readerElement class="scanner-viewport"></div>
          <div class="scanner-overlay">
            <div class="scan-frame"></div>
            <p class="scan-instructions">
              Point your camera at a barcode or QR code
            </p>
          </div>
        </div>

        <!-- Preview Canvas (shows enhanced frames) -->
        <div class="preview-section">
          <h4>Enhanced Frame Preview</h4>
          <canvas 
            #previewCanvas 
            class="preview-canvas"
            width="300" 
            height="200">
          </canvas>
          <p class="preview-info">
            TensorFlow.js enhanced frames for better detection
          </p>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <button 
          class="btn btn-primary"
          [disabled]="scannerState.isScanning"
          (click)="startScanning()">
          {{ scannerState.isScanning ? 'Scanning...' : 'Start Scanner' }}
        </button>
        
        <button 
          class="btn btn-secondary"
          [disabled]="!scannerState.isScanning"
          (click)="stopScanning()">
          Stop Scanner
        </button>
      </div>

      <!-- Results Section -->
      @if (lastResult) {
        <div class="results-section">
          <h3>Latest Scan Result</h3>
          <div class="result-card" [ngClass]="{
            'result-enhanced': lastResult.enhanced,
            'result-live': !lastResult.enhanced
          }">
            <div class="result-header">
              <strong>{{ lastResult.decodedText }}</strong>
              <span class="result-badge">
                {{ lastResult.enhanced ? '🚀 Enhanced' : '📹 Live' }}
              </span>
            </div>
            <div class="result-details">
              <p><strong>Format:</strong> {{ lastResult.formatName || 'Unknown' }}</p>
              <p><strong>Time:</strong> {{ lastResult.timestamp | date:'medium' }}</p>
              <p><strong>Source:</strong> 
                {{ lastResult.enhanced ? 'TensorFlow.js Enhanced Frame' : 'Live Video Stream' }}
              </p>
            </div>
          </div>
        </div>
      }

      <!-- Scan History -->
      @if (scanHistory.length > 0) {
        <div class="history-section">
          <h4>Scan History</h4>
          <div class="history-list">
            @for (result of scanHistory; track result.timestamp; let i = $index) {
              <div 
                class="history-item"
                [ngClass]="{ 'history-enhanced': result.enhanced }">
                <span class="history-text">{{ result.decodedText }}</span>
                <span class="history-time">{{ result.timestamp | date:'short' }}</span>
                <span class="history-source">
                  {{ result.enhanced ? '🚀' : '📹' }}
                </span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .enhanced-scanner-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .status-section {
      margin-bottom: 20px;
    }

    .status-indicator {
      padding: 12px 20px;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .status-scanning {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      animation: pulse 2s infinite;
    }

    .status-ready {
      background: linear-gradient(135deg, #2196F3, #1976D2);
      color: white;
    }

    .status-error {
      background: linear-gradient(135deg, #f44336, #d32f2f);
      color: white;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .scanner-section {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 20px;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .scanner-section {
        grid-template-columns: 1fr;
      }
    }

    .scanner-wrapper {
      position: relative;
      background: #f5f5f5;
      border-radius: 12px;
      overflow: hidden;
      min-height: 200px;
    }

    #reader {
      width: 100%;
      height: 100%;
    }

    .scanner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .scan-frame {
      width: 300px;
      height: 100px;
      border: 2px solid #4CAF50;
      border-radius: 12px;
      background: transparent;
      position: relative;
    }

    .scan-frame::before,
    .scan-frame::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(76, 175, 80, 0.3);
      animation: scanLine 2s linear infinite;
    }

    .scan-frame::before {
      width: 100%;
      height: 2px;
    }

    .scan-frame::after {
      width: 2px;
      height: 100%;
      animation-delay: 1s;
    }

    @keyframes scanLine {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    .scan-instructions {
      margin-top: 20px;
      color: #666;
      text-align: center;
      background: rgba(255, 255, 255, 0.9);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
    }

    .preview-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e0e0e0;
    }

    .preview-section h4 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }

    .preview-canvas {
      width: 100%;
      height: auto;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .preview-info {
      margin: 10px 0 0 0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    .controls-section {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      justify-content: center;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #757575, #616161);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(117, 117, 117, 0.3);
    }

    .results-section {
      margin-bottom: 30px;
    }

    .result-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .result-enhanced {
      border-left: 4px solid #FF9800;
    }

    .result-live {
      border-left: 4px solid #2196F3;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .result-header strong {
      font-size: 18px;
      color: #333;
    }

    .result-badge {
      background: #f0f0f0;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .result-details p {
      margin: 8px 0;
      color: #666;
      font-size: 14px;
    }

    .history-section h4 {
      color: #333;
      margin-bottom: 15px;
    }

    .history-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .history-enhanced {
      background: rgba(255, 152, 0, 0.05);
    }

    .history-text {
      font-weight: 500;
      color: #333;
    }

    .history-time {
      font-size: 12px;
      color: #666;
    }

    .history-source {
      font-size: 16px;
    }
  `]
})
export class EnhancedScannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('readerElement') readerElement!: ElementRef;
  @ViewChild('previewCanvas') previewCanvas!: ElementRef<HTMLCanvasElement>;

  scannerState: ScannerState = {
    isScanning: false,
    hasCamera: false
  };

  lastResult: ScanResult | null = null;
  scanHistory: ScanResult[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private enhancedScannerService: EnhancedScannerService) {}

  ngOnInit(): void {
    // Subscribe to scanner state changes
    this.subscriptions.push(
      this.enhancedScannerService.scannerState$.subscribe((state: ScannerState) => {
        this.scannerState = state;
      })
    );

    // Subscribe to scan results
    this.subscriptions.push(
      this.enhancedScannerService.scanResult$.subscribe((result: ScanResult) => {
        this.lastResult = result;
        this.scanHistory.unshift(result);
        
        // Keep only last 10 results
        if (this.scanHistory.length > 10) {
          this.scanHistory = this.scanHistory.slice(0, 10);
        }

        // Show enhanced frame in preview canvas
        this.showResultNotification(result);
      })
    );
  }

  ngAfterViewInit(): void {
    // Auto-start scanning after view initialization
    setTimeout(() => {
      this.startScanning();
    }, 500);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Stop scanning
    this.stopScanning();
  }

  async startScanning(): Promise<void> {
    try {
      await this.enhancedScannerService.startScanning('reader');
    } catch (error) {
      console.error('Failed to start scanning:', error);
    }
  }

  async stopScanning(): Promise<void> {
    try {
      await this.enhancedScannerService.stopScanning();
    } catch (error) {
      console.error('Failed to stop scanning:', error);
    }
  }

  private showResultNotification(result: ScanResult): void {
    // Visual feedback for successful scan
    if (this.previewCanvas?.nativeElement) {
      const canvas = this.previewCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Flash green to indicate successful scan
        ctx.fillStyle = result.enhanced ? '#FF9800' : '#4CAF50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 300);
      }
    }

    // You could also add a toast notification here
    console.log('🎉 Barcode detected:', result.decodedText);
  }
}