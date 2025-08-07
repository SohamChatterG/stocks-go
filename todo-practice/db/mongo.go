// package db

// import (
// 	"context"
// 	"log"
// 	"time"

// 	"go.mongodb.org/mongo-driver/mongo"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// )

// // ConnectDB initializes a connection to MongoDB.
// // It takes the connection URI as an argument and returns a client instance.
// // This function centralizes the database connection logic.
// func ConnectDB(uri string) (*mongo.Client, error) {
// 	// Set up a context with a 10-second timeout for the connection attempt.
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()

// 	// Create a new client and connect to the server.
// 	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Ping the primary to verify that the client is connected.
// 	err = client.Ping(ctx, nil)
// 	if err != nil {
// 		return nil, err
// 	}

//		log.Println("Successfully connected to MongoDB!")
//		return client, nil
//	}
package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB(uri string) (*mongo.Client, error) {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, err
	}
	log.Println("Successfully connected to MongoDB!")

	return client, nil
}
