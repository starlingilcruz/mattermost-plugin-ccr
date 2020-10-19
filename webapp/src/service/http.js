import request from 'superagent';
import { id } from 'manifest';

/* eslint-disable no-useless-catch */

export default class HttpClient {

    constructor() {
        this.baseURL = `/plugins/${id}/api`;
    }

    getUserFilterGroups = async () => {
      return this.httpGet(`${this.baseURL}/user/groups`);
    }

    getChannelUsersByGroup = async (teamId, channelId, group) => {
      return this.httpPost(`${this.baseURL}/filter/user`, {
        teamId, channelId, group
      });
    }

    getChannelRoles = async (teamId) => {
      return this.httpPost(`${this.baseURL}/channel/roles`, {teamId});
    }

    updateUserChannelRoles = async (userId, channelId, rolesName) => {
      return this.httpPost(`${this.baseURL}/user/channel/update_roles`, {
        userId, channelId, rolesName
      });
    }

    httpGet = async (url, headers = {}) => {
        headers['X-Requested-With'] = 'XMLHttpRequest';

        try {
            const response = await request.
                get(url).
                set(headers).
                accept('application/json');

            return response.body;
        } catch (err) {
            throw err;
        }
    }

    httpPost = async (url, body, headers = {}) => {
        headers['X-Requested-With'] = 'XMLHttpRequest';

        try {
            const response = await request.
                post(url).
                send(body).
                set(headers).
                type('application/json').
                accept('application/json');

            return response.body;
        } catch (err) {
            throw err;
        }
    }
}
