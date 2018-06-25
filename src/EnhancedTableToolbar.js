import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
// import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FlagCanadaIcon from './FlagCanadaIcon';
import FlagUnitedStatesAmericaIcon from './FlagUnitedStatesAmericaIcon';
import FlagGenericIcon from './FlagGenericIcon';

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        flex: '0 0 auto',
    },
    checkBox: {
        height: 24,
        width: 24
    },
    currencies: {
        borderLeft: '1px solid #959595',
        borderRadius: 4,
        height: 48,
        [theme.breakpoints.up('sm')]: {
            borderRadius: 8,
        },
    },
    rootCountry: {
        minWidth: 48,
        padding: 0,
        filter: 'grayscale(1)'
    },
    selectedCountry: {
        filter: 'grayscale(0)',
        padding: '0 !important',
    },
    disabled: {
        pointerEvents: 'none',
        opacity: 0.5,
        filter: 'grayscale(0.5)',
    },
});

const ITEM_HEIGHT = 48;

class EnhancedTableToolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterElement: null,
        }
    }

    handleClick = event => {
        this.setState({ filterElement: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ filterElement: null });
    };

    getIconBy = currencyName => {
        switch(currencyName) {
            case 'USD':
                return <FlagUnitedStatesAmericaIcon />
            case 'CAD':
                return <FlagCanadaIcon />
            default:
                return <FlagGenericIcon />
        }
    }

    render() {
        const { classes, numSelected, columns, currencies, adhocPaymentEnabled } = this.props;
        const { filterElement } = this.state;
        let selectedCurrencyIndex = currencies.findIndex(currency => currency.selected);
        const currenciesWithIcons = currencies.map(currency => {
            return {...currency, icon: this.getIconBy(currency.name)}
        })
        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div className={classes.title}>
                    {numSelected > 0 ? (
                        <Typography color="inherit" variant="subheading">
                            {numSelected} Invoices Selected
                        </Typography>
                    ) : (
                        <Typography variant="title" id="tableTitle">
                            Open Invoices
                        </Typography>
                    )}
                </div>
                <div className={classes.spacer} />
                {numSelected > 0 ? (
                    <div className={classNames(classes.actions, {
                        [classes.disabled]: adhocPaymentEnabled
                    })}>
                        {/* <Tooltip title="Clear All"> */}
                            <IconButton aria-label="Clear All" onClick={this.props.unselectAll}>
                                <ClearAllIcon />
                            </IconButton>
                        {/* </Tooltip> */}
                    </div>
                ) : (
                    <div className={classes.actions}>
                        {/* <Tooltip title="Filter list"> */}
                            <IconButton aria-label="Filter list" onClick={this.handleClick}>
                                <FilterListIcon/>
                            </IconButton>
                        {/* </Tooltip> */}
                        <BottomNavigation
                            className={classes.currencies}
                            value={selectedCurrencyIndex}
                            onChange={(event, value) => selectedCurrencyIndex !== value && this.props.toggleCurrency(value)}
                            showLabels
                        >
                            {currenciesWithIcons.map(currency => (
                                <BottomNavigationAction key={currency.name} classes={{selected: classes.selectedCountry, root: classes.rootCountry}} label={currency.name} icon={currency.icon} />
                            ))}
                        </BottomNavigation>
                        <Menu
                            anchorEl={filterElement}
                            open={Boolean(filterElement)}
                            onClose={this.handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5
                                },
                            }}
                        >
                            {columns.map(option => (
                                <MenuItem key={option.name} onClick={() => this.props.toggleColumns(option)} dense disabled={option.disabled}>
                                    <Checkbox
                                        checked={option.display}
                                        tabIndex={-1}
                                        className={classes.checkBox}
                                    />
                                    <ListItemText primary={option.name} />
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                )}
            </Toolbar>
        );
    }
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    unselectAll: PropTypes.func,
    columns: PropTypes.array,
    currencies: PropTypes.array,
    toggleColumns: PropTypes.func,
    toggleCurrency: PropTypes.func,
    adhocPaymentEnabled: PropTypes.bool
};

export default withStyles(styles)(EnhancedTableToolbar);