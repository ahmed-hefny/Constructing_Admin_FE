import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-create-user',
  imports,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
  standalone: true,
})
export class CreateUserComponent {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  systemRoles = SYSTEM_ROLES_OPTIONS;
  ROLES_ENUM: typeof SystemRoles = SystemRoles;
  companies = [
    { label: 'Company 1', value: 1 },
    { label: 'Company 2', value: 2 },
    { label: 'Company 3', value: 3 }
  ];
  editMode: boolean = false;


  private router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  private toaster: ToasterService = inject(ToasterService);
  constructor() {
    this.initializeForm();
    this.listenToRoleChanges();
  }
  navigateBack(): void {
    this.router.navigate(['users']);
  }

  onSaveClick(): void {
    this.isLoading = true;
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    this.usersService.create(this.inputForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: (response) => {
          this.toaster.showSuccess('User created successfully');
          this.navigateBack();
        }
      })
  }

  private listenToRoleChanges(): void {
    const roleControl = this.inputForm.get('role');
    if (roleControl) {
      roleControl.valueChanges.subscribe((value: SystemRoles | null) => {
        const companyIdControl = this.inputForm.get('companyId');
        companyIdControl?.setValue(null);
      });
    }
  }

  private initializeForm(): void {
    this.inputForm = new UntypedFormGroup({
      username: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
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
