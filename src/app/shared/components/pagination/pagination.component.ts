import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Default_PAGINATION } from 'app/core/constants/app.constants';
import { PaginationConfig, PaginationRequest } from 'app/core/models';
import { PaginatorModule } from 'primeng/paginator';

const imports = [
  PaginatorModule

]
@Component({
  imports,
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() paginationConfig: PaginationConfig = Default_PAGINATION;
  @Input() classList: string = '';
  @Output() onPageChange = new EventEmitter<PaginationRequest>();

  onPaginationChange(event: any): void {
    const { rows, page } = event;
    this.onPageChange.emit({ pageNumber: page + 1, pageSize: rows });
  }
}
