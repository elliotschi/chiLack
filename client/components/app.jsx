import React, {Component} from 'react';
import ChannelSection from './channels/channelSection';
import UserSection from './users/userSection';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      channels: [],
      users: [],
      activeChannel: {}
    };
  }
  
  addChannel(name) {
    let {channels} = this.state;
    channels = channels.slice();
    channels.push({id: channels.length, name});
    this.setState({channels});
  }
  
  setChannel(activeChannel) {
    this.setState({activeChannel});
  }
  
  setUserName(name) {
    let {users} = this.state;
    users = users.slice();
    users.push({id: users.length, name});
    this.setState({users});
  }
  
  render() {
    return (
      <div className='app'>
        <div className='nav'>
          <ChannelSection
            {...this.state}
            addChannel={this.addChannel.bind(this)}
            setChannel={this.setChannel.bind(this)}
          />
          <UserSection 
            {...this.state}
            setUserName={this.setUserName.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default App;