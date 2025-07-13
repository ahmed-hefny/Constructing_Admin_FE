import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ProjectsService } from '../service/projects.service';
import { CardModule } from "primeng/card";
import { TableModule } from 'primeng/table';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';
import { AccessControlDirective } from 'app/shared/directives/access-control.directive';
import { Project } from '../models/projects.models';
import { TooltipModule } from 'primeng/tooltip';
import { SystemRoles } from 'app/core/constants/app.constants';
import { HttpStatusCode } from '@angular/common/http';

const imports = [
  CommonModule,
  CardModule,
  TableModule,
  AccessControlDirective,
  TooltipModule

]

@Component({
  imports,
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  id: string | null = null;
  project: Project | null = null;
  SystemRoles = SystemRoles;

  private projectsService: ProjectsService = inject(ProjectsService);
  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadProjectDetails();
  }

  private loadProjectDetails(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!this.id) {
      this.toaster.showError('Project ID is missing');
      this.navigateBack();
      return;
    }
    this.projectsService.getById(this.id).subscribe({
      next: (project) => {
        this.project = project
      },
      error: (error) => {
        if (error.status !== HttpStatusCode.Unauthorized) {
          this.toaster.showError('Failed to load project data');
          this.navigateBack();
        }
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

  navigateToPayloads(companyId: string): void {
    if (!this.id || !companyId) {
      this.toaster.showError('Project data is not available');
      return;
    }
    this.router.navigate(['payloads', this.id, companyId]);
  }

}
