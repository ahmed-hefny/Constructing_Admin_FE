import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PayloadsService } from '../service/payloads.service';
import { PayloadConfig } from '../models/payloads.models';


const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  PasswordModule,
  DropdownModule,
  ButtonModule,
  CardModule,
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
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
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

  onSaveClick(): void {
    this.isLoading = true;
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    console.log(this.inputForm.value)
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
    });
  }
}
