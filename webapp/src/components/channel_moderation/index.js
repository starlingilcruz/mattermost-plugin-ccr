import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';

import {isEnabled} from 'selectors';

import ChannelModeration from './channel_moderation';

const mapStateToProps = (state) => ({
    teamId: state.teamId,
    channelId: state.channelId
});


// function mapDispatchToProps(dispatch) {
//     return {
//         actions: bindActionCreators({
//             submit,
//         }, dispatch),
//     };
// }

export default connect(mapStateToProps)(ChannelModeration);
