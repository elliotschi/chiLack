package main

import (
  "github.com/mitchellh/mapstructure"
  r "github.com/dancannon/gorethink"
  "fmt"
  "time"
)

const (
  ChannelStop = iota
  UserStop
  MessageStop
)

type Message struct {
  Name string `json:"name"`
  Data interface{} `json:"data"`
}

type Channel struct {
  Id string `json:"id" gorethink:"id,omitempty"`
  Name string `json:"name" gorethink:"name,omitempty"`
}

type User struct {
  Id string `gorethink:"id,omitempty"`
  Name string `gorethink:"name"`
}

type ChannelMessage struct {
  ID string `gorethink:"id,omitempty"`
  ChannelID string `gorethink:"channelId"`
  Body string `gorethink:"body"` 
  Author string `gorethink:"author"`
  CreatedAt time.Time `gorethink:"createAt"`
}

func editUser(client *Client, data interface{}) {
  var user User
  
  err := mapstructure.Decode(data, &user)
  if err != nil {
    client.send <- Message{"error", err.Error()}
    return
  }
  
  client.userName = user.Name
  
  go func() {
    _, err := r.Table("user").Get(client.id).Update(user).RunWrite(client.session)
      
    if err != nil {
      client.send <- Message{"error", err.Error()}
    }
  }()
}

func subscribeUser(client *Client, data interface{}) {
  go func() {
    stop := client.NewStopChannel(UserStop)
    cursor, err := r.Table("user").Changes(r.ChangesOpts{IncludeInitial: true}).Run(client.session)
    
    if err != nil {
      client.send <- Message{"error", err.Error()}
      return
    }
    
    changeFeedHelper(cursor, "user", client.send, stop)
  }()
}

func unsubscribeUser(client *Client, data interface{}) {
	client.StopForKey(UserStop)
}

func addChannel(client *Client, data interface{}) {
  var channel Channel
  // var message Message
  
  err := mapstructure.Decode(data, &channel)
  if err != nil {
    client.send <- Message{"error", err.Error()}
    return
  }  
  // fmt.Printf("%#v\n", channel)
  
  go func() {
    err = r.Table("channel").Insert(channel).Exec(client.session)
    if err != nil {
      client.send <- Message{"error", err.Error()}
    }
  }()
  
  // channel.Id = "ABC123"
  // message.Name = "channel add"
  // message.Data = channel
  
  // client.send <- message
  
}

func subscribeChannel(client *Client, data interface{}) {
  stop := client.NewStopChannel(ChannelStop)
  result := make(chan r.ChangeResponse)
  
  cursor, err := r.Table("channel").Changes(r.ChangesOpts{IncludeInitial: true}).Run(client.session)
  if err != nil {
    client.send <- Message{"error", err.Error()}
    return
  }
  
  go func() {
    var change r.ChangeResponse
    for cursor.Next(&change) {
      result <- change
    }
  }()
  
  go func() {
    for {
      select {
        case <-stop:
          cursor.Close()
          return;
        case change := <-result:
          if change.NewValue != nil && change.OldValue == nil {
            client.send <- Message{"channel add", change.NewValue}
            fmt.Println("sent channel add message")
          } 
      }
    }
  }()
}

func unsubscribeChannel(client *Client, data interface{}) {
  client.StopForKey(ChannelStop)
}