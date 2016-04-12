import React, {Component, PropTypes} from 'react';
import Channel from './channel';

class ChannelList extends Component {
  render() {
    return (
      <ul>{
        this.props.channels.map(channel => {
          return (<Channel
            channel={channel}
            setChannel={this.props.setChannel}
            />
          );
        })
      }
      </ul>
    );
  }
}

ChannelList.propTypes = {
  channels: PropTypes.array.isRequired,
  setChannel: PropTypes.func.isRequired
}

export default ChannelList;