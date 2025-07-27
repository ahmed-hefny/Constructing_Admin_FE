import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Default_PAGINATION, SystemRoles } from 'app/core/constants/app.constants';
import { PaginationConfig } from 'app/core/models';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProjectsService } from './service/projects.service';
import { Project } from './models/projects.models';
import { AccessControlDirective } from 'app/shared/directives/access-control.directive';
import { TagModule } from 'primeng/tag';

const imports = [
  ButtonModule,
  CardModule,
  TableModule,
  TagModule,
  PaginationComponent,
  AccessControlDirective,
]
@Component({
  selector: 'app-projects',
  imports,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  public data: Project[] = [];
  public pagination: PaginationConfig = Default_PAGINATION;
  public SystemRoles = SystemRoles;

  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private projectsService: ProjectsService = inject(ProjectsService);

  ngOnInit(): void {
    this.getData();
  }

  create(): void {
    this.router.navigate(['create'], { relativeTo: this.router.routerState.root });
  }

  edit(id: number): void {
    this.router.navigate(['edit', id], { relativeTo: this.router.routerState.root });
  }
  
  view(id: number): void {
    this.router.navigate(['view', id], { relativeTo: this.router.routerState.root });
  }

  getData(): void {
    this.projectsService.getAll(this.pagination).subscribe({
      next: (res) => {
        this.data = res.items;
        this.pagination = {
          ...this.pagination,
          totalRecords: res.count,
        };
      },
      error: (err) => {
        this.toaster.showError('فشل في تحميل المشاريع');
      }
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.pageSize = event.pageSize;
    this.getData();
  }

}
