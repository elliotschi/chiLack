import React, { Component, PropTypes } from 'react';
import User from './user';

class UserList extends Component {
  render() {
    return (
      <ul>{
        this.props.users.map(user => {
          return (
            <User 
              key={user.id}
              user={user}
            />
          );
        })
      }
      </ul>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UserList;
