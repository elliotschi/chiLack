package main

import (
  "github.com/mitchellh/mapstructure"
  r "github.com/dancannon/gorethink"
)

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
    cursor, err := r.Table("channel").Changes(r.ChangesOpts{IncludeInitial: true}).Run(client.session)
    if err != nil {
      client.send <- Message{"error", err.Error()}
      return
    }
    var change r.ChangeResponse
    for cursor.Next(&change) {
      if change.NewValue != nil && change.OldValue == nil {
        client.send <- Message{"channel add", change.NewValue}
      } 
    }
  }()
}