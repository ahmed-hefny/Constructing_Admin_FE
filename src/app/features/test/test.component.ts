import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LOAD_WASM, NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';

LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();

const imports = [
  CommonModule,
  ZXingScannerModule,
  NgxScannerQrcodeComponent,
  ToggleButtonModule,
  FormsModule,
  ReactiveFormsModule
]

@Component({
  imports,
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODABAR, BarcodeFormat.CODE_128];
  value: string = '';
  public isZingScannerPackage: boolean = true
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public result: any[] = []
  public qrCodeConfig: ScannerQRCodeConfig = {
    isBeep: false,
    constraints: {
      audio: false,
      video: {
        facingMode: 'environment', // Use back camera
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    

  }
  constructor(private qrcode: NgxScannerQrcodeService) { }
  print(event: string, data: any): void {
    console.log(event, data);
    if (typeof data === 'string') this.value = data;
  }


  public onSelects(files: any) {
    this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
      this.result = structuredClone(res)
    });
  }

  addValue(index: number, data: ScannerQRCodeResult[]): void {
    console.log(this.result)
    this.result[index] = {
      ...this.result[index],
      data: data[0]
    }
  }
}
