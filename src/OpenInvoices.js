import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EnhancedTable from './EnhancedTable';
import PaymentDetails from './PaymentDetails';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        position: 'relative',
    },
});

class OpenInvoices extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes, invoices } = this.props;
        return (
            <div className={classes.root}>
                <EnhancedTable />
                {invoices.length > 0 && <PaymentDetails />}
            </div>
        )
    }
}

OpenInvoices.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    customer: state.auth.customer,
    invoices: state.invoice.invoices
})

const mapDispatchToProps = dispatch => bindActionCreators({
    changePage: () => push('/payment-success')
}, dispatch)

export default connect(mapStateToProps,
    mapDispatchToProps)(withStyles(styles)(OpenInvoices));