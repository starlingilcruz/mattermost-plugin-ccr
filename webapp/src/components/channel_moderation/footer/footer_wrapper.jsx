import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import SpinnerButton from 'components/spinner_button';

export default class FooterWrapper extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    spinning: PropTypes.boolean,
    onSubmit: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container alignItems="flex-end">
        <Grid item xs>
          <SpinnerButton
              id='interactiveDialogSubmit'
              type='button'
              className='btn btn-primary save-button'
              spinningText={this.props.text}
              spinning={this.props.spinning}
              onClick={this.props.onSubmit}
          >
            {this.props.text}
          </SpinnerButton>
        </Grid>
      </Grid>
    );
  }
}
