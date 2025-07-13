import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemRoles } from 'app/core/constants/app.constants';
import { AccessControlDirective } from 'app/shared/directives/access-control.directive';
import { ToasterService } from 'app/shared/services/toaster.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PayloadConfig } from './models/payloads.models';

const imports = [
  CommonModule,
  CardModule,
  TableModule,
  AccessControlDirective,
  TooltipModule
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

  private router: Router = inject(Router);
  private toaster: ToasterService = inject(ToasterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadPayloads();
  }

  loadPayloads(): void {
    const { projectId, companyId } = this.activatedRoute.snapshot.params;
    if (!projectId || !companyId) {
      this.toaster.showError('Project ID or Company ID is missing');
      this.navigateBack();
      return;
    }
    this.payloadConfig = { projectId, companyId };
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

  create(): void {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }
}
