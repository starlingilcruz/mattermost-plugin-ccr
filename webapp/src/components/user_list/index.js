import {connect} from 'react-redux';

import UserList from './user_list';

const mapStateToProps = (state) => ({
    users: state.users,
});

export default connect(mapStateToProps)(UserList);
