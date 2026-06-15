/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-tint": "#455f88", "on-secondary-container": "#4d6b5d", "surface-dim": "#cfdaf1",
        "primary-fixed-dim": "#adc7f7", "primary": "#002045", "tertiary-container": "#30363c",
        "surface": "#f9f9ff", "on-tertiary-fixed-variant": "#41474e", "on-secondary-fixed-variant": "#304d40",
        "secondary-container": "#c9ead9", "outline-variant": "#c4c6cf", "surface-container-low": "#f0f3ff",
        "on-secondary": "#ffffff", "primary-fixed": "#d6e3ff", "on-primary": "#ffffff",
        "inverse-on-surface": "#ebf1ff", "surface-container-high": "#dee8ff", "on-tertiary": "#ffffff",
        "surface-container-highest": "#d8e3fa", "on-error": "#ffffff", "on-tertiary-container": "#989fa6",
        "on-primary-container": "#86a0cd", "secondary-fixed": "#c9ead9", "on-secondary-fixed": "#022016",
        "on-primary-fixed": "#001b3c", "secondary": "#476558", "inverse-primary": "#adc7f7",
        "on-background": "#111c2c", "surface-container": "#e7eeff", "on-primary-fixed-variant": "#2d476f",
        "error": "#ba1a1a", "surface-bright": "#f9f9ff", "surface-container-lowest": "#ffffff",
        "outline": "#74777f", "tertiary": "#1b2127", "on-surface-variant": "#43474e",
        "inverse-surface": "#263142", "on-tertiary-fixed": "#161c22", "background": "#f9f9ff",
        "tertiary-fixed-dim": "#c1c7cf", "tertiary-fixed": "#dde3eb", "on-surface": "#111c2c",
        "on-error-container": "#93000a", "surface-variant": "#d8e3fa", "primary-container": "#1a365d",
        "error-container": "#ffdad6", "secondary-fixed-dim": "#adcebe"
      },
      borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
      spacing: {
        "stack-md": "16px", "stack-sm": "8px", "container-margin": "24px",
        "gutter": "16px", "sidebar-width": "260px", "stack-lg": "24px", "base": "4px"
      },
      fontFamily: {
        "headline-sm": ["Inter"], "data-mono": ["Inter"], "display-lg": ["Inter"],
        "body-sm": ["Inter"], "label-md": ["Inter"], "body-lg": ["Inter"],
        "headline-md": ["Inter"], "body-md": ["Inter"]
      },
      fontSize: {
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "data-mono": ["14px", { lineHeight: "20px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "display-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }]
      }
    },
  },
  plugins: [
    // Plugins recomendados de Tailwind que estabas usando en tu CDN
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}