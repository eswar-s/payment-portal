import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { authenticate } from './actions/auth';
import { bindActionCreators } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function (ComposedComponent) {
    class Authentication extends Component {

        constructor(props) {
            super(props);
            this.state = {
                authenticating: false
            }
        }

        componentWillMount() {
            if (!this.props.authenticated) {
                const token = localStorage.getItem('token');
                const code = localStorage.getItem('code');
                if (token && code) {
                    this.setState({ authenticating: true })
                    this.props.authenticate(token, code).then(() => {
                        this.setState({ authenticating: false })
                        if (!this.props.authenticated) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('code');
                            this.props.history.push('/authenticate');
                        }
                    })
                } else {
                    this.props.history.push('/authenticate');
                }
            }
        }

        /** componentWillMount() {
            if (!nextProps.authenticated) {
                this.props.history.push('/authenticate');
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                this.props.history.push('/authenticate');
            }
        } */

        PropTypes = {
            router: PropTypes.object,
        }

        render() {
            const { authenticated } = this.props;
            const { authenticating } = this.state;
            return (
                <React.Fragment>
                    {authenticating && <div style={{textAlign: 'center', margin: 32}}><CircularProgress size={80} /></div>}
                    {authenticated && <ComposedComponent {...this.props} />}
                </React.Fragment>
            )
        }
    }

    function mapStateToProps(state) {
        return { authenticated: state.auth.authenticated };
    }

    const mapDispatchToProps = dispatch => bindActionCreators({
        authenticate
    }, dispatch)

    return connect(mapStateToProps, mapDispatchToProps)(Authentication);
}