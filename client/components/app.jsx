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
      activeChannel: {},
      connected: false
    };
  }

  // react life cycle method for when a component first mounts
  componentDidMount() {
    let ws = this.ws = new WebSocket('ws://echo.websocket.org');
    // console.log(ws);

    ws.onmessage = this.message.bind(this);
    ws.open = this.open.bind(this);
    ws.close = this.close.bind(this);
  }

  message(e) {
    const event = JSON.parse(e.data);

    if (event.name === 'channel add') {
      this.newChannel(event.data);
    }
  }

  open() {
    this.setState({connected: true});
  }

  close() {
    this.setState({connected:false});
  }

  newChannel(channel) {
    let {channels} = this.state;
    channels = channels.concat([channel]);
    this.setState({channels});
  }

  // channel functions
  addChannel(name) {
    let {channels} = this.state;
    // channels = channels.concat([{id: channels.length, name}]);
    // this.setState({channels});

    let msg = {
      name: 'channel add',
      data: {
        id: channels.length,
        name
      }
    };
    this.ws.send(JSON.stringify(msg));
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