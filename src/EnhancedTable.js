import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import CurrencyInputFormat from './CurrencyInputFormat';

import { fetchInvoices, toggleInvoice, 
    toggleAllInvoices, changePaymentAmount } from './actions/invoice';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        position: 'relative',
    },
    disabled: {
        pointerEvents: 'none',
        opacity: 0.5,
        filter: 'grayscale(0.5)',
    },
    table: {
        // minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
        padding: 0
    },
    linearProgress: {
        position: 'absolute',
        width: '100%',
    },
    paginationToolbar: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 2,
        }
    },
    paginationActions: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: 4,
        }
    },
    currencyInput: {
        padding: '0 4px',
        width: 96,
        [theme.breakpoints.up('sm')]: {
            padding: '0 8px',
            width: 150,
        }
    }
});

class EnhancedTable extends Component {

    constructor(props) {
        super(props);
        let currencies = props.customer.availableCurrencies.map((currency, index) => {
            return {
                name: currency,
                selected: index === 0
            }
        })
        let columns = invoiceColumns;
        if (isWidthDown('sm', this.props.width)) {
            columns = columns.map(column => {
                return { ...column, display: column.mobileDisplay }
            })
        }
        this.state = {
            currencies,
            columns,
            order: 'asc',
            orderBy: 'dueDate',
            page: 0,
            rowsPerPage: 5,
        };

        this.props.fetchInvoices(currencies.find(currency => currency.selected).name);
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.startTime !== this.state.startTime) {
    //         this.setState({ startTime: nextProps.startTime });
    //     }
    // }

    toggleColumns = option => {
        this.setState(prevState => {
            let columns = prevState.columns.map(value => {
                if (value === option) {
                    value.display = !option.display;
                }
                return value;
            });
            return { columns }
        })
    }

    toggleCurrency = value => {
        this.setState(prevState => {
            let currencies = prevState.currencies.map((currency, index) => {
                return {
                    name: currency.name,
                    selected: value === index
                }
            });
            this.props.fetchInvoices(currencies.find(currency => currency.selected).name);
            return { currencies }
        })
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handlePaymentAmountInput = (event, invoice) => {
        this.props.changePaymentAmount(invoice.invoiceNumber, event.target.value);
    };

    handlePaymentAmountInputValidation = (invoice) => {
        if (this.props.paymentAmounts[invoice.invoiceNumber] > invoice.netAmount || this.props.paymentAmounts[invoice.invoiceNumber] <= 0) {
            this.props.changePaymentAmount(invoice.invoiceNumber, invoice.netAmount);
        }
    };

    getTableRow = (invoice) => {
        const columnsToBeDisplayed = this.state.columns.filter(column => column.display);
        const { paymentAmounts } = this.props;
        let tableCells = columnsToBeDisplayed.map(column => {
            if (column.id === 'paymentAmount') {
                return (
                    <TableCell key="paymentAmount" padding="none" numeric={column.numeric}>
                        <TextField 
                            value={paymentAmounts[invoice['invoiceNumber']]}
                            disabled={!invoice.selected}
                            onChange={event => this.handlePaymentAmountInput(event, invoice)}
                            onBlur={event => this.handlePaymentAmountInputValidation(invoice)}
                            classes={{root: this.props.classes.currencyInput}}
                            InputProps={{
                                inputComponent: CurrencyInputFormat,
                            }}
                            onClick={ invoice.selected ? (event) => event.stopPropagation(): undefined }
                        />
                    </TableCell>
                )
            }
            return (
                <TableCell key={column.id} padding="none" numeric={column.numeric}>
                    {column.name.indexOf('Amount') === -1 ? (
                        invoice[column.id]
                    ) : (
                            <NumberFormat value={invoice[column.id]}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )}
                </TableCell>
            )
        })

        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={false}
                tabIndex={-1}
                key={invoice.invoiceNumber}
                selected={invoice.selected}
                onClick={event => this.props.toggleInvoice(invoice.invoiceNumber)}
                className={classNames({
                    [this.props.classes.disabled]: this.props.adhocPaymentEnabled,
                })}
            >
                <TableCell padding="none">
                    <Checkbox checked={invoice.selected} />
                </TableCell>
                {tableCells}
            </TableRow>
        )
    }

    getSorting(order, orderBy) {
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    }

    render() {
        const { classes, fetchingInvoices, invoices } = this.props;
        const { currencies, columns, order, orderBy, page, rowsPerPage } = this.state;
        const columnsToBeDisplayed = columns.filter(column => column.display);
        const selectedInvoices = invoices.filter(invoice => invoice.selected);
        const totalAccountBalance = invoices.reduce((accumulator, invoice) => accumulator + (+invoice.netAmount), 0);
        return (
            <Paper className={classes.root}>
                {fetchingInvoices && <LinearProgress color="secondary" className={classes.linearProgress} />}
                <div className={classNames({
                    [classes.disabled]: fetchingInvoices,
                })}>
                    <EnhancedTableToolbar numSelected={selectedInvoices.length}
                        columns={columns} toggleColumns={this.toggleColumns}
                        currencies={currencies} toggleCurrency={this.toggleCurrency}
                        unselectAll={(event) => this.props.toggleAllInvoices(false)}
                        adhocPaymentEnabled={this.props.adhocPaymentEnabled}
                    />
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                numSelected={selectedInvoices.length}
                                columns={columnsToBeDisplayed}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={(event, checked) => this.props.toggleAllInvoices(checked)}
                                onRequestSort={this.handleRequestSort}
                                rowCount={invoices.length}
                                adhocPaymentEnabled={this.props.adhocPaymentEnabled}
                            />
                            <TableBody>
                                {invoices
                                    .sort(this.getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(this.getTableRow)}
                                {invoices.length === 0 && <TableRow style={{ height: 49 * 3 }}>
                                    <TableCell colSpan={columns.length + 1}>
                                        <Typography variant="body2" align="center" gutterBottom>
                                            {fetchingInvoices ? 'Finding open invoices, please wait...' : 'No open invoices at the moment'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <TablePagination
                    classes={{toolbar: classes.paginationToolbar, actions: classes.paginationActions}}
                    component="div"
                    count={invoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                {totalAccountBalance > 0 && <Typography variant="subheading" align="center">
                    <NumberFormat value={totalAccountBalance}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        displayType={'text'} thousandSeparator={true} prefix={'Total Account Balance: $'}
                    />
                </Typography>}
            </Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    customer: state.auth.customer,
    fetchingInvoices: state.invoice.fetching,
    invoices: state.invoice.invoices,
    paymentAmounts: state.invoice.paymentAmounts,
    adhocPaymentEnabled: state.invoice.adhocPaymentEnabled
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchInvoices,
    toggleAllInvoices,
    toggleInvoice,
    changePaymentAmount
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(withStyles(styles)(EnhancedTable)));


const invoiceColumns = [
    {
        id: 'invoiceNumber',
        name: 'Invoice Number',
        display: true,
        mobileDisplay: true,
        disabled: true,
        numeric: false,
    },
    {
        id: 'invoiceDate',
        name: 'Invoice Date',
        display: true,
        mobileDisplay: false,
        disabled: false,
        numeric: false,
    },
    {
        id: 'dueDate',
        name: 'Due Date',
        display: true,
        mobileDisplay: false,
        disabled: false,
        numeric: false,
    },
    {
        id: 'invoiceAmount',
        name: 'Invoice Amount',
        display: true,
        mobileDisplay: false,
        disabled: false,
        numeric: true,
    },
    {
        id: 'installment',
        name: 'Installment',
        display: true,
        mobileDisplay: false,
        disabled: false,
        numeric: true,
    },
    {
        id: 'discount',
        name: 'Discount',
        display: true,
        mobileDisplay: false,
        disabled: false,
        numeric: true,
    },
    {
        id: 'discountAmount',
        name: 'Discount Amount',
        display: true,
        mobileDisplay: false,
        disabled: false,
        numeric: true,
    },
    {
        id: 'netAmount',
        name: 'Net Amount',
        display: true,
        mobileDisplay: true,
        disabled: false,
        numeric: true,
    },
    {
        id: 'paymentAmount',
        name: 'Payment Amount',
        display: true,
        mobileDisplay: true,
        disabled: true,
        numeric: true
    }
];