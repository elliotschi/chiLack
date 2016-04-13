import React, {Component, PropTypes} from 'react';
import Message from './message';

class MessageList extends Component {
  render() {
    return (
      <ul>{
        this.props.messages.map(message => {
          return (<Message 
            message={message}
            key={message.id}
          />
          );
        })
      }
      </ul>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default MessageList;