import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Hidden from '@material-ui/core/Hidden';
import Cards from 'react-credit-cards';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import 'react-credit-cards/es/styles-compiled.css';

import CurrencyInputFormat from './CurrencyInputFormat';
import CardDetails from './CardDetails';

import { fetchInvoices, toggleInvoice, toggleAllInvoices, changeAdhocAmount } from './actions/invoice';

const styles = theme => ({
    root: {
        display: 'table',
        width: '100%',
        position: 'relative',
        marginTop: 8,
        padding: 8,
    },
    paymentTypeTypo: {
        width: 120,
    },
    paymentTypeOptions: {
        flexDirection: 'row'
    },
    typoLineHeight: {
        lineHeight: '32px',
    },
    adhocPaymentSwitch: {
        marginRight: 0,
        height: 32
    },
    currencyInput: {
        color: '#000000'
    },
    totalPayableAmountInput: {
        width: '100%',
    },
    form: {
        width: '100%',
    },
    chequeContainer: {
        background: 'rgb(213,239,245)',
        padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit}px`,
    },
    chequeToName: {
        borderBottom: '1px solid #555',
        lineHeight: '100%',
        paddingTop: 4,
    },
    chequeNumber: {
        marginTop: 8,
        padding: '8px 4px',
        height: 34,
        background: 'transparent',
        boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.2), 0px 0px 1px 0px rgba(0, 0, 0, 0.14), 0px -1px 1px -1px rgba(0, 0, 0, 0.12)',
    },
    button: {
        margin: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            marginTop: 16,
            width: '100%',
        }
    },
});

class PaymentDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            paymentType: '',
            adhocEnabled: this.props.adhocEnabled,
            adhocPayment: this.props.adhocPayment,
            focused: '',
            number: '',
            name: '',
            expiry: '',
            cvc: '',
            chequeABANumber: '',
            chequeBankAccountNumber: '',
            isCardValid: false,
            isFormValid: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.adhocPayment !== this.state.adhocPayment) {
            this.setState({ adhocPayment: nextProps.adhocPayment });
        }
        if (nextProps.adhocEnabled !== this.state.adhocEnabled) {
            this.setState({ adhocEnabled: nextProps.adhocEnabled });
        }
    }

    handlePaymentTypeChange = (value) => {
        this.setState(prevState => {
            let isValid = false;
            if (value === 'ach') {
                isValid = prevState.chequeABANumber.length > 0 && prevState.chequeBankAccountNumber.length > 0
            } else {
                isValid = prevState.isCardValid && prevState.name.length > 0 && prevState.expiry.length >= 4 && prevState.cvc.length === 3
            }
            return {
                paymentType: value, 
                isFormValid: isValid,
                focused: '',
                number: '',
                name: '',
                expiry: '',
                cvc: '',
                chequeABANumber: '',
                chequeBankAccountNumber: '',
            }
        });
    };

    handleAdhocPaymentInput = event => {
        this.setState({adhocPayment: event.target.value});
        this.props.changeAdhocAmount(true, event.target.value);
    };

    handleAdhocAmountInputValidation = () => {
        const actualTotalPayableAmount = this.props.invoices.filter(invoice => invoice.selected).reduce((accumulator, invoice) => {
            return accumulator + (+this.props.paymentAmounts[invoice.invoiceNumber])
        },  0);
        if (+this.state.adhocPayment > actualTotalPayableAmount) {
            this.setState({adhocPayment: actualTotalPayableAmount});
        }
    }

    toggleAdhoc = () => {
        this.setState(prevState => {
            this.props.changeAdhocAmount(!prevState.adhocEnabled, prevState.adhocPayment);
            return { adhocEnabled: !prevState.adhocEnabled }
        });
    }

    handleInputFocus = ({ target }) => {
        this.setState({
          focused: target.name,
        });
    };

    handleInputChange = ({ target }) => {
        if (target.name === 'number') {
          this.setState({
            [target.name]: target.value.replace(/ /g, ''),
          });
        }
        else if (target.name === 'expiry') {
          this.setState({
            [target.name]: target.value.replace(/ |\//g, ''),
          });
        }
        else {
          this.setState({
            [target.name]: target.value,
          });
        }
    
        this.setState(prevState => {
          let isValid = false;
          if (prevState.paymentType === 'ach') {
            isValid = prevState.chequeABANumber.length > 0 && prevState.chequeBankAccountNumber.length > 0
          } else {
            isValid = prevState.isCardValid && prevState.name.length > 0 && prevState.expiry.length >= 4 && prevState.cvc.length === 3
          }
          return {
            isFormValid: isValid
          }
        })
    };

    handleCallback = (type, isValid) => {
        this.setState(prevState => {
          let isFormValid = isValid && prevState.name.length > 0 && prevState.expiry.length >= 4 && prevState.cvc.length === 3
          return {
            isCardValid: isValid,
            isFormValid: isFormValid
          }
        })
    }
    
    render() {
        const { paymentType, adhocEnabled, adhocPayment, number, name, expiry, cvc, focused,
            chequeABANumber, chequeBankAccountNumber, isFormValid } = this.state;
        const { classes, invoices, paymentAmounts } = this.props;
        const actualTotalPayableAmount = invoices.filter(invoice => invoice.selected).reduce((accumulator, invoice) => {
            return accumulator + (+paymentAmounts[invoice.invoiceNumber])
        },  0);
        const totalPayableAmount = adhocEnabled ? adhocPayment : actualTotalPayableAmount;
        const serviceCharges = paymentType === 'credit' ? 2.5/100 * totalPayableAmount : 0;
        const netAmount = totalPayableAmount + serviceCharges;
        const displayCardInfo = (paymentType === 'credit' || paymentType === 'debit') && netAmount > 0;
        const displayACHInfo = paymentType === 'ach' && netAmount > 0;
        return (
            <Paper className={classes.root}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} sm={7}>
                        <Grid container alignItems="center" spacing={8}>
                            <Grid item className={classes.paymentTypeTypo}>
                                <Typography variant="subheading">Payment type: </Typography>
                            </Grid>
                            <Grid item xs={12} sm>
                                <FormControl component="fieldset" required>
                                    <RadioGroup
                                        aria-label="payment type"
                                        name="paymentType"
                                        className={classes.paymentTypeOptions}
                                        value={this.state.paymentType}
                                        onChange={(event) => this.handlePaymentTypeChange(event.target.value)}
                                    >
                                        <FormControlLabel value="debit" control={<Radio />} label="Debit" />
                                        <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                                        <FormControlLabel value="ach" control={<Radio />} label="ACH" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={8}>
                            <Grid item xs={7} sm="auto">
                                <Typography variant="subheading" align="right" className={classes.typoLineHeight}>Total payable amount : </Typography>
                                <Typography variant="subheading" align="right" className={classes.typoLineHeight}>Service charges : </Typography>
                                <Typography variant="subheading" align="right" className={classes.typoLineHeight}>Net Amount : </Typography>
                            </Grid>
                            <Grid item xs={5} sm="auto">
                                {/* <Typography variant="subheading" align="right" className={classes.typoLineHeight}> */}
                                    <TextField 
                                        className={classes.totalPayableAmountInput}
                                        value={totalPayableAmount}
                                        disabled={!adhocEnabled}
                                        onChange={this.handleAdhocPaymentInput}
                                        onBlur={this.handleAdhocAmountInputValidation}
                                        InputProps={{
                                            inputComponent: CurrencyInputFormat,
                                        }}
                                        inputProps={{
                                            className: this.props.classes.currencyInput,
                                        }}
                                    />
                                {/* </Typography> */}
                                <Typography variant="subheading" align="right" className={classes.typoLineHeight}>
                                    <NumberFormat value={serviceCharges}
                                        fixedDecimalScale={true}
                                        decimalScale={2}
                                        displayType={'text'} thousandSeparator={true} prefix={'$'}
                                    />
                                </Typography>
                                <Typography variant="subheading" align="right" className={classes.typoLineHeight}>
                                    <NumberFormat value={netAmount}
                                        fixedDecimalScale={true}
                                        decimalScale={2}
                                        displayType={'text'} thousandSeparator={true} prefix={'$'}
                                    />
                                </Typography>
                            </Grid>
                            <Grid item>
                                <FormControlLabel className={classes.adhocPaymentSwitch} control={<Switch checked={adhocEnabled} onChange={this.toggleAdhoc}/>} label="Adhoc Payment" />
                                {adhocEnabled && <Hidden smUp>
                                    <Typography variant="subheading" align="right" className={classes.typoLineHeight}>
                                        You can edit Total payable amount
                                    </Typography>
                                </Hidden>}
                            </Grid>
                        </Grid>
                        {displayCardInfo && <CardDetails 
                            handleCallback={this.handleCallback}
                            handleInputFocus={this.handleInputFocus}
                            handleInputChange={this.handleInputChange}
                            number={number}
                            name={name}
                            expiry={expiry}
                            cvc={cvc}
                            focused={focused}
                            key={paymentType}
                        /> }
                        {displayACHInfo && <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="chequeABANumber">ABA No</InputLabel>
                                    <Input
                                        id="chequeABANumber"
                                        name="chequeABANumber"
                                        value={chequeABANumber}
                                        onChange={this.handleInputChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="chequeBankAccountNumber">Bank Account Number</InputLabel>
                                    <Input
                                        id="chequeBankAccountNumber"
                                        name="chequeBankAccountNumber"
                                        value={chequeBankAccountNumber}
                                        onChange={this.handleInputChange}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>}
                    </Grid>
                    {displayCardInfo && <Hidden smDown>
                        <Grid item sm={5}>
                            <Cards
                                number={number}
                                name={name}
                                expiry={expiry}
                                cvc={cvc}
                                focused={focused}
                                callback={this.handleCallback}
                            />
                        </Grid>
                    </Hidden>}
                    {displayACHInfo && <Hidden smDown>
                        <Grid item sm={5}>
                            <Paper className={classes.chequeContainer} elevation={1}>
                            <Typography variant="body1" component="h3">
                                Pay to the order of
                            </Typography>
                            <Typography variant="body2" component="h3" className={classes.chequeToName}>
                                Gabriel &amp; Co
                            </Typography>
                            <Grid container spacing={24}>
                                <Grid item sm={3}>
                                    <Paper className={classes.chequeNumber}>{chequeABANumber}</Paper>
                                    <Typography variant="body1" component="h3">
                                        ABA No.
                                    </Typography>
                                </Grid>
                                <Grid item sm={6}>
                                    <Paper className={classes.chequeNumber}>{chequeBankAccountNumber}</Paper>
                                    <Typography variant="body1" component="h3">
                                        Bank Account No.
                                    </Typography>
                                </Grid>
                                <Grid item sm={3}>
                                    <Paper className={classes.chequeNumber}>
                                        <NumberFormat value={netAmount}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            displayType={'text'} thousandSeparator={true} prefix={'$'}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                            </Paper>
                        </Grid>
                    </Hidden>}
                </Grid>
                <Grid container spacing={8} justify="flex-end">
                    <Button variant="contained" color="primary" 
                        className={classes.button} disabled={!isFormValid || netAmount <= 0} 
                        onClick={this.storeSelectedData}
                        component={Link} to='/success'
                    >
                        Proceed to Pay
                    </Button>
                </Grid>
            </Paper>
        );
    }
}

PaymentDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    invoices: state.invoice.invoices,
    paymentAmounts: state.invoice.paymentAmounts,
    adhocPayment: state.invoice.adhocPayment,
    adhocEnabled: state.invoice.adhocPaymentEnabled
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchInvoices,
    toggleAllInvoices,
    toggleInvoice,
    changeAdhocAmount
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PaymentDetails));