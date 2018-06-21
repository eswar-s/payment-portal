import React from 'react';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
  jssPreset,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import indigo from '@material-ui/core/colors/indigo';
import template from 'jss-template';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#fa451c' },
    secondary: { main: indigo['A200'] },
  },
});

const jss = create({ plugins: [...jssPreset().plugins, template()] });

const generateClassName = createGenerateClassName({
  productionPrefix: 'pp',
});

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...props} />
        </MuiThemeProvider>
      </JssProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
