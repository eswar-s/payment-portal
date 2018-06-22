import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';

import CurrencyInputFormat from './CurrencyInputFormat';

import { fetchInvoices, toggleInvoice, toggleAllInvoices, changeAdhocAmount } from './actions/invoice';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
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
    }
});

class PaymentDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            paymentType: '',
            adhocEnabled: this.props.adhocEnabled,
            adhocPayment: this.props.adhocPayment,
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

    handlePaymentTypeChange = event => {
        this.setState({ paymentType: event.target.value });
    }

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
    
    render() {
        const { paymentType, adhocEnabled, adhocPayment } = this.state;
        const { classes, invoices, paymentAmounts } = this.props;
        const actualTotalPayableAmount = invoices.filter(invoice => invoice.selected).reduce((accumulator, invoice) => {
            return accumulator + (+paymentAmounts[invoice.invoiceNumber])
        },  0);
        const totalPayableAmount = adhocEnabled ? adhocPayment : actualTotalPayableAmount;
        const serviceCharges = paymentType === 'credit' ? 2.5/100 * totalPayableAmount : 0;
        const netAmount = totalPayableAmount + serviceCharges;
        return (
            <Paper className={classes.root}>
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
                                onChange={this.handlePaymentTypeChange}
                            >
                                <FormControlLabel value="debit" control={<Radio />} label="Debit" />
                                <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                                <FormControlLabel value="ach" control={<Radio />} label="ACH" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item>
                        <Typography variant="subheading" align="right" className={classes.typoLineHeight}>Total payable amount : </Typography>
                        <Typography variant="subheading" align="right" className={classes.typoLineHeight}>Service charges : </Typography>
                        <Typography variant="subheading" align="right" className={classes.typoLineHeight}>Net Amount : </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subheading" align="right" className={classes.typoLineHeight}>
                            <TextField 
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
                        </Typography>
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
                    </Grid>
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