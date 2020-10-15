import { id, manifest } from './manifest';
import { FormattedMessage } from 'react-intl';
import { submitInteractiveDialog } from 'mattermost-redux/actions/integrations';

import ChannelModeration from './components/channel_moderation/channel_moderation';
import FooterWrapper from 'components/channel_moderation/footer/footer_wrapper';

const Icon = () => <i className='icon fa fa-cog'/>;

export default class Plugin {
    initialize(registry, store) {
        registry.registerChannelHeaderButtonAction(
            <Icon />,
            (channel) => window.openInteractiveDialog({
              dialog: {
                title: 'Channel Moderation',
                body_wrapper:
                  <ChannelModeration
                    channel={channel}
                  />,
                footer_wrapper:
                  <FooterWrapper
                    text={"Done"}
                    onSubmit={store.dispatch(submitInteractiveDialog({
                        url: "",
                        callback_id: "callbackId",
                        state: "",
                        submission: "values",
                    }))}
                  >
                  </FooterWrapper>
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
