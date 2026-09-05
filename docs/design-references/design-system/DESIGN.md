---
name: Setu Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#8f4e00'
  on-secondary: '#ffffff'
  secondary-container: '#fe9832'
  on-secondary-container: '#683700'
  tertiary: '#000e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#012800'
  on-tertiary-container: '#309d22'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77a'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3a00'
  tertiary-fixed: '#8dfc75'
  tertiary-fixed-dim: '#72de5c'
  on-tertiary-fixed: '#012200'
  on-tertiary-fixed-variant: '#035300'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  sidebar-width: 280px
---

## Brand & Style

The design system is engineered for the Ministry of Statistics and Programme Implementation (MoSPI), specifically for the National Statistical Systems Training Academy (NSSTA). It bridges the gap between traditional Indian governmental authority and the cutting-edge efficiency of AI-powered competency management.

The aesthetic follows a **Modern Corporate** direction with **Intellectual Minimalism**. It prioritizes extreme clarity, data density, and institutional trust. The visual language is structured and dependable, using a disciplined grid and refined layering to convey stability. AI features are integrated not as decorative elements, but as subtle "cognitive overlays" using soft indigo washes and precise iconography to signal intelligent assistance.

## Colors

The palette is rooted in the **Deep Navy Blue (#002147)** of official statecraft, ensuring immediate recognition of authority. 

- **Primary & National Identity:** Navy dominates headers and primary actions. Saffron and Ashoka Green are utilized strictly as functional accents—Saffron for high-priority alerts or progress indicators, and Green for achieved competencies and verified certifications.
- **AI-Native Indigo:** A soft, vibrant Indigo (#6366F1) identifies AI-driven nudges, recommendations, and the "Co-pilot" interface, distinguishing machine-generated insights from static data.
- **Surface Strategy:** The background utilizes a very cool, high-brightness gray to reduce eye strain during long periods of data analysis. Surfaces are white, creating a clear "paper-like" hierarchy for reports and dashboards.

## Typography

This design system utilizes a dual-sans approach to balance modern tech with institutional legibility.

- **Headlines (Geist):** Used for titles and navigation. Geist’s precise, technical geometry reinforces the AI-native aspect of the platform.
- **Body & Data (Inter):** The workhorse for all content. Its high x-height ensures readability across dense competency matrices and curriculum descriptions.
- **Monospace (JetBrains Mono):** Reserved for technical identifiers, status codes, and numerical data in tables to ensure tabular alignment and a sense of precision.
- **Scaling:** On mobile devices, `display-lg` and `headline-lg` should downscale by 25% to maintain visual balance within portrait viewports.

## Layout & Spacing

The layout is governed by a **12-column fluid grid** for the main content area, anchored by a fixed-width left navigation sidebar. 

- **Sidebar:** 280px width, containing top-level navigation and the AI Co-pilot status.
- **Margins:** 32px on desktop, scaling down to 16px on mobile. 
- **Gutters:** 24px fixed to ensure data-heavy cards remain distinct.
- **Vertical Rhythm:** An 8px-based system is used for all internal component padding and margins to maintain a tight, professional density suitable for administrative dashboards.

## Elevation & Depth

Visual hierarchy in the design system is achieved through **Tonal Layering** and **Precision Shadows**.

1.  **Level 0 (Background):** #F8FAFC (Cool Gray).
2.  **Level 1 (Cards/Surface):** White (#FFFFFF) with a 1px border (#E2E8F0). No shadow.
3.  **Level 2 (Interactive/Floating):** White with a soft, diffused shadow (0px 4px 12px rgba(0, 33, 71, 0.08)). Used for hovered cards and active navigation.
4.  **Level 3 (Overlays/Modals):** White with a deep shadow (0px 12px 32px rgba(0, 33, 71, 0.15)).

For AI-powered features, a "Glowing" elevation is used: a soft 2px Indigo border with a subtle outer glow to signify the co-pilot's active intervention.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a professional, geometric feel that avoids the "consumer-app" playfulness of fully rounded corners while remaining more modern than sharp, 90-degree angles.

- **Standard Components:** 4px (0.25rem) radius for buttons, inputs, and small chips.
- **Containers:** 8px (0.5rem) radius for dashboard cards and course modules.
- **Status Indicators:** 2px radius for "Gap Detected" tags to maintain a serious, alert-like appearance.

## Components

### Navigation Sidebar
A dark-themed (#002147) vertical bar. Active states use a solid Ashoka Green left-accent border (4px) and a subtle background tint. AI Co-pilot status is anchored at the bottom with a pulsing Indigo indicator.

### Course Differentiation
- **iGOT Cards:** White background, 1px Gray border, "Instant Access" label in Indigo. Minimalist layout for self-paced learning.
- **NSSTA Cards:** Light Navy tinted header, "Nomination Required" badge in Saffron. Features a "Calendar" icon and "Days to Start" countdown for scheduled sessions.

### Competency Indicators
- **Gap Detected:** A "pill" badge with a light Amber background and dark Amber text, accompanied by a small AI-nudge icon suggesting a specific course.
- **Competency Met:** A solid Ashoka Green checkmark icon with a "Verified" label in label-sm typography.

### Buttons
- **Primary:** Solid Navy (#002147) with White text. Geist Medium.
- **AI Recommendation:** Solid Indigo (#6366F1) with a small spark icon.
- **Secondary:** Ghost style with a 1px Navy border.

### Data Visualization
Charts (Recharts) should use a palette of: Navy (Core), Saffron (Urgent Gaps), Green (Proficiency), and Indigo (Projected Growth). Use thin 1px strokes and no fills to maintain the professional, analytical aesthetic.