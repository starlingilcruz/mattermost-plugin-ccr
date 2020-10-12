import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage } from 'react-intl';
import { Client4 } from 'mattermost-redux/client';
import { components } from 'react-select'
import AsyncSelect from 'react-select/async';

import UserList from 'components/user_list/user_list';
import httpClient from 'service';


export default class ChannelModeration extends React.PureComponent {
  static propTypes = {
    teamId: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    // Client4.getProfilePictureUrl(this.props.user.id, this.props.user.last_picture_update)

    this.state = {
      members: [],
      groupSelected: "",
      roleSelected: "",
      errorMsg: ""
    }

    console.log(props)
  }

  loadFilterKeysOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      httpClient.getUserFilterKeys()
      .then((r) => {
        resolve(r.keys.map(row => {
          return {
            value: row.id,
            label: row.display_name
          }
        }))
      })
      .catch(error => {
        reject(error);
        console.log(error)
      });
    })
  }

  loadRoleOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      httpClient.getChannelRoles(this.props.teamId)
      .then((res) => {
        resolve((res.roles || []).map(row => {
          return {
            value: row.name,
            label: row.display_name
          }
        }))
      })
      .catch(error => {
        reject(error);
        console.log(error)
      });
    })
  }

  onSelectGroup = (e) => {
    const group = e.value;

    httpClient.getChannelUsersByKey(this.props.teamId, this.props.channelId, group)
    .then(result => {
      this.setState({
        groupSelected: group,
        members: result.map(row => {
          return row.user
        })
      });
    })
    .catch(error => {
      console.log(error)
    });
  }

  onSelectRole = (e) => {
    this.setState({ roleSelected: e.value });
  }

  applyRole = (user) => {
    const { id } = user;
    const { groupSelected, roleSelected } = this.state;

    httpClient.updateUserChannelRoles(id, this.props.channelId, roleSelected)
    .then(reponse => {
        user.saving = false;
        this.setState({
          members: [...this.state.members, user]
        })
      }
    ).catch(error => {
      console.log(error)
    });
  }

  render() {
    const styles = {height: "500px"}
    const controlStyles = {
      background: "white",
      color: 'black',
    };

    const GroupControlComponent = props => (
      <div style={controlStyles}>
        <FormattedMessage
            id='channel_moderation.filter_keys'
            defaultMessage='Group'
            style={{paddingBottom: "10px"}}
        />
        <components.Control {...props} />
      </div>
    );

    const RolesControlComponent = props => (
      <div style={controlStyles}>
        <FormattedMessage
            id='channel_moderation.filter_keys'
            defaultMessage='Role'
        />
        <components.Control {...props} />
      </div>
    );

    return (
      <div style={styles}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs>
            <AsyncSelect
               cacheOptions
               defaultOptions
               isClearable
               components={{ Control: GroupControlComponent }}
               loadOptions={this.loadFilterKeysOptions}
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
              onSelect={this.applyRole}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}
