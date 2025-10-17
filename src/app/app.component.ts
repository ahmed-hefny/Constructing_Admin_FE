import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PrimeNGConfig } from 'primeng/api';
import { RtlService } from './core/services/rtl.service';
import { RtlDirective } from './shared/directives/rtl.directive';
import { FloatingSupportComponent } from './shared/components/floating-support/floating-support.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, RtlDirective, FloatingSupportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Constructing_Admin_FE';
  
  private primengConfig = inject(PrimeNGConfig);
  private rtlService = inject(RtlService);

  ngOnInit() {
    // Configure PrimeNG for RTL
    this.primengConfig.ripple = true;
    
    // Set PrimeNG RTL configuration
    this.configurePrimeNGRtl();
    
    // Initialize RTL
    this.rtlService.setRtl(true);
  }

  private configurePrimeNGRtl(): void {
    // Configure PrimeNG translation for Arabic
    this.primengConfig.setTranslation({
      startsWith: 'يبدأ بـ',
      contains: 'يحتوي على',
      notContains: 'لا يحتوي على',
      endsWith: 'ينتهي بـ',
      equals: 'يساوي',
      notEquals: 'لا يساوي',
      lt: 'أقل من',
      lte: 'أقل من أو يساوي',
      gt: 'أكبر من',
      gte: 'أكبر من أو يساوي',
      is: 'هو',
      isNot: 'ليس',
      before: 'قبل',
      after: 'بعد',
      dateIs: 'التاريخ هو',
      dateIsNot: 'التاريخ ليس',
      dateBefore: 'التاريخ قبل',
      dateAfter: 'التاريخ بعد',
      clear: 'مسح',
      apply: 'تطبيق',
      matchAll: 'مطابقة الكل',
      matchAny: 'مطابقة أي',
      addRule: 'إضافة قاعدة',
      removeRule: 'حذف القاعدة',
      accept: 'نعم',
      reject: 'لا',
      choose: 'اختر',
      upload: 'رفع',
      cancel: 'إلغاء',
      dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      dayNamesShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
      dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
      monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      today: 'اليوم',
      weekHeader: 'أسبوع',
      weak: 'ضعيف',
      medium: 'متوسط',
      strong: 'قوي',
      passwordPrompt: 'أدخل كلمة المرور',
      emptyMessage: 'لا توجد نتائج',
      emptyFilterMessage: 'لا توجد نتائج'
    });
  }
}
