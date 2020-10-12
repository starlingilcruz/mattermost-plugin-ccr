package main

import (
  "net/http"

	"encoding/json"
  "io/ioutil"

	// "github.com/mattermost/mattermost-server/v5/model"

)

func (p *Plugin) FetchUserFilterKeys() FilterKeysHttpResponse {
  var response FilterKeysHttpResponse

  r, err := http.Get(p.getConfiguration().UserFilterKeysEndpoint)

  if err != nil {
    return response
  }

  b, err := ioutil.ReadAll(r.Body)
  defer r.Body.Close()
  if err != nil {
    return response
  }

  err = json.Unmarshal(b, &response)
  if err != nil {
    return response
  }

  return response
}

func (p *Plugin) FetchChannelUsers(endpoint string, channelId string) UsersMetadata {

  var usersMetadata UsersMetadata

  r, err := http.Get(endpoint)

  if err != nil {
    return usersMetadata
  }

  b, err := ioutil.ReadAll(r.Body)
  defer r.Body.Close()

  if err != nil {
    return usersMetadata
  }

  var response UserFilterHttpResponse

  err = json.Unmarshal(b, &response)
  if err != nil {
    return usersMetadata
  }

  if members, err := p.API.GetChannelMembersByIds(channelId, response.Ids); err == nil {

    for _, member := range *members {
      user, err := p.API.GetUser(member.UserId)
      if err != nil {
        continue
      }

      usersMetadata = append(usersMetadata, UserMetadata{*user, member})

      // usersMetadata.Append(UserMetadata{*user, member})

      p.API.LogWarn(member.UserId)
    }
  }

  return usersMetadata
}

func (p *Plugin) FetchChannelRoles(endpoint string) RoleHttpResponse {
  var response RoleHttpResponse

  r, err := http.Get(endpoint)

  if err != nil {
    return response
  }

  b, err := ioutil.ReadAll(r.Body)
  defer r.Body.Close()
  if err != nil {
    return response
  }

  err = json.Unmarshal(b, &response)
  if err != nil {
    return response
  }

  return response
}
