import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';
import { toggleInvoice } from './actions/invoice';

const styles = theme => ({
    
});

class EnhancedTable extends Component {

    getTableRow = (invoice) => {
        const columnsToBeDisplayed = this.props.columns.filter(column => column.display);
        
        let tableCells = columnsToBeDisplayed.map(column => {
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
        const { columns, invoices, fetchingInvoices, order, orderBy, page, rowsPerPage } = this.props;

        return (
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
                </TableRow> }
            </TableBody>
        );
    }
}

EnhancedTable.propTypes = {
    columns: PropTypes.array.isRequired,
    order: PropTypes.string,
    orderBy: PropTypes.string,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};

const mapStateToProps = state => ({
    fetchingInvoices: state.invoice.fetching,
    invoices: state.invoice.invoices,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleInvoice
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable));