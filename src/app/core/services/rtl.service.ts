import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RtlService {
  private _isRtl = new BehaviorSubject<boolean>(true); // Default to RTL for Arabic
  public isRtl$ = this._isRtl.asObservable();

  constructor() {
    this.initializeRtl();
  }

  private initializeRtl(): void {
    // Set RTL by default
    this.setRtl(true);
  }

  setRtl(isRtl: boolean): void {
    this._isRtl.next(isRtl);
    
    // Update document direction
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.body.dir = isRtl ? 'rtl' : 'ltr';
      
      // Update document classes for styling
      if (isRtl) {
        document.documentElement.classList.add('rtl');
        document.documentElement.classList.remove('ltr');
      } else {
        document.documentElement.classList.add('ltr');
        document.documentElement.classList.remove('rtl');
      }
    }
  }

  toggleDirection(): void {
    this.setRtl(!this._isRtl.value);
  }

  get isRtl(): boolean {
    return this._isRtl.value;
  }
}
