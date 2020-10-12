import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import SpinnerButton from 'components/spinner_button';
import Avatar from 'components/avatar/avatar';

export default class UserList extends React.PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    onSelect: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

//  <Avatar username={user.username} url={user.username}/>
  render() {
    let { users } = this.props;

    let usersGrid = users.map(user => {
      return (
        <Grid container direction="row" spacing={3}>
          <Grid item xs={6} zeroMinWidth>
            {user.email}
          </Grid>
          <Grid item xs={4}>
            {user.notify_props.push_status}
          </Grid>
          <Grid item xs={2}>
            <SpinnerButton
                id='interactiveDialogSubmit'
                type='button'
                className='btn btn-primary save-button'
                spinningText="Apply"
                spinning={user && user.saving}
                onClick={(e) => {
                  e.preventDefault();
                  user.saving = true;
                  this.props.onSelect(user)
                }}
            >
              Apply
            </SpinnerButton>
          </Grid>
        </Grid>
      )
    })
    
    return (
      <React.Fragment>
        {usersGrid}
      </React.Fragment>
    );
  }
}
