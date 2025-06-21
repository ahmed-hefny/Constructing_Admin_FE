import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private messageService: MessageService = inject(MessageService);
  constructor() { }

  showSuccess(message: string = '', summary: string = 'Success', life: number = 3000): void {
    this.messageService.add({ severity: 'success', summary, detail: message, life });
  }
  showError(message: string = '', summary: string = 'Error', life: number = 3000): void {
    this.messageService.add({ severity: 'error', summary, detail: message, life });
  }
  showInfo(message: string = '', summary: string = 'Info', life: number = 3000): void {
    this.messageService.add({ severity: 'info', summary, detail: message, life });
  }
  showWarn(message: string = '', summary: string = 'Warning', life: number = 3000): void {
    this.messageService.add({ severity: 'warn', summary, detail: message, life });
  }
  clear(): void {
    this.messageService.clear();
  }
  
}
