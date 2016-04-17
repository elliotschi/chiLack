package main

import (
  "fmt"
  "time"
  "math/rand"
)

type Message struct {
  Name string `json:"name"`
  Data interface{} `json:"data"`
}

type Client struct {
  send chan Message
}

func (client *Client) write() {
  for msg := range client.send {
    // socket.sendJSON(msg)
    fmt.Printf("%#v\n", msg)
  }
}

func (client *Client) subscribeChannels() {
  for {
    time.Sleep(r())
    client.send <- Message{"channel add", ""}
  }
}

func (client *Client) subscribeMessages() {
  for {
    time.Sleep(r())
    client.send <- Message{"message add", ""}
  }
}

func r() time.Duration {
  return time.Millisecond * time.Duration(rand.Intn(1000))
}

func NewClient() *Client {
  return &Client{
    send: make(chan Message),
    
  }
}

func main() {
  // msgChan := make(chan string)
  
  // go func() {
  //   msgChan <- "Hello"
  // }()
  
  // msg := <-msgChan
  // fmt.Println(msg)
  client := NewClient()
  go client.subscribeChannels()
  go client.subscribeMessages()
  client.write()
}