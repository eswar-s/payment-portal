import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

class CurrencyInputFormat extends Component {
    render() {
        const { inputRef, onChange, ...other } = this.props;

        return (
            <NumberFormat
                {...other}
                ref={inputRef}
                onValueChange={values => {
                    onChange({
                        target: {
                            value: values.value
                        },
                    });
                }}
                thousandSeparator
                prefix="$"
                decimalScale={2}
                fixedDecimalScale={true}
                style={{textAlign: 'right'}}
            />
        );
    }
}

CurrencyInputFormat.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CurrencyInputFormat;
