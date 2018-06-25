import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Tooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';

const styles = theme => ({
    disabled: {
        pointerEvents: 'none',
        opacity: 0.5,
        filter: 'grayscale(0.5)',
    },
    tableCellPaddingNone: {
        '&:last-child': {
            paddingRight: 4,
            [theme.breakpoints.up('sm')]: {
                paddingRight: 8,
            },
        }
    },
});

class EnhancedTableHead extends Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { classes, columns, onSelectAllClick, order, orderBy, numSelected, rowCount, adhocPaymentEnabled } = this.props;

        return (
            <TableHead className={classNames({
                [classes.disabled]: rowCount <= 0,
            })}>
                <TableRow>
                    <TableCell padding="none" 
                        className={classNames({
                            [classes.disabled]: adhocPaymentEnabled
                        })}
                    >
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {columns.map(column => {
                        return (
                            <TableCell classes={{paddingNone: classes.tableCellPaddingNone}}
                                key={column.id}
                                numeric={column.numeric}
                                padding="none"
                                // padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === column.id ? order : false}
                            >
                                {/* <Tooltip
                                    title="Sort"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                > */}
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.createSortHandler(column.id)}
                                    >
                                        {column.name}
                                    </TableSortLabel>
                                {/* </Tooltip> */}
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    adhocPaymentEnabled: PropTypes.bool
};

export default withStyles(styles)(EnhancedTableHead);