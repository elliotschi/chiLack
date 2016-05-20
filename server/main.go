package main

import (
  "net/http"
  r "github.com/dancannon/gorethink"
  "log"
)

func main() {
  session, err := r.Connect(r.ConnectOpts{
    Address: "localhost:28015",
    Database: "chiLack",
  })
  
  if err != nil {
    log.Panic(err.Error())
  }
  router := NewRouter(session)
  
  router.Handle("channel add", addChannel)
  router.Handle("channel subscribe", subscribeChannel)
  router.Handle("channel unsubscribe", unsubscribeChannel)
  
  http.Handle("/", router)
  http.ListenAndServe(":4000", nil)
  
}

