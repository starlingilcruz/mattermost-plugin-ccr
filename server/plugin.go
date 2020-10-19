package main

import (
	"sync"

	"github.com/mattermost/mattermost-server/v5/plugin"
	"github.com/mattermost/mattermost-server/v5/model"
)

const (
	API_USER_FILTER_GROUP_PATH          = "/api/user/groups"
	API_USER_FILTER_PATH              = "/api/filter/user"
	API_CHANNEL_ROLES_PATH            = "/api/channel/roles"
	API_UPDATE_USER_CHANNEL_ROLE_PATH = "/api/user/channel/update_roles"
	URL_TEAM_SLUG_SHADOW              = "<team_slug>"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration

	// service *Service
}

// type Service struct {
// 	FetchChannelUsersByKey(endpoint string, channelId string, key string) UsersMetadata
// }

type UserFilterGroup struct {
	Id          string `json:"id"`
	DisplayName string `json:"display_name"`
	Description string `json:"description"`
}

type FilterGroupsHttpResponse struct {
  Groups []UserFilterGroup `json:"groups"`
}

type Role struct {
  Id string  `json:"id"`
  Name string `json:"name"`
	DisplayName string `json:"display_name,omitempty"`
}

type RoleHttpResponse struct {
  Roles []Role `json:"roles"`
}

type UserMetadata struct {
	User            model.User          `json:"user"`
	ChannelUserData model.ChannelMember `json:"channel"`
}

type UserFilterHttpResponse struct {
	Ids []string `json:"ids"`
}

type UsersMetadata []UserMetadata
