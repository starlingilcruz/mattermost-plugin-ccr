import {connect} from 'react-redux';

import UserList from './user_list';

const mapStateToProps = (state) => ({
    users: state.users,
    disabledCheckbox: state.disabledCheckbox

});

export default connect(mapStateToProps)(UserList);
