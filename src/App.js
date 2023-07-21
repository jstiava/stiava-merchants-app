import React, { useMemo, useState } from 'react';
import { red } from '@mui/material/colors';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import MerchantsApp from './MerchantsApp';
// import reactPress from "./reactPress";

const App = () => {

    const [mode, setMode] = useState('light');
    const toggleMode = () => {
        setMode((prev) => {
            return prev === 'dark' ? 'light' : 'dark'
        })
    }

    // Update the theme only if the mode changes
    const theme = useMemo(() => createTheme(design(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <MerchantsApp />
        </ThemeProvider>
    )
}

const design = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: {
                    main: '#a51417',
                    contrastText: '#ffffff'
                },
                secondary: {
                    main: '#3d3d3d',
                    contrastText: '#ffffff'
                },
                warning: {
                    main: "#ed6c02",
                    light: "#ff9800",
                    dark: "#e65100",
                    contrastText: "#fff"
                },
                error: {
                    main: "#410002",
                    light: "#ef5350",
                    dark: "#c62828",
                    contrastText: '#410002'
                }
            }
            : {
                // palette values for dark mode
                primary: {
                    main: '#ffb4ab',
                    contrastText: '#000000'
                },
                secondary: {
                    main: '#3d3d3d',
                    contrastText: '#ffffff'
                },
                error: {
                    main: "#93000a",
                    dark: "#93000a",
                    contrastText: "#ffdad6",
                }
            })
    },
    typography: {
        fontFamily: [
            'Source Sans Pro',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(',')
    }
});

export default App;