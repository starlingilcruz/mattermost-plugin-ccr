package main

import (
  "io"
	"encoding/json"
	"strings"
)

func (p *Plugin) ValidRequired(args ...interface{}) bool {
  for _, item := range args {
    if item == nil {
      return false
    }
  }
	return true
}

func (p *Plugin) AddTeamToURL(url string, teamName string) string {
	return strings.ReplaceAll(url, URL_TEAM_SLUG_SHADOW, teamName)
}

func (p *Plugin) MapFromJson(data io.Reader) map[string]string {
	decoder := json.NewDecoder(data)

	var objmap map[string]string
	if err := decoder.Decode(&objmap); err != nil {
		return make(map[string]string)
	} else {
		return objmap
	}
}

func (u *UsersMetadata) ToJson() string {
	if b, err := json.Marshal(u); err != nil {
		return "[]"
	} else {
		return string(b)
	}
}
