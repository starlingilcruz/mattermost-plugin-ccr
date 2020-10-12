import { id, manifest } from './manifest';
import { FormattedMessage } from 'react-intl';

import ChannelModeration from './components/channel_moderation/channel_moderation';
const Icon = () => <i className='icon fa fa-cog'/>;

export default class Plugin {
    initialize(registry, store) {
        registry.registerChannelHeaderButtonAction(
            <Icon />,
            (channel) => window.openInteractiveDialog({
              component:
                <ChannelModeration
                  teamId={channel.team_id}
                  channelId={channel.id}
                />,
              dialog: {
                title: 'Channel Moderation',
              },
            }),
            "Channel Moderation",
        );
    }

    uninitialize() {
        // No clean up required.
    }
}

window.registerPlugin(id, new Plugin());
