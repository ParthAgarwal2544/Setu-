---
name: Institutional Modernity
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#180500'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d1500'
  on-tertiary-container: '#b97958'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6c391d'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
  surface-low: '#F8FAFC'
  saffron-accent: '#F59E0B'
  green-success: '#10B981'
  border-subtle: '#E2E8F0'
  text-main: '#0F172A'
  text-muted: '#64748B'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-desktop: 2rem
  margin-mobile: 1rem
  gutter: 1.5rem
  sidebar-width: 260px
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
---

## Brand & Style

The design system is centered on **Institutional Modernity**, shifting from an "AI-first" tech aesthetic to a "Modern Government Portal" that prioritizes service, clarity, and accessibility. The goal is to evoke a sense of democratic transparency, efficiency, and high-level professionalism.

The style leverages **Minimalism** with a focus on high-contrast legibility and expansive whitespace. By moving away from dark, immersive backgrounds, the UI adopts a "paper-and-ink" clarity, where the interface retreats to allow data and content to lead. The design feels grounded and official yet remains contemporary through the use of precise, geometric typography and a restrained application of color. This approach ensures that technical assistance (AI) feels like a reliable tool within a structured environment rather than a dominant decorative theme.

## Colors

The color strategy moves away from dark-mode dominance to a light, high-contrast palette that ensures AA/AAA accessibility compliance.

- **Primary (Navy - #002147):** Reserved strictly for institutional branding, primary navigation headers, and critical call-to-action buttons. It acts as an anchor of authority against light surfaces.
- **Backgrounds & Surfaces:** The primary canvas is **White (#FFFFFF)**, supported by **Surface-Low (#F8FAFC)** to differentiate sections or sidebars without creating visual heaviness.
- **Functional Accents:** Saffron and Green are used intentionally for status signaling. Saffron (#F59E0B) indicates pending actions or high-priority alerts, while Green (#10B981) confirms successful completions and verified credentials.
- **Grays:** A scale of cool grays is used for borders and secondary text to maintain a crisp, clean aesthetic.

## Typography

The typography uses **Geist** exclusively to provide a unified, technical, and highly legible experience across all levels. Geist's geometric construction echoes modern engineering and administrative precision.

- **Scale:** Large display and headline sizes are used to create a clear information hierarchy. On mobile devices, these scale down to maintain readability without overwhelming the viewport.
- **Body Text:** Set at 16px (md) and 18px (lg) to ensure comfortable reading of long-form reports and training documentation.
- **Labels:** Small caps or increased letter spacing can be used for `label-sm` in metadata contexts to distinguish them from standard body text.
- **Contrast:** Text colors should primarily use Deep Slate (#0F172A) for headers and Slate (#64748B) for secondary information to ensure high visual contrast against white backgrounds.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to ensure institutional content remains structured and predictable.

- **Sidebar Layout:** A 260px fixed-width sidebar is anchored to the left. In the updated system, it uses a White or Surface-Low (#F8FAFC) background with a subtle right-hand border (#E2E8F0) to integrate seamlessly with the content area.
- **Main Content:** Centered or left-aligned within a max-width container (e.g., 1280px) to prevent line lengths from becoming unreadable on ultra-wide monitors.
- **Breakpoints:**
  - **Mobile (< 768px):** Sidebar collapses into a hamburger menu; margins reduce to 16px.
  - **Tablet (768px - 1024px):** Sidebar may transition to a slim icon-only rail or remain persistent depending on screen density.
  - **Desktop (> 1024px):** 12-column grid with 24px gutters.
- **Rhythm:** An 8px linear scale is used for all padding and margins to maintain a tight, professional density.

## Elevation & Depth

The updated aesthetic moves away from shadows in favor of **Low-Contrast Outlines** and **Tonal Layers** to achieve depth. This creates a flatter, more modern "portal" feel.

- **Base Layer:** The application background is Surface-Low (#F8FAFC).
- **Surface Layer:** Dashboard cards and main content containers use White (#FFFFFF) with a 1px border (#E2E8F0).
- **Interactive Depth:** Shadows are used sparingly—only for floating elements like dropdowns, modals, or hovered states. When used, shadows should be extremely soft and diffused (e.g., `0px 4px 20px rgba(0, 0, 0, 0.05)`).
- **Focus States:** Use a 2px Navy outline with a 2px offset to ensure clear keyboard navigation visibility, adhering to government accessibility standards.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a balance between the authority of sharp corners and the approachability of rounded elements.

- **Standard Elements:** Buttons, input fields, and tags use a 4px (0.25rem) radius.
- **Containers:** Larger cards or modal containers may use 8px (0.5rem) to provide a slightly softer container for dense information.
- **Buttons:** Avoid pill shapes; maintain the 4px rounded-rect look to keep the "Professional Portal" aesthetic.

## Components

### Sidebar
The sidebar is now light. Use `Surface-Low (#F8FAFC)` for the background with a `1px border-right (#E2E8F0)`. Active links should use a `Primary Navy (#002147)` text color and a subtle light-blue background tint or a 4px left-border indicator.

### Buttons
- **Primary:** Solid Navy (#002147) with White text.
- **Secondary:** White background with 1px border (#E2E8F0) and Navy text.
- **Ghost:** No background or border; uses Slate text until hovered.

### Input Fields
Inputs should have a White background, 1px border (#E2E8F0), and a 4px radius. Labels must be `label-md` in Deep Slate for maximum readability. Placeholder text should be light gray (#94A3B8).

### Cards
Cards are White with a 1px border (#E2E8F0). Headers within cards can use a Surface-Low (#F8FAFC) background to separate titles from body content.

### Chips & Badges
- **Status Badges:** Use light background tints (e.g., Light Green for success, Light Saffron for pending) with dark, high-contrast text.
- **Filter Chips:** 4px radius, White background, 1px border, with a clear 'X' for removal.

### Tables
Crucial for a government portal. Use a clean, borderless-row style with a subtle horizontal divider (#F1F5F9). The header row should be `Surface-Low` with `label-sm` bolded text.