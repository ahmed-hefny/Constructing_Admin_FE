import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { CompanyResponse } from 'app/shared/models/company.models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProjectsService } from '../service/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { finalize } from 'rxjs';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  PasswordModule,
  MultiSelectModule,
  ButtonModule,
  CardModule,

]
@Component({
  selector: 'app-add-edit-project',
  imports,
  templateUrl: './add-edit-project.component.html',
  styleUrl: './add-edit-project.component.scss'
})
export class AddEditProjectComponent {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  companies: CompanyResponse[] = [];
  editMode: boolean = false;
  id: string | null = null;

  private projectsService: ProjectsService = inject(ProjectsService);
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.initializeForm();
    this.getCompanies();
    this.processEditMode();
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

  getCompanies(): void {
    this.projectsService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies
      },
      error: (error) => {
        this.toaster.showError('Failed to load companies');
      }
    });
  }

  onSaveClick(): void {
    this.isLoading = true;
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    const payload = this.inputForm.value;
    if(this.editMode) {
      payload['id'] = this.id;
    }
    const action = this.editMode ? this.projectsService.update(payload) : this.projectsService.create(payload);
    action.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        const message = `Project ${this.editMode ? 'updated' : 'created'} successfully`;
        this.toaster.showSuccess(message);
        this.navigateBack();
      }
    });
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      companiesIdsList: new FormControl<string[] | null>(null, [Validators.required]),
    });
  }

  private processEditMode(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.editMode = true;
      this.projectsService.getById(this.id).subscribe({
        next: (project) => {
          this.inputForm.patchValue({ ...project , companiesIdsList: project?.companyList?.map(c => c.id) });
        },
        error: (error) => {
          this.toaster.showError('Failed to load project data');
        }
      });
    }
  }
}
