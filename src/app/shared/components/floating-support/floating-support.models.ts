/**
 * Configuration interface for the FloatingSupport component
 */
export interface FloatingSupportConfig {
  /** WhatsApp phone number (with country code) */
  phoneNumber: string;
  /** Pre-filled message text for WhatsApp */
  message?: string;
  /** Tooltip text shown on hover */
  tooltipText?: string;
  /** Position of the floating button on screen */
  position?: FloatingSupportPosition;
  /** Size of the floating button */
  size?: FloatingSupportSize;
  /** Primary color for the button (hex color) */
  color?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Style configuration for dynamic styling
 */
export interface FloatingSupportStyles {
  [key: string]: string | number;
}

/**
 * Size mapping configuration
 */
export interface FloatingSupportSizeMap {
  small: number;
  medium: number;
  large: number;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Available positions for the floating support button
 */
export type FloatingSupportPosition = 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'top-left' 
  | 'top-right';

/**
 * Available sizes for the floating support button
 */
export type FloatingSupportSize = 'small' | 'medium' | 'large';

/**
 * Tooltip position classes
 */
export type TooltipPosition = 'tooltip-top' | 'tooltip-bottom';

/**
 * CSS class names for the component
 */
export type FloatingSupportCssClass = 
  | 'floating-support-icon'
  | 'disabled'
  | 'size-small'
  | 'size-medium' 
  | 'size-large'
  | 'position-bottom-left'
  | 'position-bottom-right'
  | 'position-top-left'
  | 'position-top-right';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default configuration values
 */
export const FLOATING_SUPPORT_DEFAULTS = {
  PHONE_NUMBER: '201064881832',
  MESSAGE: 'مرحباً، أحتاج إلى المساعدة',
  TOOLTIP_TEXT: 'دعم فني',
  POSITION: 'bottom-left' as FloatingSupportPosition,
  SIZE: 'medium' as FloatingSupportSize,
  COLOR: '#25D366',
  DISABLED: false
} as const;

/**
 * WhatsApp related constants
 */
export const WHATSAPP_CONSTANTS = {
  BASE_URL: 'https://wa.me',
  DEFAULT_MESSAGE: 'مرحباً، أحتاج إلى المساعدة'
} as const;

/**
 * Icon size mapping for different button sizes
 */
export const ICON_SIZE_MAP: FloatingSupportSizeMap = {
  small: 24,
  medium: 32,
  large: 40
} as const;

/**
 * Component z-index values
 */
export const Z_INDEX = {
  BUTTON: 9999,
  TOOLTIP: 10000
} as const;

/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = {
  BOUNCE_IN: 600,
  HOVER_TRANSITION: 300,
  TOOLTIP_TRANSITION: 300
} as const;


/**
 * Color constants for gradients
 */
export const COLOR_CONSTANTS = {
  WHATSAPP_PRIMARY: '#25D366',
  WHATSAPP_SECONDARY: '#128C7E',
  FOCUS_COLOR: '#4A90E2'
} as const;

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Enum for floating support positions
 */
export enum FloatingSupportPositionEnum {
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right'
}

/**
 * Enum for floating support sizes
 */
export enum FloatingSupportSizeEnum {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial configuration for updates
 */
export type PartialFloatingSupportConfig = Partial<FloatingSupportConfig>;

/**
 * Required configuration fields
 */
export type RequiredFloatingSupportConfig = Required<Pick<FloatingSupportConfig, 'phoneNumber'>>;

/**
 * Style object type for dynamic styling
 */
export type StyleObject = Record<string, string | number>;
