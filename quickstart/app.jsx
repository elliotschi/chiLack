// let channels = [
//   {name: 'hi'},
//   {name: 'cool'}
// ];

class Channel extends React.Component {
  onClick() {
    console.log('i got clicked: ', this.props.name);
  }
  render() {
    
    return (
      <li onClick={this.onClick.bind(this)}>{this.props.name}</li>
    );
  }
}

class ChannelList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.channels.map(channel => {
          return (
            <Channel name={channel.name} />
          )
        })}
      </ul>
      
    );
  }
}

class ChannelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};  
  }
  
  onChange (e) {
    this.setState({
      channelName: e.target.value
    });
    
    // console.log(e.target.value);
  }
  
  onSubmit (e) {
    e.preventDefault();  
    let {channelName} = this.state;
    
    // channels.push({
    //   name: channelName
    // });
    
    this.setState({
      channelName: ''
    })
    
    this.props.addChannel(channelName);
    console.log(channelName);
  }
  
  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type='text' 
          onChange={this.onChange.bind(this)}
          value={this.state.channelName}
        />
      </form>
    );
  }
}

class ChannelSelection extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      channels: [
        {name: 'hi'},
        {name: 'cool'}
      ]
    }
  }
  
  addChannel(name) {
    let {channels} = this.state;
    channels.push({name: name});
    
    this.setState({
      channels: channels
    });
  }
  render() {
    return (
      <div>
        <ChannelList channels={this.state.channels} />
        <ChannelForm addChannel={this.addChannel.bind(this)} />
      </div>
    );
  }
}

ReactDOM.render(<ChannelSelection />, document.getElementById('app'));