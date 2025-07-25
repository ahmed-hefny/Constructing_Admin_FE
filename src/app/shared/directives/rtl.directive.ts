import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { RtlService } from 'app/core/services/rtl.service';

@Directive({
  selector: '[appRtl]',
  standalone: true
})
export class RtlDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private rtlService = inject(RtlService);

  ngOnInit() {
    this.rtlService.isRtl$.subscribe(isRtl => {
      if (isRtl) {
        this.renderer.addClass(this.el.nativeElement, 'rtl');
        this.renderer.removeClass(this.el.nativeElement, 'ltr');
        this.renderer.setAttribute(this.el.nativeElement, 'dir', 'rtl');
      } else {
        this.renderer.addClass(this.el.nativeElement, 'ltr');
        this.renderer.removeClass(this.el.nativeElement, 'rtl');
        this.renderer.setAttribute(this.el.nativeElement, 'dir', 'ltr');
      }
    });
  }
}
