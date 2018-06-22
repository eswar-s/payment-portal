import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authenticate } from './actions/auth';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        width: 320,
        margin: '32px auto',
        borderRadius: '8px 8px 0 0',
        position: 'relative',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    textField: {
        margin: theme.spacing.unit,
    },
    button: {
        margin: 0,
        borderRadius: 0,
        width: '100%',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        marginTop: theme.spacing.unit * 2,
        position: 'relative',
    },
    errorMessage: {
        position: 'absolute',
        color: '#fa441d',
        right: 8,
        top: -16,
    }
});

class Authenticate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: this.props.match.params.token || '',
            code: this.props.match.params.code || '',
        }
    }

    componentWillMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('code');
        const { token, code } = this.props.match.params;
        if (token && code) {
            this.props.authenticate(token, code);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.authenticated) {
            this.props.changePage();
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    initiateAuthentication = event => {
        const { token, code } = this.state;
        if (token && code) {
            this.props.authenticate(token, code);
        }
        event.preventDefault();
    }


    render() {
        const { classes, isAuthenticating, authenticated, authError} = this.props;
        const { token, code } = this.state;
        return (
            <Paper className={classes.root} elevation={4}>
                <form className={classes.form} onSubmit={this.initiateAuthentication}>
                    {authError && <Typography variant="caption" gutterBottom className={classes.errorMessage}>
                        * {authError}
                    </Typography>}
                    <TextField
                        required
                        label="Token"
                        value={token}
                        className={classes.textField}
                        onChange={this.handleChange('token')}
                    />
                    <TextField
                        required
                        label="Code"
                        value={code}
                        className={classes.textField}
                        onChange={this.handleChange('code')}
                    />
                    <div className={classes.wrapper}>
                        <Button variant="contained" color="primary"
                            type="submit"
                            className={classes.button} disabled={isAuthenticating || !(token && code)}
                        >
                            {isAuthenticating && 'Authenticating'}
                            {authenticated && 'Authenticated'}
                            {!isAuthenticating && !authenticated && 'Authenticate'}
                        </Button>
                        {isAuthenticating && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </form>
            </Paper>
        );
    }
}

Authenticate.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    count: state.counter.count,
    isAuthenticating: state.auth.isAuthenticating,
    authenticated: state.auth.authenticated,
    authError: state.auth.error
})

const mapDispatchToProps = dispatch => bindActionCreators({
    changePage: () => push('/open-invoices'),
    authenticate
}, dispatch)

export default connect(mapStateToProps,
    mapDispatchToProps)(withStyles(styles)(Authenticate));
