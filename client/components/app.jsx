import React, {Component} from 'react';
import ChannelSection from './channels/channelSection';
import UserSection from './users/userSection';
import MessageSection from './messages/messageSection';
import Socket from '../socket';

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
    let ws = new WebSocket('ws://localhost:4000');
    let socket = this.socket = new Socket(ws);
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('channel add', this.onAddChannel.bind(this));
    socket.on('user add', this.onUserAdd.bind(this));
    socket.on('user edit', this.onUserEdit.bind(this));
    socket.on('user remove', this.onUserRemove.bind(this));
    socket.on('message add', this.onMessageAdd.bind(this));
  }

  onMessageAdd(message) {
    let {messages} = this.state;

    messages = messages.concat([message]);

    this.setState({messages});
  }

  onUserAdd(user) {
    let {users} = this.state;

    users = users.concat([user]);
    this.setState({users});
  }

  onUserEdit(editUser) {
    let {users} = this.state;

    users = users.map(user => {
      if (editUser.id === user.id) {
        return editUser;
      }
      return user;
    });

    this.setState({users});
  }

  onUserRemove(removeUser) {
    let {user} = this.state;

    users = users.filter(user => {
      return user.id !== removeUser.id;
    });

    this.setState({users});
  }

  onConnect() {
    this.setState({connected: true});
    this.socket.emit('channel subscribe');
    this.socket.emit('user subscribe');
  }

  onDisconnect() {
    this.setState({connected: false});
  }

  onAddChannel(channel) {
    let {channels} = this.state;
    channels = channels.concat([channel]);
    this.setState({channels});
  }

  // channel functions
  addChannel(name) {
    // let {channels} = this.state;
    // // channels = channels.concat([{id: channels.length, name}]);
    // // this.setState({channels});

    // let msg = {
    //   name: 'channel add',
    //   data: {
    //     id: channels.length,
    //     name
    //   }
    // };
    // this.ws.send(JSON.stringify(msg));
    this.socket.emit('channel add', {name});
  }
  
  setChannel(activeChannel) {
    this.setState({activeChannel});
    this.socket.emit('message unsubscribe');

    this.setState({messages: []});

    this.socket.emit('message subscribe', {channelId: activeChannel.id});
  }
  
  // user functions
  setUserName(name) {
    this.socket.emit('user edit', {name});
  }
  
  // message functions
  addMessage(body) {
    let {activeChannel} = this.state;
    this.socket.emit('message add', {channelId: activeChannel.id, body});
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