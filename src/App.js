import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import withRoot from './withRoot';
import RetailerInfo from './RetailerInfo';
import Authenticate from './Authenticate';
import OpenInvoices from './OpenInvoices';
import NoMatch from './NoMatch';
import GabrielCircleIcon from './GabrielCircleIcon';
import requireAuth from './require_auth';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    paddingTop: 'env(safe-area-inset-top)',
  },
  wrapper: {
    padding: 4,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 104,
    }
  },
  gabrielCircleIcon: {
    height: 48,
    width: 48,
  },
  header: {
    fontFamily: "'Averia Serif Libre', cursive",
    fontSize: '22px',
    fontWeight: '100'
  },
});

class App extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <GabrielCircleIcon className={classes.gabrielCircleIcon}/>
            <h2 className={classes.header}>
                Payment Portal
            </h2>
          </Toolbar>
        </AppBar>
        <RetailerInfo />
        <main className={classes.wrapper}>
          <Switch>
            <Route
              exact path="/"
              render={props => <Redirect to='/authenticate'/> }
            />
            <Route exact path="/authenticate/:token?/:code?" component={Authenticate} />
            <Route exact path="/open-invoices" component={requireAuth(OpenInvoices)} />
            <Route component={NoMatch} />
          </Switch>
        </main>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.simpleAction}>Test redux action</button>
        <pre>
          {
            JSON.stringify(this.props)
          }
        </pre> */}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));