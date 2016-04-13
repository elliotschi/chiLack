import React, {Component} from 'react';
import ChannelSection from './channels/channelSection';
import UserSection from './users/userSection';
import MessageSection from './messages/messageSection';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      channels: [],
      users: [],
      messages: [],
      activeChannel: {}
    };
  }
  // channel functions
  addChannel(name) {
    let {channels} = this.state;
    channels = channels.concat([{id: channels.length, name}]);
    this.setState({channels});
  }
  
  setChannel(activeChannel) {
    this.setState({activeChannel});
  }
  
  // user functions
  setUserName(name) {
    let {users} = this.state;
    users = users.concat([{id: users.length, name}]);
    this.setState({users});
  }
  
  // message functions
  addMessage(body) {
    // gets messages and users arrays from the state object
    let {messages, users} = this.state;
    let createdAt = new Date();
    let author = users.length > 0 ? users[0].name : 'anon';
    
    messages = messages.concat([{id: messages.length, body, createdAt, author}]);
    
    this.setState({messages});
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
        
        <MessageSection
          {...this.state}
          addMessage={this.addMessage.bind(this)}
        />
      </div>
    );
  }
}

export default App;