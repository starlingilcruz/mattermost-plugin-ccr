package main

import (
	"net/http"
  "encoding/json"

	"github.com/mattermost/mattermost-server/v5/plugin"
)

/*
  TODO: use context to handle the requests timeout.
*/

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
  config := p.getConfiguration()
	if err := config.IsValid(); err != nil {
		http.Error(w, "This plugin is not configured.", http.StatusNotImplemented)
		return
	}

  w.Header().Set("Content-Type", "application/json")

  switch r.URL.Path {
  case API_USER_FILTER_KEY_PATH:
    p.getUserFilterKeys(w, r)
  case API_USER_FILTER_PATH:
    p.filterChannelUserByKey(w, r)
  case API_CHANNEL_ROLES_PATH:
    p.getChannelRoles(w, r)
  case API_UPDATE_USER_CHANNEL_ROLE_PATH:
    p.updateUserChannelRoles(w, r)
  default:
		http.NotFound(w, r)
  }
}

func (p *Plugin) getUserFilterKeys(w http.ResponseWriter, r *http.Request) {
  filterKeys := p.FetchUserFilterKeys()

  b, err := json.Marshal(filterKeys)
  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }

  w.Write(b)
}

func (p *Plugin) filterChannelUserByKey(w http.ResponseWriter, r *http.Request) {
  props := p.MapFromJson(r.Body)

  teamId := props["teamId"]
  channelId := props["channelId"]
  key := props["key"]

  team, err := p.API.GetTeam(teamId)

  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }

  serviceEndpoint := p.getConfiguration().UserFilterEndpoint
  serviceEndpoint = p.AddTeamToURL(serviceEndpoint, team.Name) + "/" + key

  usersMetadata := p.FetchChannelUsers(serviceEndpoint, channelId)

  w.Write([]byte(usersMetadata.ToJson()))
}

func (p *Plugin) getChannelRoles(w http.ResponseWriter, r *http.Request) {
  props := p.MapFromJson(r.Body)
  teamId := props["teamId"]

  team, err := p.API.GetTeam(teamId)

  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }

  serviceEndpoint := p.getConfiguration().TeamChannelRolesEndpoint
  serviceEndpoint = p.AddTeamToURL(serviceEndpoint, team.Name)

  roles := p.FetchChannelRoles(serviceEndpoint)

  b, e := json.Marshal(roles)
  if e != nil {
    http.Error(w, err.Error(), 500)
    return
  }

  w.Write(b)
}

func (p *Plugin) updateUserChannelRoles(w http.ResponseWriter, r *http.Request) {
  props := p.MapFromJson(r.Body)
	// required params
	userId := props["userId"]
	channelId := props["channelId"]
	rolesName := props["rolesName"] // shape: "role_a role_b"

	member, err := p.API.GetChannelMember(channelId, userId)

	if err != nil {
		p.API.LogWarn("User is not member of this channel.")
		return
	}

	member, err = p.API.UpdateChannelMemberRoles(channelId, userId, rolesName)

	if err != nil {
		p.API.LogWarn("Could not update channel role for specific user.")
		return
	}

	w.Write([]byte(member.ToJson()))
}
