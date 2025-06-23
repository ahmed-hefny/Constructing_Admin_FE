import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Company } from '../models/companies.models';
import { Router } from '@angular/router';
import { CompaniesService } from '../service/companies.service';
import { Default_PAGINATION } from 'app/core/constants/app.constants';
import { PaginationRequest } from 'app/core/models';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmationService } from 'primeng/api';

const imports = [
  ButtonModule,
  CardModule,
  TableModule
]

@Component({
  selector: 'app-company-list-page',
  imports,
  templateUrl: './company-list-page.component.html',
  styleUrl: './company-list-page.component.scss'
})
export class CompanyListPageComponent implements OnInit {

  public data: Company[] = [];

  private companiesService: CompaniesService = inject(CompaniesService);
  private pagination: PaginationRequest = Default_PAGINATION;
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

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
        this.toaster.showSuccess('Company deleted successfully');
      },
      error: (err) => {
        this.toaster.showError('Failed to delete company', err);
      }
    });
  }

  confirmDelete(userId: number): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-error',
      rejectButtonStyleClass: 'btn btn-accent mr-2',
      acceptLabel: 'Delete',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Cancel',
      rejectIcon: 'pi pi-times',
      message: 'Are you sure you want to delete this company?',
      accept: () => {
        this.deleteCompany(userId);
      },
    })
  }

  getData(): void {
    this.companiesService.getAllCompanies(this.pagination).subscribe({
      next: (res) => {
        this.data = res.items;
      },
      error: (err) => {
        this.toaster.showError('Failed to load companies', err);
      }
    });
  }
}
