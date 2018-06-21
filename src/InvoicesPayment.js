import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import classNames from 'classnames';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import LinearProgress from '@material-ui/core/LinearProgress';
import TablePagination from '@material-ui/core/TablePagination';

import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTable from './EnhancedTable';

import { fetchInvoices, toggleAllInvoices } from './actions/invoice';

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
});

class InvoicesPayment extends Component {

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
                return {...column, display: column.mobileDisplay}
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

    componentWillMount() {
        console.log(this.props.customer);
    }

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

    render() {
        const { currencies, columns, order, orderBy, page, rowsPerPage } = this.state;
        const { classes, fetchingInvoices, invoices } = this.props;
        const columnsToBeDisplayed = columns.filter(column => column.display);
        const selectedInvoices = invoices.filter(invoice => invoice.selected);
        return (
            <Paper className={classes.root}>
                {fetchingInvoices && <LinearProgress color="secondary" className={classes.linearProgress}/>}
                <div className={classNames({
                    [classes.disabled]: fetchingInvoices,
                })}>
                    <EnhancedTableToolbar numSelected={selectedInvoices.length} 
                        columns={columns} toggleColumns={this.toggleColumns}
                        currencies={currencies} toggleCurrency={this.toggleCurrency} 
                        unselectAll={(event) => this.props.toggleAllInvoices(false)}
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
                            />
                            <EnhancedTable columns={columnsToBeDisplayed}
                                order={order}
                                orderBy={orderBy}
                                page={page}
                                rowsPerPage={rowsPerPage}
                            />
                        </Table>
                    </div>
                </div>
                <TablePagination
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
            </Paper>
        )
    }
}

InvoicesPayment.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    customer: state.auth.customer,
    fetchingInvoices: state.invoice.fetching,
    invoices: state.invoice.invoices,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchInvoices,
    toggleAllInvoices,
    changePage: () => push('/payment-success')
}, dispatch)

export default connect(mapStateToProps,
    mapDispatchToProps)(withStyles(styles)(withWidth()(InvoicesPayment)));


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
        numeric: true,
    }
];