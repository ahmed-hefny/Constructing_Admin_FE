import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  Default_PAGINATION,
  SystemRoles,
} from "app/core/constants/app.constants";
import { AccessControlDirective } from "app/shared/directives/access-control.directive";
import { ToasterService } from "app/shared/services/toaster.service";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { PayloadConfig, PayloadsFiltration } from "./models/payloads.models";
import { PaginationConfig } from "app/core/models";
import { PayloadsService } from "./service/payloads.service";
import { PaginationComponent } from "app/shared/components/pagination/pagination.component";
import { finalize } from "rxjs";
import moment from "moment";
import { saveFile } from "app/shared/helpers/filesave";
import { ImageModule } from "primeng/image";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  CardModule,
  TableModule,
  TooltipModule,
  InputTextModule,
  CalendarModule,
  ButtonModule,
  PaginationComponent,
  ImageModule,
];

@Component({
  imports,
  selector: "app-payloads",
  templateUrl: "./payloads.component.html",
  styleUrl: "./payloads.component.scss",
})
export class PayloadsComponent implements OnInit {
  SystemRoles = SystemRoles;
  payloadConfig: PayloadConfig | null = null;
  data: any[] = [];
  pagination: PaginationConfig = Default_PAGINATION;
  inputForm!: FormGroup;
  isLoading: boolean = false;
  isExporting: boolean = false;
  shouldShowExportButton: boolean = false;
  shouldShowCreateButton: boolean = false;
  payloadsPerProject: boolean = false;
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private payloadsService: PayloadsService = inject(PayloadsService);
  private filtration: PayloadsFiltration = {
    policyNumber: undefined,
    dateFrom: undefined,
    dateTo: undefined,
  };

  private dateFormat: string = "YYYY-MM-DD";
  constructor() {
    this.initializeFilterForm();
  }

  ngOnInit(): void {
    this.loadPayloads();
    this.getData();
  }

  loadPayloads(): void {
    const { projectId, companyId } = this.activatedRoute.snapshot.params;
    if (!projectId && !companyId) {
      this.toaster.showError("معرف المشروع أو معرف الشركة مفقود");
      this.navigateBack();
      return;
    } else if (projectId && !companyId) {
      this.payloadsPerProject = true;
    }
    this.payloadConfig = { projectId, companyId };
    this.payloadsService.getProjectDetails(projectId).subscribe({
      next: (project) => {
        this.shouldShowCreateButton = !project.isDeleted;
      },
    });
  }

  navigateBack(): void {
    this.router.navigate(["/view", this.payloadConfig?.projectId || ""]);
  }

  create(): void {
    this.router.navigate(["upload"], { relativeTo: this.activatedRoute });
  }

  getData(): void {
    const payload = this.getPayloadFiltrationObject();
    this.payloadsService
      .getAll(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.data = res?.items || [];
          this.pagination = {
            ...this.pagination,
            totalRecords: res.count,
          };
        },
        error: (err) => {
          if(err.status !== 400) this.toaster.showError("فشل في تحميل الحمولات");
        },
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
      dateTo: new FormControl<Date | null>(null),
    });
  }

  onApplyFilter(): void {
    this.isLoading = true;
    const dateFrom = this.inputForm.value?.dateFrom
      ? moment(this.inputForm.value?.dateFrom).format(this.dateFormat)
      : undefined;
    const dateTo = this.inputForm.value?.dateTo
      ? moment(this.inputForm.value?.dateTo).add(1, "d").format(this.dateFormat)
      : undefined;
    if (dateFrom || dateTo) {
      this.shouldShowExportButton = true;
    } else if (!dateFrom && !dateTo) {
      this.shouldShowExportButton = false;
    }
    this.filtration = {
      policyNumber: this.inputForm.value?.policyNumber || undefined,
      dateFrom: dateFrom,
      dateTo: dateTo,
    };
    this.pagination.pageNumber = Default_PAGINATION.pageNumber; // Reset to first page on filter
    this.getData();
  }

  export(): void {
    const payload = this.getPayloadFiltrationObject();
    this.isExporting = true;
    this.payloadsService
      .exportPayloads(payload)
      .pipe(finalize(() => (this.isExporting = false)))
      .subscribe({
        next: (res) => {
          if (!(res instanceof Blob)) {
            this.toaster.showError("فشل في تصدير الحمولات");
            return;
          }
          let name = "الحمولات ";
          if (payload.dateFrom) name += `من ${payload.dateFrom} `;
          if (payload.dateTo) name += `إلى ${payload.dateTo} `;
          saveFile(res, name);
          this.toaster.showSuccess("تم تصدير الحمولات بنجاح");
        },
        error: (err) => {
          this.toaster.showError("فشل في تصدير الحمولات");
        },
      });
  }

  private getPayloadFiltrationObject() {
    return {
      pageNumber: this.pagination.pageNumber,
      pageSize: this.pagination.pageSize,
      ...this.filtration,
      ...this.payloadConfig,
    };
  }
}
