import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Default_PAGINATION } from 'app/core/constants/app.constants';
import { PaginationConfig } from 'app/core/models';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';
import { DialogService } from 'app/shared/services/dialog.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProjectsService } from './service/projects.service';
import { Project } from './models/projects.models';

const imports = [
  ButtonModule,
  CardModule,
  TableModule,
  PaginationComponent
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

  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private dialogService: DialogService = inject(DialogService);
  private projectsService: ProjectsService = inject(ProjectsService);

  ngOnInit(): void {
    this.getData();
  }

  create(): void {
    console.log('Create project');
  }

  view(id: number): void {
    console.log('View project with ID:', id);
  }

  getData(): void {
    this.projectsService.getAll(this.pagination).subscribe({
      next: (res) => {
        console.log(res);
        this.data = res.items;
         this.pagination = {
          ...this.pagination,
          totalRecords: res.count,
        };
      },
      error: (err) => {
        this.toaster.showError('Failed to load projects');
      }
    });
  }

    onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.pageSize = event.pageSize;
    this.getData();
  }

}
