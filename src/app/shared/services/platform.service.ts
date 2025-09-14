import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor() { }

  /**
   * Detects if the current device is running iOS
   * @returns true if the device is iOS, false otherwise
   */
  isIOS(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for iOS devices
    return /iphone|ipad|ipod/.test(userAgent) ||
           // Check for iOS 13+ on iPad which may report as desktop
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  /**
   * Detects if the current device is running Android
   * @returns true if the device is Android, false otherwise
   */
  isAndroid(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android/.test(userAgent);
  }

  /**
   * Detects if the current device is mobile (iOS or Android)
   * @returns true if the device is mobile, false otherwise
   */
  isMobile(): boolean {
    return this.isIOS() || this.isAndroid();
  }

  /**
   * Gets the platform name
   * @returns string representing the platform
   */
  getPlatform(): string {
    if (this.isIOS()) return 'ios';
    if (this.isAndroid()) return 'android';
    return 'web';
  }
}
