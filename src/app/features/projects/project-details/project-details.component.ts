import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToasterService } from "app/shared/services/toaster.service";
import { ProjectsService } from "../service/projects.service";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { AccessControlDirective } from "app/shared/directives/access-control.directive";
import { Project } from "../models/projects.models";
import { TooltipModule } from "primeng/tooltip";
import { SystemRoles } from "app/core/constants/app.constants";
import { HttpStatusCode } from "@angular/common/http";

const imports = [CommonModule, CardModule, TableModule, TooltipModule, AccessControlDirective];

@Component({
  imports,
  selector: "app-project-details",
  templateUrl: "./project-details.component.html",
  styleUrl: "./project-details.component.scss",
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
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    if (!this.id) {
      this.toaster.showError("معرف المشروع مفقود");
      this.navigateBack();
      return;
    }
    this.projectsService.getById(this.id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => {
        if (error.status !== HttpStatusCode.Unauthorized) {
          this.toaster.showError("فشل في تحميل بيانات المشروع");
          this.navigateBack();
        }
      },
    });
  }

  navigateBack(): void {
    this.router.navigate(["/"]);
  }

  navigateToPayloads(companyId: string): void {
    if (!this.id || !companyId) {
      this.toaster.showError("بيانات المشروع غير متوفرة");
      return;
    }
    this.router.navigate(["payloads", this.id, companyId]);
  }

  navigateToPayloadsPerProject(): void {
    if (!this.id) {
      this.toaster.showError("بيانات المشروع غير متوفرة");
      return;
    }
    this.router.navigate(["payloads", this.id]);
  }
}
