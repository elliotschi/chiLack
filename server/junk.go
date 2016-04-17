package main

import (
  "fmt"
  r "github.com/dancannon/gorethink"
)

type User struct {
  Id string `gorethink:"id,omitempty"`
  Name string `gorethink:"name"`
}

func main() {
  session, err := r.Connect(r.ConnectOpts{
    Address: "localhost:28015",
    Database: "chiLack",
  })
  
  if err != nil {
    fmt.Println(err)
    return
  }
  
  user := User{
    Name: "anonymous",
    
  }
  response, err := r.Table("user").
    Insert(user).
    RunWrite(session)
    
  if err != nil {
    fmt.Println(err)
    return
  }
  
  fmt.Printf("%#v\n", response)
}