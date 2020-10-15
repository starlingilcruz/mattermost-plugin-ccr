import {connect} from 'react-redux';
// import {bindActionCreators, Dispatch, ActionCreatorsMapObject} from 'redux';
import {Channel, ChannelMembership} from 'mattermost-redux/types/channels';
// import {ActionFunc} from 'mattermost-redux/types/actions';

import ChannelModeration from './channel_moderation';

// function mapStateToProps(state) {
//     const stats = getCurrentChannelStats(state) || 0;
//     return {
//         teamId: state.teamId,
//         channelId: state.channelId,
//         totalChannelMembers: stats.member_count,
//     };
// }

const mapStateToProps = (state) => ({
    channel: state.channel
});
//
// type Actions = {
//     getChannelMembers: (channelId: string) => Promise<{data: ChannelMembership[]}>;
// }
//
// function mapDispatchToProps(dispatch: Dispatch) {
//     return {
//         actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
//             getChannelMembers,
//         }, dispatch),
//     };
// }

export default connect(mapStateToProps)(ChannelModeration);
