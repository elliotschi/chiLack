package main

import (
  "github.com/gorilla/websocket"
  "net/http"
)

type Handler func()

var upgrader = websocket.Upgrader{
  ReadBufferSize: 1024,
  WriteBufferSize: 1024,
  CheckOrigin: func(r *http.Request) bool { return true },
}

type Router struct {}

func (r *Router) Handle(msgName string, handler Handler) {
  
}

func (e *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  socket, err := upgrader.Upgrade(w, r, nil)
}