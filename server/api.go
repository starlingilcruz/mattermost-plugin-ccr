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
	w.Header().Set("Content-Type", "application/json")

  config := p.getConfiguration()
	if err := config.IsValid(); err != nil {
		http.Error(w, "This plugin is not configured.", http.StatusNotImplemented)
		return
	}

  switch r.URL.Path {
	  case API_USER_FILTER_GROUP_PATH:
	    p.getUserFilterGroups(w, r)
	  case API_USER_FILTER_PATH:
	    p.filterChannelUserByGroup(w, r)
	  case API_CHANNEL_ROLES_PATH:
	    p.getChannelRoles(w, r)
	  case API_UPDATE_USER_CHANNEL_ROLE_PATH:
	    p.updateUserChannelRoles(w, r)
	  default:
			http.NotFound(w, r)
	}
}

func (p *Plugin) getUserFilterGroups(w http.ResponseWriter, r *http.Request) {
  filterKeys := p.FetchUserFilterGroups()

  b, err := json.Marshal(filterKeys)
  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }

  w.Write(b)
}

func (p *Plugin) filterChannelUserByGroup(w http.ResponseWriter, r *http.Request) {
  props := p.MapFromJson(r.Body)

  teamId := props["teamId"]
  channelId := props["channelId"]
  group := props["group"]

  team, err := p.API.GetTeam(teamId)

  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }

  serviceEndpoint := p.getConfiguration().UserFilterEndpoint
  serviceEndpoint = p.AddTeamToURL(serviceEndpoint, team.Name) + "/" + group

  usersMetadata := p.FetchChannelUsers(serviceEndpoint, channelId)

	if usersMetadata == nil {
		return
	}

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
