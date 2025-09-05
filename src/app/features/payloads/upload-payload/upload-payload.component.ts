import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToasterService } from "app/shared/services/toaster.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PayloadsService } from "../service/payloads.service";
import { PayloadConfig } from "../models/payloads.models";
import { finalize } from "rxjs";
import { Suppliers } from "app/core/constants/app.constants";
import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  Html5QrcodeResult,
  Html5QrcodeScannerState,
} from "html5-qrcode";
import { DropdownModule } from "primeng/dropdown";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  DropdownModule,
];

@Component({
  imports,
  selector: "app-upload-payload",
  templateUrl: "./upload-payload.component.html",
  styleUrl: "./upload-payload.component.scss",
})
export class UploadPayloadComponent implements OnInit, OnDestroy {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  payloadConfig: PayloadConfig | null = null;

  cameraDevices: CameraDevice[] = [];
  cameraConfig: Html5QrcodeCameraScanConfig = {
    fps: 10,
    qrbox: { width: 250, height: 200 },
    aspectRatio: 1.777778,
  };
  selectedCamera = new FormControl<string | null>(null);
  showCameraDevicesDropDown = false;
  html5QrCode?: Html5Qrcode;
  scanState: typeof Html5QrcodeScannerState = Html5QrcodeScannerState;
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private payloadsService: PayloadsService = inject(PayloadsService);

  constructor() {}

  ngOnInit(): void {
    this.initializeForm();
    this.configurePage();
    this.getCameraDevices();
  }

  ngOnDestroy(): void {
    if (this.html5QrCode && this.html5QrCode.isScanning) {
      this.html5QrCode
        .stop()
        .catch((err) => console.error("خطأ فى ايقاف الكاميرا:", err));
    }
  }

  navigateBack(): void {
    if (!this.payloadConfig?.companyId || !this.payloadConfig?.projectId)
      return;
    this.router.navigate([
      "payloads",
      this.payloadConfig?.projectId,
      this.payloadConfig?.companyId,
    ]);
  }

  async getCameraDevices() {
    this.html5QrCode = new Html5Qrcode("reader");
    try {
      const devices = await Html5Qrcode?.getCameras();
      if (devices && devices.length) {
        this.cameraDevices = devices;
        this.selectedCamera.setValue(
          devices.find((device) => device.label.toLowerCase().includes("back"))
            ?.id || devices[0].id
        );
        this.showCameraDevicesDropDown = false;
        this.startCamera();
      }
    } catch (error) {
      this.showCameraDevicesDropDown = true;
      this.toaster.showError("خطأ في الحصول على أجهزة الكاميرا");
    }
  }

  startCamera() {
    if (this.html5QrCode && this.selectedCamera.value) {
      this.resetPolicyNumber();
      this.html5QrCode?.clear();
      this.showCameraDevicesDropDown = false;
      this.html5QrCode.start(
        this.selectedCamera.value || { facingMode: "environment" },
        this.cameraConfig,
        (decodedText, file) => {
          this.editPolicyNumberValue(file);
          this.html5QrCode?.pause(true);
          this.showCameraDevicesDropDown = true;
        },
        (errorMsg) => {
          // scanning errors are ignored
        }
      );
    }
  }

  stopCamera() {
    this.resetPolicyNumber();
    this.showCameraDevicesDropDown = true;
    this.html5QrCode?.stop();
  }

  resumeCamera() {
    this.resetPolicyNumber();
    this.showCameraDevicesDropDown = false;
    this.html5QrCode?.resume();
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
      ...this.payloadConfig,
    };
    const formData = new FormData();
    Object.entries(payload).map(([k, v]) => {
      formData.append(k, v as any);
    });
    this.payloadsService
      .create(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.toaster.showSuccess("تم رفع الحمولة بنجاح");
          this.inputForm.reset();
          this.navigateBack();
        },
        error: (error) => {
          console.error("Error uploading payload:", error);
          this.toaster.showError("خطأ في رفع الحمولة: " + error.message);
        },
      });
  }

  editPolicyNumberValue(file: Html5QrcodeResult): void {
    const isQrCode = file.result.format?.formatName
      ?.toLowerCase()
      ?.includes("qr");

    this.inputForm.patchValue({
      policyNumber: file?.decodedText,
      supplier: isQrCode ? Suppliers.Banisuef : Suppliers.Arish,
    });
  }

  getScannerAction(): void {
    const state = this.html5QrCode?.getState();
    switch (state) {
      case this.scanState.PAUSED:
      this.resumeCamera();
      break;
      case this.scanState.SCANNING:
      this.stopCamera();
      break;
      default:
      this.startCamera();
      break;
    }
  }

  /**
   * Returns the appropriate label for the scanner action button based on the current state.
   */
  getScannerLabel(): string {
    const state = this.html5QrCode?.getState();
    switch (state) {
      case this.scanState.PAUSED:
      return "استئناف المسح";
      case this.scanState.SCANNING:
      return "إيقاف الكاميرا";
      default:
      return "بدء المسح";
    }
  }

  onEditPolicyNo(): void {
    const policyNoControl = this.inputForm.get("policyNumber");
    if (policyNoControl) {
      policyNoControl.enable();
      policyNoControl.setValue("");
      // Focus the input field
      setTimeout(() => {
        const inputElement = document.getElementById(
          "policyNumber"
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
      }, 0);
    }
  }

  onUploadImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.inputForm.get("image")?.setValue(file);
    } else {
      this.inputForm.get("image")?.setValue(null);
    }
  }

  private configurePage(): void {
    const { projectId, companyId } = this.activatedRoute.snapshot.params;
    if (!projectId || !companyId) {
      this.toaster.showError("معرف المشروع أو معرف الشركة مفقود");
      this.navigateBack();
      return;
    }
    this.payloadConfig = { projectId, companyId };
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      quantity: new UntypedFormControl("", [
        Validators.required,
        Validators.min(1),
      ]),
      policyNumber: new UntypedFormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      image: new UntypedFormControl(null, [Validators.required]),
      supplier: new FormControl<Suppliers>(Suppliers.Banisuef),
    });
  }

  private resetPolicyNumber() {
    this.inputForm.patchValue({
      policyNumber: null,
      supplier: Suppliers.Banisuef,
    });
  }
}
