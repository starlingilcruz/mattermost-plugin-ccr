import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage } from 'react-intl';
import { Client4 } from 'mattermost-redux/client';
import Avatar from 'components/avatar/avatar';

/* TODO:
- add status icon
- subscribe to status webhook
- avoid recreating all items when updating single one
*/
export default class UserList extends React.PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    toggleChecked: PropTypes.func,
    toggleCheckAll: PropTypes.func,
    markAsChecked: PropTypes.func,
    disabledCheckbox: PropTypes.boolean
  }

  constructor(props) {
    super(props);

    this.state = {
      checkAll: false
    }
  }

  render() {
    const { users } = this.props;
    const showGridHeader = users.length > 0;
    const count = users.length;

    const gridStyle = {
      borderBottomColor: '#F2F2F2',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      marginTop: "5px",
      marginBottom: "5px"
    }

    const UserRows = users.map((user) => {
      const profilePictureUrl = Client4.getProfilePictureUrl(
          user.id, user.last_picture_update
      )
      const isChecked = this.props.markAsChecked(user);

      return (
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          justify="space-between"
          style={gridStyle}
        >
          <Grid item xs={1}>
            <span className="profile-icon">
              <Avatar
                  username={user.username}
                  size="md"
                  url={profilePictureUrl}
              />
            </span>
          </Grid>

          <Grid item xs={10} zeroMinWidth>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              >
                <Grid item xs>
                  <FormattedMessage
                    id='user-list-grid.username'
                    defaultMessage='@{username}'
                    values={{
                      username: user.username
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <FormattedMessage
                    id='user-list-grid.email'
                    defaultMessage='{email}'
                    values={{
                      email: user.email
                    }}
                  />
                </Grid>
            </Grid>
          </Grid>

          <Grid item xs={1}>
            <input
              key={user.id}
              type="checkbox"
              checked={isChecked}
              onChange={(e) => this.props.toggleChecked(user, e.target.checked)}
              disabled={this.props.disabledCheckbox}
            />
          </Grid>
        </Grid>
      )
    });

    return (
      <React.Fragment>
        {showGridHeader && (
          <Grid container direction="row" spacing={2} style={gridStyle}>
            <Grid item xs={11}>
              <FormattedMessage
                  id='user_list.countTotalPage'
                  defaultMessage='Showing {count, number} {count, plural, one {member} other {members}}'
                  values={{
                      count
                  }}
              />
            </Grid>
            <Grid item xs={1}>
              <input
                type="checkbox"
                checked={this.state.checkAll}
                onChange={(e) => {
                   this.props.toggleCheckAll(e.target.checked);
                   this.setState({checkAll: !this.state.checkAll});
                }}
                disabled={this.props.disabledCheckbox}
              />
            </Grid>
          </Grid>
        )}

        {UserRows}

        {!showGridHeader && count === 0 && (
          <FormattedMessage
              id='user_list.notFound'
              defaultMessage='No users found'
          />
        )}
      </React.Fragment>
    );
  }
}
