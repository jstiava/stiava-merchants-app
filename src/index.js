import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import { ControlPanelProvider } from './ControlPanelProvider';

// Clashing stylesheets
import './styles/testing.css'
import './styles/animated.css'
import './styles/master.css'
import './styles/content.css'
import './styles/header.css'

const root = createRoot(document.getElementById('root'));


root.render(
    <ThemeProvider theme={theme}>
        <ControlPanelProvider>
            <App />
        </ControlPanelProvider>
    </ThemeProvider>
);
