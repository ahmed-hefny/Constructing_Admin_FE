import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CompaniesService } from '../service/companies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { finalize } from 'rxjs';


const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  CardModule,
]
@Component({
  selector: 'app-add-edit-company',
  imports,
  templateUrl: './add-edit-company.component.html',
  styleUrl: './add-edit-company.component.scss'
})
export class AddEditCompanyComponent {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  editMode: boolean = false;


  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private companiesService: CompaniesService = inject(CompaniesService);

  constructor() {
    this.initializeForm();
    this.processEditMode();
  }

  navigateBack(): void {
    this.router.navigate(['companies']);
  }

  onSaveClick(): void {
    this.isLoading = true;
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    const payload = this.inputForm.value;
    const action = this.editMode ? this.companiesService.update(payload) : this.companiesService.create(payload);
    action.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        const message = `user ${this.editMode ? 'updated' : 'created'} successfully`;
        this.toaster.showSuccess(message);
        this.navigateBack();
      }
    })
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      id: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    });
  }

  private processEditMode(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      const name = this.activatedRoute.snapshot.queryParamMap.get('name');
      this.inputForm.patchValue({
        id: +id || null,
        name: name || null
      });
    } 
  }
}
