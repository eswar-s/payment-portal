import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

class FlagGenericIcon extends Component {
  render() {
    return (
        <SvgIcon {...this.props} viewBox="0 0 54 54">
            <g fill="none" stroke="currentColor">
              <path strokeWidth="7.103" d="M 38.338792 25.207413 A 14.319308 14.319308 0 1 1 9.7001753,25.207413 A 14.319308 14.319308 0 1 1 38.338792 25.207413 z" transform="matrix(.82746 0 0 .82746 7.058 6.517)"/>
              <path strokeWidth="6.2" d="M18.476526 18.740629L11.7018 12.273845 18.476526 18.740629zM35.721285 18.894599L42.188069 12.119873 35.721285 18.894599zM42.496011 42.760113L35.721285 36.293329 42.496011 42.760113zM11.393858 42.914084L17.860642 36.139358 11.393858 42.914084z"/>
            </g>
        </SvgIcon>
    );
  }
}

FlagGenericIcon.propTypes = {
  classes: PropTypes.object,
};

export default FlagGenericIcon;
