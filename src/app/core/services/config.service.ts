import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    get apiUrl(): string {
        return environment.apiUrl;
    }

    get isProduction(): boolean {
        return environment.production;
    }

    get appName(): string {
        return environment.appName;
    }

    get version(): string {
        return environment.version;
    }

    get enableLogging(): boolean {
        return environment.enableLogging;
    }

    get enableDebugMode(): boolean {
        return environment.enableDebugMode;
    }

    log(message: any): void {
        if (this.enableLogging) {
            console.log(`[${this.appName}]:`, message);
        }
    }

    debug(message: any): void {
        if (this.enableDebugMode) {
            console.debug(`[${this.appName} DEBUG]:`, message);
        }
    }
}
