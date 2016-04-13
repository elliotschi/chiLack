import React, {Component, PropTypes} from 'react';

class MessageForm extends Component {
  onSubmit(e) {
    e.preventDefault();
    const node = this.refs.message;
    const message = node.value;
    this.props.addMessage(message);
    node.value = '';
  }
  
  render() {
    let input = null;
    
    if (this.props.activeChannel.id !== undefined) {
      input = (
        <input
          ref='message'
          type='text'
          className='form-control'
          placeholder='Write a message'
        />
      );
    }

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className='form-group'>
          {input}
        </div>
      </form>
    );
  }
}

MessageForm.propTypes = {
  activeChannel: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired
};

export default MessageForm;