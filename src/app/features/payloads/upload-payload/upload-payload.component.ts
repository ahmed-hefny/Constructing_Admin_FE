import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PayloadsService } from '../service/payloads.service';
import { PayloadConfig } from '../models/payloads.models';
import { LOAD_WASM, NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { finalize, take } from 'rxjs';


LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();



const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  NgxScannerQrcodeComponent,


]
@Component({
  imports,
  selector: 'app-upload-payload',
  templateUrl: './upload-payload.component.html',
  styleUrl: './upload-payload.component.scss'
})
export class UploadPayloadComponent implements OnInit {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  payloadConfig: PayloadConfig | null = null;
  qrCodeConfig: ScannerQRCodeConfig = {
    isBeep: false,
    constraints: {
      video: {
        width: window?.innerWidth,
        facingMode: 'environment'
      }
    }
  }
  showScanner = true;
  result!: ScannerQRCodeSelectedFiles;


  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private qrCode: NgxScannerQrcodeService = inject(NgxScannerQrcodeService);
  private payloadsService: PayloadsService = inject(PayloadsService);

  constructor() {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.configurePage();
  }



  navigateBack(): void {
    if (!this.payloadConfig?.companyId || !this.payloadConfig?.projectId) return;
    this.router.navigate(['payloads', this.payloadConfig?.projectId, this.payloadConfig?.companyId]);
  }

  scannerActionTaken(scanner: NgxScannerQrcodeComponent): void {
    const policyNoControl = this.inputForm.get('policyNumber');

    if (scanner.isStart) {
      scanner.stop();

    } else {

      scanner.start().pipe(take(1)).subscribe({
        next: (result: ScannerQRCodeResult[]) => {
          if (policyNoControl) {
            policyNoControl?.disable();
            policyNoControl?.setValue('');
          }
        },
        error: (error) => {
          this.toaster.showError('Error starting scanner: ' + error.message);
          policyNoControl?.enable();
        }
      })
    }
  }

  onSaveClick(): void {
    this.isLoading = true;
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 500)
    console.log({
      ...this.inputForm.getRawValue(),
      ...this.payloadConfig
    })
  }

  onScan(result: ScannerQRCodeResult[], scanner: NgxScannerQrcodeComponent): void {

    if (Array.isArray(result) && result.length > 0) {
      const scannedData = result[0].value;
      const policyNoControl = this.inputForm.get('policyNumber');
      this.inputForm.patchValue({ policyNumber: scannedData });
      policyNoControl?.disable();
      policyNoControl?.setValue(scannedData);
      if (scanner) {
        setTimeout(() => {
          scanner.stop();
        }, 500);
      }
      if (result[0].data) {
        const uint8Array = new Uint8Array(result[0].data);
        const blob = new Blob([uint8Array], { type: 'image/png' });
        const file = new File([blob], `scanned-image-${Date.now()}.png`, {
          type: 'image/png',
          lastModified: Date.now()
        });
        this.inputForm.patchValue({ image: file });
      }
    }
  }

  onEditPolicyNo(): void {
    const policyNoControl = this.inputForm.get('policyNumber');
    if (policyNoControl) {
      policyNoControl.enable();
      policyNoControl.setValue('');
      // Focus the input field
      setTimeout(() => {
        const inputElement = document.getElementById('policyNumber') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
      }, 0);
    }
  }

  onUploadPolicyNoImage(files: any): void {
    this.showScanner = false;

    this.qrCode.loadFiles(files)
      .pipe(
        take(1),  // Ensure we only take the first emission
        finalize(() => {
          this.showScanner = true;
        })
      )
      .subscribe({
        next: (result: ScannerQRCodeSelectedFiles[]) => {
          if (result && result.length > 0) {
            const file = result[0].file;
            this.inputForm.patchValue({ image: file });
            this.result = result[0];
          }
        },
        error: (error) => {
          this.toaster.showError('Error loading files: ' + error.message);
        }
      });
  }

  private configurePage(): void {
    const { projectId, companyId } = this.activatedRoute.snapshot.params;
    if (!projectId || !companyId) {
      this.toaster.showError('Project ID or Company ID is missing');
      this.navigateBack();
      return;
    }
    this.payloadConfig = { projectId, companyId };
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      qnt: new UntypedFormControl('', [Validators.required, Validators.min(1)]),
      policyNumber: new UntypedFormControl({ value: '', disabled: true }, [Validators.required]),
      image: new UntypedFormControl(null),
    });
  }
}
