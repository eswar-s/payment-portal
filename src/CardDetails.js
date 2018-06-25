import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Hidden from '@material-ui/core/Hidden';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

import Payment from 'payment';

class CardDetails extends Component {

    componentDidMount() {
        Payment.formatCardNumber(document.querySelector('[name="number"]'));
        Payment.formatCardExpiry(document.querySelector('[name="expiry"]'));
        Payment.formatCardCVC(document.querySelector('[name="cvc"]'));
    }
    
    render() {
        const { number, name, expiry, cvc, focused } = this.props;
        return (
            <Grid container spacing={8}>
                <Hidden smUp>
                    <Grid item xs={12}>
                        <Cards
                            number={number}
                            name={name}
                            expiry={expiry}
                            cvc={cvc}
                            focused={focused}
                            callback={this.props.handleCallback}
                        />
                    </Grid>
                </Hidden>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="number">Card Number</InputLabel>
                        <Input
                            id="number"
                            name="number"
                            pattern="\d*"
                            onKeyUp={this.props.handleInputChange}
                            onFocus={this.props.handleInputFocus}
                            onBlur={event => this.props.handleInputFocus({target: {name: ''}})}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            onKeyUp={this.props.handleInputChange}
                            onFocus={this.props.handleInputFocus}
                            onBlur={event => this.props.handleInputFocus({target: {name: ''}})}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="expiry">Valid Thru</InputLabel>
                        <Input
                            id="expiry"
                            name="expiry"
                            onKeyUp={this.props.handleInputChange}
                            onFocus={this.props.handleInputFocus}
                            onBlur={event => this.props.handleInputFocus({target: {name: ''}})}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="cvc">CVC</InputLabel>
                        <Input
                            id="cvc"
                            name="cvc"
                            onKeyUp={this.props.handleInputChange}
                            onFocus={this.props.handleInputFocus}
                            onBlur={event => this.props.handleInputFocus({target: {name: ''}})}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        );
    }
}

CardDetails.propTypes = {
    number: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    expiry: PropTypes.string.isRequired,
    cvc: PropTypes.string.isRequired,
    focused: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleInputFocus: PropTypes.func.isRequired,
    handleCallback: PropTypes.func.isRequired,
};

export default CardDetails;