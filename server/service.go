package main

import (
  "net/http"
	"encoding/json"
  "io/ioutil"
)

func (p *Plugin) FetchUserFilterGroups() FilterGroupsHttpResponse {
  var response FilterGroupsHttpResponse

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
    return nil
  }

  b, err := ioutil.ReadAll(r.Body)
  defer r.Body.Close()

  if err != nil {
    return nil
  }

  var response UserFilterHttpResponse

  err = json.Unmarshal(b, &response)
  if err != nil {
    return nil
  }

  if members, err := p.API.GetChannelMembersByIds(channelId, response.Ids); err == nil {

    if members == nil {
      return nil
    }

    for _, member := range *members {
      user, err := p.API.GetUser(member.UserId)
      if err != nil {
        continue
      }

      usersMetadata = append(usersMetadata, UserMetadata{*user, member})
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
