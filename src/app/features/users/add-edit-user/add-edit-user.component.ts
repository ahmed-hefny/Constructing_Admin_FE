import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SYSTEM_ROLES_OPTIONS, SystemRoles } from 'app/core/constants/app.constants';
import { UsersService } from '../service/users.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ToasterService } from 'app/shared/services/toaster.service';
import { CompanyResponse } from 'app/shared/models/company.models';
import { AuthService } from 'app/core/services';


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
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class CreateUserComponent {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  systemRoles = SYSTEM_ROLES_OPTIONS;
  ROLES_ENUM: typeof SystemRoles = SystemRoles;
  companies: CompanyResponse[] = [];
  editMode: boolean = false;


  private router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  constructor() {
    this.initializeForm();
    this.listenToRoleChanges();
    this.processEditMode();
    const role = this.authService.user()?.role;
    if (role !== SystemRoles.ADMIN) {
      this.systemRoles = this.systemRoles.filter(r => r.value === SystemRoles.EMPLOYEE);
    }
  }

  navigateBack(): void {
    this.router.navigate(['users']);
  }
  getCompanies(): void {
    this.usersService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies
      },
      error: (error) => {
        this.toaster.showError('فشل في تحميل الشركات');
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
    const action = this.editMode ? this.usersService.update(payload) : this.usersService.create(payload);
    action.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        const message = `تم ${this.editMode ? 'تحديث' : 'إنشاء'} المستخدم بنجاح`;
        this.toaster.showSuccess(message);
        this.navigateBack();
      }
    })
  }

  private processEditMode(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.usersService.getUserById(id).subscribe({
        next: (user) => {
          console.log({ user });
          this.inputForm.patchValue(user);
          this.inputForm.get('password')?.setValidators([]);
          this.inputForm.get('password')?.updateValueAndValidity();
        },
        error: (error) => {
          this.toaster.showError('فشل في تحميل بيانات المستخدم');
        }
      });
    }
  }

  private listenToRoleChanges(): void {
    const roleControl = this.inputForm.get('role');
    if (roleControl) {
      roleControl.valueChanges.subscribe((value: SystemRoles | null) => {
        const companyIdControl = this.inputForm.get('companyId');
        companyIdControl?.setValue(null);
        if (value === SystemRoles.EMPLOYEE && this.companies?.length === 0) {
          this.getCompanies();
        }
      });
    }
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      id: new FormControl<number | null>(null),
      username: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      role: new FormControl<SystemRoles | null>(null, [Validators.required]),
      companyId: new UntypedFormControl(null, [CreateUserComponent.companyIdValidator()]),
    });
  }

  static companyIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const form = control.parent;
      if (!form) {
        return null;
      }
      const roleControl = form.get('role');
      if (roleControl && roleControl.value === SystemRoles.EMPLOYEE && !value) {
        return { required: true };
      }
      return null;
    };
  }
}
