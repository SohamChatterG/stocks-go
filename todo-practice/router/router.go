package router

import (
	"todo-practice/handler"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetUpRoutes(Router *mux.Router, Client *mongo.Client) {
	Router.HandleFunc("/add-todo", handler.AddTodo(Client)).Methods("POST")
	Router.HandleFunc("/get-all-todo", handler.GetAllTodo(Client)).Methods("GET")
	Router.HandleFunc("/set-todo-done/{id}", handler.SetUpOrDeleteTodo(Client)).Methods("DELETE", "PUT")
}
