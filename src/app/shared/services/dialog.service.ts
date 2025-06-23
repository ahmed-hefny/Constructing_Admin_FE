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
      header: config.header || 'Confirmation',
      closeOnEscape: true,
      icon: config.icon || 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-error',
      rejectButtonStyleClass: 'btn btn-accent mr-2',
      acceptLabel: config.acceptLabel || 'Confirm',
      acceptIcon: 'pi pi-check',
      rejectLabel: config.rejectLabel || 'Cancel',
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
