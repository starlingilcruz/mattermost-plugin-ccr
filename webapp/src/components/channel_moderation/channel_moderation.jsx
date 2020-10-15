import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { components } from 'react-select'
import AsyncSelect from 'react-select/async';

import UserList from 'components/user_list/user_list';
import httpClient from 'service';

export default class ChannelModeration extends React.PureComponent {
  static propTypes = {
    channel: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { team_id, type } = this.props.channel;

    const isChannel = team_id && type != 'D' ? true : false;
    const error = !isChannel ? 'Channel moderation is not available for direct messages' : null;

    this.state = {
      members: [],
      groupSelected: null,
      roleSelected: null,
      isChannel: isChannel,
      error: error
    }
  }

  loadGroupOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      httpClient.getUserFilterGroups().then((response) => {
        if (!response) {
          return;
        }

        const groups = response.groups.map(group => {
          return {
            value: group.id,
            label: group.display_name
          }
        });

        resolve(groups);
      })
      .catch(error => {
        this.setState({ error: error });
        reject(error);
      });
    })
  }

  loadRoleOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      httpClient.getChannelRoles(this.props.channel.team_id)
      .then((response) => {
        if (!response) {
          return;
        }

        const roles = (response.roles || []).map(role => {
          return {
            value: role.name,
            label: role.display_name
          }
        });

        resolve(roles);
      })
      .catch(error => {
        this.setState({ error: error });
        reject(error);
      });
    })
  }

  onSelectGroup = (e) => {
    httpClient.getChannelUsersByGroup(
      this.props.channel.team_id, this.props.channel.id, e.value
    ).then(channelMembers => {
      if (!channelMembers) {
        return;
      }

      const members = channelMembers.map(channelMember => {
        return {
          ...channelMember.user,
          'channel_roles': channelMember.channel.roles
        }
      });

      this.setState({ groupSelected: e.value, members: members });
    })
    .catch(error => {
      this.setState({ error: error });
    });
  }

  onSelectRole = (e) => {
    this.setState({ roleSelected: e.value });
  }

  applyRole = (user, create = true) => {
    const { roleSelected } = this.state;
    var roles = user.channel_roles.split(" ");

    if (create) {
      if (roles.indexOf(roleSelected) === -1) {
        roles.push(roleSelected);
      }
    } else {
      roles = roles.filter((roleName) => roleName !== roleSelected);
    }

    const rolesName = roles.join(" ");

    httpClient.updateUserChannelRoles(user.id, this.props.channel.id, rolesName)
    .then(response => {
      if (!response) {
        return
      }

      let members = [...this.state.members];
      const memberIndex = members.findIndex(member => member.id === user.id);
      members[memberIndex] = {
        ...members[memberIndex],
        'channel_roles': response.explicit_roles,
      }

      this.setState({ members: members });

    }).catch(error => {
      this.setState({ error: error });
    });
  }

  // temporary work-around
  applyRoleToAll = (create = true) => {
    for (const member of this.state.members) {
      this.applyRole(member, create);
    }
  }

  hasCurrentRole = (rolesName) => {
    if (!this.state.roleSelected) {
      return false;
    }
    const roles = rolesName.split(' ');
    if (roles.indexOf(this.state.roleSelected) >= 0) {
      return true
    }
    return false;
  }

  render() {
    const { isChannel, members, error } = this.state;

    const containerStyle = {
      height: members.length ? '600px' : '300px'
    }

    const selectStyle = { background: 'white', color: 'black' };

    const GroupControlComponent = props => (
      <div style={selectStyle}>
        <span style={{paddingBottom: '10px'}}>Group</span>
        <components.Control {...props} />
      </div>
    );

    const RolesControlComponent = props => (
      <div style={selectStyle}>
        <span style={{paddingBottom: '10px'}}>Role</span>
        <components.Control {...props} />
      </div>
    );

    return (
      <React.Fragment>

        {error && (
            <div className='error-text'>{error}</div>
        )}

        { isChannel && (
          <div style={containerStyle}>
            <Grid container direction='column' spacing={3}>
              <Grid item xs>
                <AsyncSelect
                   cacheOptions
                   defaultOptions
                   isClearable
                   components={{ Control: GroupControlComponent }}
                   loadOptions={this.loadGroupOptions}
                   onChange={this.onSelectGroup}
                 />
              </Grid>
              <Grid item xs>
                <AsyncSelect
                   cacheOptions
                   defaultOptions
                   isClearable
                   components={{ Control: RolesControlComponent }}
                   loadOptions={this.loadRoleOptions}
                   onChange={this.onSelectRole}
                 />
              </Grid>
              <Grid item xs>
                <UserList
                  users={this.state.members}
                  toggleChecked={this.applyRole}
                  toggleCheckAll={this.applyRoleToAll}
                  markAsChecked={(user) => this.hasCurrentRole(user.channel_roles)}
                  disabledCheckbox={!this.state.roleSelected}
                />
              </Grid>
            </Grid>
          </div>
        )}

      </React.Fragment>
    );
  }
}
