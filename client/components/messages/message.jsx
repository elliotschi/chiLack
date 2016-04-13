import React, {Component, PropTypes} from 'react';

class Message extends Component {
  render() {
    let {message} = this.props;
    // let createdAt = Date.now();
    return (
      <li className='message'>
        <div className='author'>
          <strong>{message.author}</strong>
        </div>
        <div className='body'>
          {message.body}
        </div>
      </li>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired
};

export default Message;