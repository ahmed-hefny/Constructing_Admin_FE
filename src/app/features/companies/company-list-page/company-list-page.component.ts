import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Company } from '../models/companies.models';
import { Router } from '@angular/router';
import { CompaniesService } from '../service/companies.service';
import { Default_PAGINATION } from 'app/core/constants/app.constants';
import { PaginationConfig } from 'app/core/models';
import { ToasterService } from 'app/shared/services/toaster.service';
import { DialogService } from 'app/shared/services/dialog.service';
import { ConfirmDialogConfig } from 'app/shared/models/dialog.models';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';

const imports = [
  ButtonModule,
  CardModule,
  TableModule,
  PaginationComponent
]

@Component({
  imports,
  selector: 'app-company-list-page',
  templateUrl: './company-list-page.component.html',
  styleUrl: './company-list-page.component.scss'
})
export class CompanyListPageComponent implements OnInit {

  public data: Company[] = [];
  public pagination: PaginationConfig = Default_PAGINATION;
  private companiesService: CompaniesService = inject(CompaniesService);
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private dialogService: DialogService = inject(DialogService);
  ngOnInit(): void {
    this.getData();
  }

  addNew(): void {
    this.router.navigate(['companies', 'create'], { relativeTo: this.router.routerState.root });
  }

  editItem(company: Company): void {
    this.router.navigate(['companies', 'edit', company.id], { relativeTo: this.router.routerState.root, queryParams: { name: company.name } });
  }

  deleteCompany(id: number): void {
    this.companiesService.delete(id).subscribe({
      next: () => {
        this.getData();
        this.toaster.showSuccess('تم حذف الشركة بنجاح');
      },
      error: (err) => {
        this.toaster.showError('فشل في حذف الشركة', err);
      }
    });
  }

  confirmDelete(id: number): void {
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
      message: 'هل أنت متأكد من أنك تريد حذف هذه الشركة؟',
      onAccept: () => {
        this.deleteCompany(id);
      }
    }
    this.dialogService.confirmDialog(config);
  }

  getData(): void {
    this.companiesService.getAllCompanies(this.pagination).subscribe({
      next: (res) => {
        this.data = res.items;
        this.pagination = {
          ...this.pagination,
          totalRecords: res.count,
        };

      },
      error: (err) => {
        this.toaster.showError('فشل في تحميل الشركات', err);
      }
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.pageSize = event.pageSize;
    this.getData();
  }
}
