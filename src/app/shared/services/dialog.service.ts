import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogConfig } from '../models/dialog.models';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  constructor() { }

  confirmDialog(config: ConfirmDialogConfig): void {
    this.confirmationService.confirm({
      header: config.header || 'تأكيد',
      closeOnEscape: true,
      blockScroll: config.blockScroll || true,
      dismissableMask: config.dismissableMask || true,
      icon: config.icon || 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-error',
      rejectButtonStyleClass: 'btn btn-accent',
      acceptLabel: config.acceptLabel || 'تأكيد',
      acceptIcon: 'pi pi-check',
      rejectLabel: config.rejectLabel || 'إلغاء',
      rejectIcon: 'pi pi-times',
      message: config.message,
      accept: () => {
        config.onAccept?.();
      },
      reject: () => {
        config.onReject?.();
      }
    });
  }
}
