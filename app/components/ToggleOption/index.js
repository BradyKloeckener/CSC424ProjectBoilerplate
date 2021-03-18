/**
 *
 * ToggleOption
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const ToggleOption = ({ value, message/*, intl*/ }) => {
  const {formatMessage} = useIntl();
  return (
    <option value={value}>{ message ? formatMessage(message) : value }</option>
  );
}
ToggleOption.propTypes = {
  value: PropTypes.string.isRequired,
  message: PropTypes.object,
  //intl: intlShape.isRequired,
};

export default ToggleOption;
