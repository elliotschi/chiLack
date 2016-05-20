package main

import (
  "github.com/mitchellh/mapstructure"
  r "github.com/dancannon/gorethink"
  "fmt"
  "time"
)

const (
  // ChannelStop ...
  ChannelStop = iota
  UserStop
  MessageStop
)

// Message ...
type Message struct {
  Name string `json:"name"`
  Data interface{} `json:"data"`
}

// Channel ...
type Channel struct {
  ID string `json:"id" gorethink:"id,omitempty"`
  Name string `json:"name" gorethink:"name,omitempty"`
}

// User ...
type User struct {
  ID string `gorethink:"id,omitempty"`
  Name string `gorethink:"name"`
}

// ChannelMessage ...
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

func addChannelMessage(client *Client, data interface{}) {
  var channelMessage ChannelMessage
  err := mapstructure.Decode(data, &channelMessage)
  if err != nil {
    client.send <- Message{"error", err.Error()}
  }
  
  go func() {
    channelMessage.CreatedAt = time.Now()
    channelMessage.Author = client.userName
    
    err := r.Table("message").Insert(channelMessage).Exec(client.session)
    
    if err != nil {
      client.send <- Message{"error", err.Error()}
    }
  }()
}

func subscribeChannelMessage(client *Clinet, data interface{}) {
  go func() {
    eventData := data.(map[string]interface{})
    val, ok := eventData["channelId"]
    
    if !ok {
      return
    }
    
    stop := client.NewStopChannel(MessageStop)
    cursor, err := r.Table("message").
      OrderBy(r.OrderByOpts{Index: r.Desc("createdAt")}).
      Filter(r.Row.Field("channelId").Eq(channelId)).
      Changes(r.ChangesOpts{IncludeInitial: true}).
      Run(client.session)
      
    if err != nil {
      client.send <- Message{"error", err.Error()}
      return
    }
    
    changeFeedHelper(cursor, "message", client.send, stop)
  }()
}

func unsubscribeChannelMessage(client *Client, data interface{}) {
	client.StopForKey(MessageStop)
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
  go func() {
    stop := client.NewStopChannel(ChannelStop)

    cursor, err := r.Table("channel").Changes(r.ChangesOpts{IncludeInitial: true}).Run(client.session)
    if err != nil {
      client.send <- Message{"error", err.Error()}
      return
    }
    
    changeFeedHelper(cursor, "channel", client.send, stop)
  }()

}

func unsubscribeChannel(client *Client, data interface{}) {
  client.StopForKey(ChannelStop)
}

func changeFeedHelper(cursor *r.Cursor, changeEventName string, send chan <- Message, stop <- chan bool) {
  change := make(chan r.ChangeResponse)
  cursor.Listen(change)
  for {
    eventName := ""
    var data interface {}
    select {
      case <- stop:
        cursor.Close()
        return
      
      case val := <- change:
        if val.NewValue != nil && val.OldValue == nil {
          eventName = changeEventName + " add"
          data = val.NewValue
        } else if val.NewValue == nil && val.OldValue != nil {
          eventName = changeEventName + " remove"
          data = val.OldValue
        } else if val.NewValue != nil && val.OldValue != nil {
          eventName = changeEventName + " edit"
          data = val.NewValue
        }
        send <- Message{eventName, data}
    }
  }
}