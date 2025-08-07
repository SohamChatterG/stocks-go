package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"todo-practice/db"
	"todo-practice/router"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

var Client *mongo.Client
var Router *mux.Router

func main() {
	mongoUri := os.Getenv("MONGODB_URI")
	PORT := os.Getenv("PORT")
	if value, exists := os.LookupEnv("DB"); exists {
		fmt.Println("DB is set to ", value)
	} else {
		fmt.Println("DB is not set")
	}
	Client, err := db.ConnectDB(mongoUri)
	fmt.Println(Client)
	if err != nil {
		log.Fatalf("Failed to connect to mongodb: %v", err)
	}
	Router = mux.NewRouter()
	router.SetUpRoutes(Router, Client)

	fmt.Println("Server runninstarting or port :", PORT)

	err = http.ListenAndServe(PORT, Router)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
