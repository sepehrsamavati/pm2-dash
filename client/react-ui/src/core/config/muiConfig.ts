import colors from './colors';
import { createTheme } from '@mui/material/styles';

const ThemeNames = ['light', 'dark'] as const;

export type ThemeName = typeof ThemeNames[number];

export const muiThemeOptions = (theme: ThemeName = 'dark') => createTheme({
    direction: 'rtl',
    palette: {
        mode: theme,
        primary: {
            main: theme === 'light' ? colors.brand : colors.brandDarkMode,
        },
        secondary: {
            main: colors.brandSecondary,
        },
        error: {
            main: colors.error,
        },
        background: {
            default: theme === 'light' ? colors.backgroundLightMode : colors.backgroundDarkMode,
            paper: theme === 'light' ? colors.antiFlashWhite : colors.brand
        }
    },
    typography: {
        fontSize: 16,
        fontFamily: `"IRANSansFaNum", "yekan", "Roboto", "Helvetica", "Arial", sans-serif`
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: 'none',
                },
            },
        },
        // @ts-ignore
        MuiDataGrid: {
            styleOverrides: {
                withBorderColor: {
                    borderColor: colors.brand
                }
            }
        },
        // @ts-ignore
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: theme === 'light' ? colors.backgroundDarkMode : colors.backgroundLightMode
                }
            }
        }
    },
});
