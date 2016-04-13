import React, {Component, PropTypes} from 'react';

class Channel extends Component {
  onClick(e) {
    e.preventDefault();
    const {setChannel, channel} = this.props;
    setChannel(channel);
  }
  render() {
    const {channel, activeChannel} = this.props;
    
    return (
      <li className={channel === activeChannel ? 'active' : ''}>
        <a 
          onClick={this.onClick.bind(this)}>
          {channel.name}
        </a>
      </li>
    );
  }
}

Channel.propTypes = {
  channel: PropTypes.object.isRequired,
  setChannel: PropTypes.func.isRequired,
  activeChannel: PropTypes.object.isRequired
};

export default Channel;