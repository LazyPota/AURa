// Tailwind theme config (for reference in components)
export const theme = {
  colors: {
    primary: '#2563eb', // blue-600
    secondary: '#64748b', // slate-500
    accent: '#f59e42', // orange-400
    background: '#f8fafc', // slate-50
    surface: '#fff',
    error: '#ef4444', // red-500
    success: '#22c55e', // green-500
    info: '#0ea5e9', // sky-500
    dark: '#0f172a', // slate-900
  },
  borderRadius: '0.5rem',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
  },
};

// Simple dark mode toggle helper (for context/provider)
export const getTheme = (mode) => (mode === 'dark' ? darkTheme : theme);
