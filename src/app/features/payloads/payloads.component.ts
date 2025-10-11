import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  Default_PAGINATION,
  SystemRoles,
} from "app/core/constants/app.constants";
import { ToasterService } from "app/shared/services/toaster.service";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { Payload, PayloadConfig, PayloadsFiltration } from "./models/payloads.models";
import { PaginationConfig } from "app/core/models";
import { PayloadsService } from "./service/payloads.service";
import { PaginationComponent } from "app/shared/components/pagination/pagination.component";
import { finalize } from "rxjs";
import moment from "moment";
import { saveFile } from "app/shared/helpers/filesave";
import { ImageModule } from "primeng/image";
import { Project } from "app/shared/models/company.models";
import { DialogModule } from "primeng/dialog";
import { GalleriaModule } from "primeng/galleria";
import { AccessControlDirective } from "app/shared/directives/access-control.directive";
import { ConfirmDialogConfig } from "app/shared/models/dialog.models";
import { DialogService } from "app/shared/services/dialog.service";

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
  DialogModule,
  GalleriaModule,
  AccessControlDirective
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
  data: Payload[] = [];
  pagination: PaginationConfig = Default_PAGINATION;
  inputForm!: FormGroup;
  isLoading: boolean = false;
  isExporting: boolean = false;
  shouldShowExportButton: boolean = false;
  shouldShowCreateButton: boolean = false;
  payloadsPerProject: boolean = false;
  project: Project | null = null;

  todayMaxDate: Date = moment().toDate();
  policyNumberImages: string[] = [];
  visible: boolean = false;
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private dialogService: DialogService = inject(DialogService);
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
        this.project = project;
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
    this.policyNumberImages = [];
    this.payloadsService
      .getAll(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.data = res?.items || [];
          this.policyNumberImages = this.data
            ?.filter((item) => item?.image)
            .map((item) => item?.image);
          this.pagination = {
            ...this.pagination,
            totalRecords: res.count,
          };
        },
        error: (err) => {
          if (err.status !== 400)
            this.toaster.showError("فشل في تحميل الحمولات");
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
    const policyNumber = this.inputForm.value?.policyNumber;
    let dateFrom =
      this.inputForm.value?.dateFrom &&
      moment(this.inputForm.value?.dateFrom).format(this.dateFormat);
    let dateTo =
      this.inputForm.value?.dateTo &&
      moment(this.inputForm.value?.dateTo).add(1, "d").format(this.dateFormat);

    if (dateFrom || dateTo) {
      this.shouldShowExportButton = true;
    } else if (!dateFrom && !dateTo) {
      this.shouldShowExportButton = false;
    }

    if (policyNumber) {
      dateFrom = undefined;
      dateTo = undefined;
      this.inputForm.patchValue(
        { dateFrom: null, dateTo: null },
        { emitEvent: false }
      );
      this.shouldShowExportButton = false;
    }
    this.filtration = {
      policyNumber,
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

  openGallery(): void {
    this.visible = true;
  }

  edit(payloadId: number): void {
    if (!payloadId) {
      this.toaster.showError("معرف الحمولة مفقود يرحى المحاولة مرة اخرى");
      return;
    }
    this.router.navigate(
      ["edit", payloadId],
      { relativeTo: this.activatedRoute }
    );
  }

  confirmDelete(payload: Payload): void {
    const config: ConfirmDialogConfig = {
      header: 'تأكيد',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-error',
      rejectButtonStyleClass: 'btn btn-accent mr-2',
      acceptLabel: 'حذف',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'إلغاء',
      rejectIcon: 'pi pi-times',
      message: `هل أنت متأكد من أنك تريد حذف حمولة رقم ${payload?.policyNumber}؟`,
      onAccept: () => {
        this.delete(payload.id);
      }
    }
    this.dialogService.confirmDialog(config);
  }
  delete(payloadId: number = 1): void {

    this.payloadsService.delete(payloadId).subscribe({
      next: () => {
        this.toaster.showSuccess("تم حذف الحمولة بنجاح");
        this.getData();
      },
      error: () => {
        this.toaster.showError("فشل في حذف الحمولة");
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
