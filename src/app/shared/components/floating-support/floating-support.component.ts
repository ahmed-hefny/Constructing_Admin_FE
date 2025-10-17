import { Component, Input } from "@angular/core";
import {
  FloatingSupportConfig,
  FloatingSupportPosition,
  FloatingSupportSize,
  FloatingSupportStyles,
  TooltipPosition,
  FLOATING_SUPPORT_DEFAULTS,
  WHATSAPP_CONSTANTS,
  ICON_SIZE_MAP
} from './floating-support.models';

@Component({
  selector: "app-floating-support",
  template: `
    <div
      class="floating-support-icon"
      [class]="cssClasses"
      [style]="iconStyles"
      (click)="handleClick()"
      [attr.aria-label]="ariaLabel"
      role="button"
      tabindex="0"
      (keydown.enter)="handleClick()"
      (keydown.space)="handleClick()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="support-icon"
        [style.width.px]="iconSize"
        [style.height.px]="iconSize"
      >
        <path [attr.d]="whatsappIconPath" />
      </svg>
      
      <div class="tooltip" [class]="tooltipPositionClass">
        {{ tooltipText }}
        <div class="tooltip-arrow"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .floating-support-icon {
        position: fixed;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        opacity: 0.8;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
        animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .floating-support-icon:hover {
        opacity: 1;
        transform: scale(1.05);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .floating-support-icon:focus {
        outline: 2px solid #4A90E2;
        outline-offset: 2px;
      }

      .floating-support-icon:active {
        transform: scale(0.95);
      }

      /* Size variants */
      .size-small {
        width: 48px;
        height: 48px;
      }

      .size-medium {
        width: 60px;
        height: 60px;
      }

      .size-large {
        width: 72px;
        height: 72px;
      }

      /* Position variants */
      .position-bottom-left {
        bottom: 30px;
        left: 30px;
      }

      .position-bottom-right {
        bottom: 30px;
        right: 30px;
      }

      .position-top-left {
        top: 30px;
        left: 30px;
      }

      .position-top-right {
        top: 30px;
        right: 30px;
      }

      .support-icon {
        color: white;
        transition: transform 0.2s ease;
        flex-shrink: 0;
      }

      .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 10000;
      }

      .floating-support-icon:hover .tooltip {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      /* Tooltip positioning */
      .tooltip-bottom {
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%) translateY(10px);
      }

      .floating-support-icon:hover .tooltip-bottom {
        transform: translateX(-50%) translateY(0);
      }

      .tooltip-top {
        top: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
      }

      .floating-support-icon:hover .tooltip-top {
        transform: translateX(-50%) translateY(0);
      }

      .tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border: 6px solid transparent;
      }

      .tooltip-bottom .tooltip-arrow {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top-color: rgba(0, 0, 0, 0.9);
      }

      .tooltip-top .tooltip-arrow {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: rgba(0, 0, 0, 0.9);
      }

      /* Animations */
      @keyframes bounceIn {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
          opacity: 0.8;
        }
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .floating-support-icon {
          bottom: 20px !important;
          left: 20px !important;
          top: auto !important;
        }
        
        .size-large {
          width: 60px;
          height: 60px;
        }
        
        .size-medium {
          width: 52px;
          height: 52px;
        }
      }
    `,
  ],
})
export class FloatingSupportComponent {
  // Input properties for configuration
  @Input() phoneNumber: string = FLOATING_SUPPORT_DEFAULTS.PHONE_NUMBER;
  @Input() message: string = FLOATING_SUPPORT_DEFAULTS.MESSAGE;
  @Input() tooltipText: string = FLOATING_SUPPORT_DEFAULTS.TOOLTIP_TEXT;
  @Input() position: FloatingSupportPosition = FLOATING_SUPPORT_DEFAULTS.POSITION;
  @Input() size: FloatingSupportSize = FLOATING_SUPPORT_DEFAULTS.SIZE;
  @Input() color: string = FLOATING_SUPPORT_DEFAULTS.COLOR;
  @Input() disabled: boolean = FLOATING_SUPPORT_DEFAULTS.DISABLED;

  // Configuration object input (alternative to individual inputs)
  @Input() set config(value: FloatingSupportConfig | null) {
    if (value) {
      this.phoneNumber = value.phoneNumber;
      this.message = value.message || this.message;
      this.tooltipText = value.tooltipText || this.tooltipText;
      this.position = value.position || this.position;
      this.size = value.size || this.size;
      this.color = value.color || this.color;
    }
  }

  // Constants
  private readonly DEFAULT_MESSAGE = WHATSAPP_CONSTANTS.DEFAULT_MESSAGE;
  private readonly WHATSAPP_BASE_URL = WHATSAPP_CONSTANTS.BASE_URL;
  
  // WhatsApp icon SVG path
  readonly whatsappIconPath = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516";

  // Computed properties
  get cssClasses(): string {
    const classes = ['floating-support-icon'];
    
    if (this.disabled) {
      classes.push('disabled');
    }
    
    classes.push(`size-${this.size}`);
    classes.push(`position-${this.position}`);
    
    return classes.join(' ');
  }

  get iconStyles(): FloatingSupportStyles {
    return {
      background: this.getGradientBackground(),
      ...(this.disabled && { 
        opacity: '0.5', 
        cursor: 'not-allowed',
        pointerEvents: 'none' 
      })
    };
  }

  get iconSize(): number {
    return ICON_SIZE_MAP[this.size];
  }

  get ariaLabel(): string {
    return `${this.tooltipText} - ${this.phoneNumber}`;
  }

  get tooltipPositionClass(): TooltipPosition {
    const isTop = this.position.includes('top');
    return isTop ? 'tooltip-top' : 'tooltip-bottom';
  }

  // Methods
  handleClick(): void {
    if (this.disabled) {
      return;
    }

    this.openWhatsApp();
  }

  private openWhatsApp(): void {
    try {
      const encodedMessage = encodeURIComponent(this.message || this.DEFAULT_MESSAGE);
      const whatsappUrl = `${this.WHATSAPP_BASE_URL}/${this.phoneNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  }

  private getGradientBackground(): string {
    // Create a gradient based on the primary color
    const lightColor = this.lightenColor(this.color, 10);
    const darkColor = this.darkenColor(this.color, 10);
    
    return `linear-gradient(135deg, ${lightColor} 0%, ${darkColor} 100%)`;
  }

  private lightenColor(color: string, percent: number): string {
    // Simple color lightening - in a real app, you might use a color manipulation library
    return color;
  }

  private darkenColor(color: string, percent: number): string {
    // Simple color darkening - in a real app, you might use a color manipulation library
    if (color === '#25D366') {
      return '#128C7E';
    }
    return color;
  }
}
