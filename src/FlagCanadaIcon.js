import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

class FlagCanadaIcon extends Component {
  render() {
    return (
        <SvgIcon {...this.props} viewBox="0 0 1000 500">
            <path fill="red" d="M0 0h1000v500H0z"/><path fill="#fff" d="M250 0h500v500H250z"/><path fill="red" d="M500 47l-34 64c-4 6-11 6-18 2l-25-13 19 98c4 18-9 18-15 10l-43-48-7 24c-1 3-4 7-10 6l-54-11 14 52c3 11 6 16-3 19l-19 9 94 76c3 3 5 8 4 13l-8 27 93-13c3 0 8 5 8 8l-5 99h16l-2-99c0-3 4-8 7-8l93 13-8-27c-1-5 1-10 4-13l94-76-19-9c-9-3-6-8-3-19l14-52-54 11c-6 1-9-3-10-6l-7-24-43 48c-6 8-19 8-15-10l19-98-25 13c-7 4-14 4-18-2"/>
        </SvgIcon>
    );
  }
}

FlagCanadaIcon.propTypes = {
  classes: PropTypes.object,
};

export default FlagCanadaIcon;
