# Construction Admin Design System

This document outlines the design system used throughout the Construction Admin application. All design tokens are defined in `/src/styles/variables.scss` and should be used consistently across all components.

## Color Palette

### Brand Colors
- **Primary**: `$brand-primary` - #667eea (Main brand color)
- **Secondary**: `$brand-secondary` - #764ba2 (Secondary brand color)
- **Gradient**: `$brand-gradient` - Linear gradient from primary to secondary

### Neutral Colors (Slate Palette)
- **50**: `$neutral-50` - #f8fafc (Lightest)
- **100**: `$neutral-100` - #f1f5f9
- **200**: `$neutral-200` - #e2e8f0
- **300**: `$neutral-300` - #cbd5e1
- **400**: `$neutral-400` - #94a3b8
- **500**: `$neutral-500` - #64748b
- **600**: `$neutral-600` - #475569
- **700**: `$neutral-700` - #334155
- **800**: `$neutral-800` - #1e293b
- **900**: `$neutral-900` - #0f172a (Darkest)

### Surface Colors
- **White**: `$surface-white` - #ffffff
- **Gray**: `$surface-gray` - #f8f9fa
- **Border**: `$surface-border` - #e9ecef
- **Content**: `$surface-content` - #f8fafc

### Semantic Colors
- **Success**: `$success` - #10b981
- **Warning**: `$warning` - #f59e0b
- **Error**: `$error` - #ef4444
- **Info**: `$info` - #3b82f6

## Typography

### Font Sizes
- **XS**: `$font-size-xs` - 0.75rem (12px)
- **SM**: `$font-size-sm` - 0.875rem (14px)
- **Base**: `$font-size-base` - 1rem (16px)
- **LG**: `$font-size-lg` - 1.125rem (18px)
- **XL**: `$font-size-xl` - 1.25rem (20px)
- **2XL**: `$font-size-2xl` - 1.5rem (24px)
- **3XL**: `$font-size-3xl` - 1.875rem (30px)

### Font Weights
- **Normal**: `$font-weight-normal` - 400
- **Medium**: `$font-weight-medium` - 500
- **Semibold**: `$font-weight-semibold` - 600
- **Bold**: `$font-weight-bold` - 700

## Spacing Scale

Based on 0.25rem (4px) increments:
- **XS**: `$spacing-xs` - 0.25rem (4px)
- **SM**: `$spacing-sm` - 0.5rem (8px)
- **MD**: `$spacing-md` - 0.75rem (12px)
- **LG**: `$spacing-lg` - 1rem (16px)
- **XL**: `$spacing-xl` - 1.5rem (24px)
- **2XL**: `$spacing-2xl` - 2rem (32px)
- **3XL**: `$spacing-3xl` - 3rem (48px)

## Border Radius

- **SM**: `$border-radius-sm` - 4px
- **MD**: `$border-radius-md` - 8px
- **LG**: `$border-radius-lg` - 12px
- **XL**: `$border-radius-xl` - 16px
- **Full**: `$border-radius-full` - 50%

## Shadows

- **Light**: `$shadow-light` - rgba(0, 0, 0, 0.1)
- **Medium**: `$shadow-medium` - rgba(0, 0, 0, 0.15)
- **Dark**: `$shadow-dark` - rgba(0, 0, 0, 0.25)

## Layout Dimensions

- **Sidebar Width**: `$sidebar-width` - 280px
- **top-bar Height**: `$top-bar-height` - 60px

## Transitions

- **Fast**: `$transition-fast` - 0.15s ease-in-out
- **Base**: `$transition-base` - 0.3s ease-in-out
- **Slow**: `$transition-slow` - 0.5s ease-in-out

## Z-Index Scale

- **Dropdown**: `$z-index-dropdown` - 1000
- **Sidebar**: `$z-index-sidebar` - 999
- **top-bar**: `$z-index-top-bar` - 1000
- **Modal**: `$z-index-modal` - 1050
- **Tooltip**: `$z-index-tooltip` - 1100

## Breakpoints

- **SM**: `$breakpoint-sm` - 576px
- **MD**: `$breakpoint-md` - 768px
- **LG**: `$breakpoint-lg` - 992px
- **XL**: `$breakpoint-xl` - 1200px
- **2XL**: `$breakpoint-2xl` - 1400px

## Usage Guidelines

### Using Variables
Always use design tokens instead of hardcoded values:

```scss
// ✅ Good
.my-component {
  color: $text-primary;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
}

// ❌ Bad
.my-component {
  color: #334155;
  padding: 16px;
  border-radius: 8px;
}
```

### Using Mixins
Leverage utility mixins for common patterns:

```scss
.button {
  @include button-reset();
  @include transition();
  @include shadow-md();
}

.card-header {
  @include flex-between();
  padding: $spacing-lg;
}
```

### Component-Specific Variables
Use semantic variables for component styling:

```scss
.sidebar {
  background: $sidebar-bg;
  border: 1px solid $sidebar-border;
}

.top-bar {
  background: $top-bar-bg;
  color: $top-bar-text;
}
```

## Compatibility Notes

- Variables are prefixed to avoid conflicts with Tailwind CSS
- PrimeNG theme variables are not overridden
- All variables follow semantic naming conventions
- Design system is mobile-first and responsive

## Extension

To add new design tokens:

1. Add variables to `/src/styles/variables.scss`
2. Follow semantic naming conventions
3. Update this documentation
4. Use the new variables in components
5. Test across different themes and screen sizes
