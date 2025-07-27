import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Default_PAGINATION, SystemRoles } from 'app/core/constants/app.constants';
import { AccessControlDirective } from 'app/shared/directives/access-control.directive';
import { ToasterService } from 'app/shared/services/toaster.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { PayloadConfig } from './models/payloads.models';
import { PaginationConfig } from 'app/core/models';
import { PayloadsService } from './service/payloads.service';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  CardModule,
  TableModule,
  AccessControlDirective,
  TooltipModule,
  InputTextModule,
  CalendarModule,
  ButtonModule,
  PaginationComponent
]

@Component({
  imports,
  selector: 'app-payloads',
  templateUrl: './payloads.component.html',
  styleUrl: './payloads.component.scss'
})
export class PayloadsComponent implements OnInit {
  SystemRoles = SystemRoles;
  payloadConfig: PayloadConfig | null = null;
  data: any[] = [];
  pagination: PaginationConfig = Default_PAGINATION;
  inputForm!: FormGroup;
  isLoading: boolean = false;
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private payloadsService: PayloadsService = inject(PayloadsService);

  constructor() {
    this.initializeFilterForm();
  }

  ngOnInit(): void {
    this.loadPayloads();
    this.getData();
  }

  loadPayloads(): void {
    const { projectId, companyId } = this.activatedRoute.snapshot.params;
    if (!projectId || !companyId) {
      this.toaster.showError('معرف المشروع أو معرف الشركة مفقود');
      this.navigateBack();
      return;
    }
    this.payloadConfig = { projectId, companyId };
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

  create(): void {
    this.router.navigate(['upload'], { relativeTo: this.activatedRoute });
  }

  getData(): void {
    const payload = {
      pageNumber: this.pagination.pageNumber,
      pageSize: this.pagination.pageSize,
    }
    this.payloadsService.getAll(payload).subscribe({
      next: (res) => {
        this.data = res.items;
        this.pagination = {
          ...this.pagination,
          totalRecords: res.count,
        };
      },
      error: (err) => {
        this.toaster.showError('فشل في تحميل الحمولات');
      }
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.pageSize = event.pageSize;
    this.getData();
  }

  private initializeFilterForm(): void {
    this.inputForm = new FormGroup({
      policyNumber: new FormControl<string | null>(null),
      dateFrom: new FormControl<Date | null>(null),
      dateTo: new FormControl<Date | null>(null)
    });
  }

  onApplyFilter(): void {
    this.isLoading = true;
    console.log('Filter values:', this.inputForm.value);
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
