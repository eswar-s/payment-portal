import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

const styles = theme => ({
    root: {
        margin: 4,
        paddingTop: 64,
        [theme.breakpoints.up('sm')]: {
            width: 320,
            position: 'fixed',
            right: 4,
            top: 24,
            margin: 0,
            zIndex: 1101,
            paddingTop: 0,
        }
    },
    card: {
        display: 'flex',
        justifyContent: 'center'
    },
    details: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        padding: '12px !important',
    },
    cover: {
        width: '50%',
        height: 'auto',
        backgroundSize: 'contain'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    cardContentRoot: {
        padding: 12,
    },
    retailerName: {
        alignSelf: 'center',
        flex: 1,
        padding: 4,
        textAlign: 'center',
        fontFamily: "'Averia Serif Libre', cursive",
        backgroundImage: 'linear-gradient(90deg, #fa441d 0%, #ff3005 15%, #ff0047 30%, #A166AB 44%, #5073B8 58%, #1098AD 72%, #07B39B 86%, #6DBA82 100%)',
        backgroundSize: 'cover',
        '-webkit-background-clip': 'text',
        textFillColor: 'transparent',
    }
});

class RetailerInfo extends Component {

    render() {
        const { classes, customer } = this.props;
        return (
            <div className={classes.root}>
                {customer && <Card className={classes.card}>                    
                    <Typography variant="subheading" component="h3" className={classes.retailerName}>
                        {customer.name}
                    </Typography>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography variant="caption" color="textSecondary">
                                {customer.address1}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {customer.address2}, {customer.city}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {customer.state}, {customer.zipCode}, {customer.country}
                            </Typography>
                        </CardContent>
                    </div>
                </Card> }
            </div>
        );
    }
}

RetailerInfo.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    customer: state.auth.customer,
})

export default connect(mapStateToProps)(withStyles(styles)(RetailerInfo));