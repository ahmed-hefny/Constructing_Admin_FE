import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SystemRoles } from 'app/core/constants/app.constants';
import { AuthService } from 'app/core/services';

@Directive({
  selector: '[appAccessControl]',
  standalone: true
})
export class AccessControlDirective {
  @Input('appAccessControl') roles: SystemRoles | SystemRoles[] = [];
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  ngOnInit() {
    const hasAccess = this.authService.hasRole(this.roles);
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
