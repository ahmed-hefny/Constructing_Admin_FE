import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PayloadsService } from '../service/payloads.service';
import { PayloadConfig } from '../models/payloads.models';
import { LOAD_WASM, NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { finalize, take } from 'rxjs';
import { Suppliers } from 'app/core/constants/app.constants';


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
  result: ScannerQRCodeSelectedFiles | null = null;


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
          this.toaster.showError('خطأ في بدء الماسح الضوئي: ' + error.message);
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
    const payload = {
      ...this.inputForm.getRawValue(),
      ...this.payloadConfig
    }
    const formData = new FormData();
    Object.entries(payload).map(([k, v]) => {
      formData.append(k, v as any);
    })
    this.payloadsService.create(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.toaster.showSuccess('تم رفع الحمولة بنجاح');
          this.inputForm.reset();
          this.navigateBack();
        },
        error: (error) => {
          console.error('Error uploading payload:', error);
          this.toaster.showError('خطأ في رفع الحمولة: ' + error.message);
        }
      });
  }

  onScan(result: ScannerQRCodeResult[], scanner: NgxScannerQrcodeComponent): void {

    if (Array.isArray(result) && result.length > 0) {
      const type = result[0]?.typeName
      const scannedData = result[0].value;
      const policyNoControl = this.inputForm.get('policyNumber');
      this.inputForm.patchValue({ policyNumber: scannedData });
      policyNoControl?.disable();
      policyNoControl?.setValue(scannedData);
      if (type) {
        this.inputForm.patchValue({ supplier: (type.toLowerCase().includes('qr') ? Suppliers.Banisuef : Suppliers.Arish) });
      }
      if (scanner) {
        setTimeout(() => {
          scanner.pause();
          scanner.isStart = false;
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
    this.result = null;

    this.qrCode.loadFiles(files)
      .pipe(
        take(1),  // Ensure we only take the first emission
      )
      .subscribe({
        next: (result: ScannerQRCodeSelectedFiles[]) => {
          if (result && result.length > 0) {
            this.inputForm.patchValue({ image: result[0].file });
            this.result = result[0];
          }
          console.log({values: this.inputForm.value})
        },
        error: (error) => {
          this.toaster.showError('خطأ في تحميل الملفات: ' + error.message);
        }
      });
  }

  private configurePage(): void {
    const { projectId, companyId } = this.activatedRoute.snapshot.params;
    if (!projectId || !companyId) {
      this.toaster.showError('معرف المشروع أو معرف الشركة مفقود');
      this.navigateBack();
      return;
    }
    this.payloadConfig = { projectId, companyId };
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      quantity: new UntypedFormControl('', [Validators.required, Validators.min(1)]),
      policyNumber: new UntypedFormControl({ value: '', disabled: true }, [Validators.required]),
      image: new UntypedFormControl(null, [Validators.required]),
      supplier: new FormControl<Suppliers>(Suppliers.Banisuef),
      shippingName: new FormControl<string | null>(null),
    });
  }
}
