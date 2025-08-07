package repository

import (
	"context"
	"os"
	"time"
	"todo-practice/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var DB string

func AddTodo(data model.Todo, Client *mongo.Client) error {
	DB = os.Getenv("DB")
	_, err := Client.Database(DB).Collection("todo").InsertOne(context.Background(), data)
	return err
}

// repository/repository.go (FIXED)
func SetUpTodo(id primitive.ObjectID, Client *mongo.Client) error {
	update := bson.M{"$set": bson.M{"status": true, "updatedAt": time.Now()}} // Also good to update the timestamp
	_, err := Client.Database(DB).Collection("todo").UpdateByID(context.Background(), id, update)
	return err
}
func DeleteTodo(id primitive.ObjectID, Client *mongo.Client) error {
	collection := Client.Database(DB).Collection("todo")
	_, err := collection.DeleteOne(context.TODO(), bson.M{"_id": id})
	return err
}
func GetAllTodos(Client *mongo.Client) ([]model.Todo, error) {
	collection := Client.Database(DB).Collection("todo")
	cursor, _ := collection.Find(context.TODO(), bson.M{}) // the secong part is working as filter matching all elements here
	defer cursor.Close(context.Background())
	var todos []model.Todo
	for cursor.Next(context.TODO()) {
		var todo model.Todo
		err := cursor.Decode(&todo)
		if err != nil {
			return nil, err
		}
		todos = append(todos, todo)
	}
	// if err := cursor.Err(); err != nil {
	// 	return nil, err // handle errors that occurred during iteration
	// }

	return todos, nil

}

// func getAllMovies() []bson.M {
// 	cur, err := collection.Find(context.Background(), bson.D{{}})
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	var movies []bson.M

// 	for cur.Next(context.Background()) {
// 		var movie bson.M
// 		err := cur.Decode(&movie)
// 		if err != nil {
// 			log.Fatal(err)
// 		}
// 		movies = append(movies, movie)
// 	}

// 	defer cur.Close(context.Background())
// 	return movies
// }

// func GetAllMyMovies(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("content-type", "application/json")
// 	allMovies := getAllMovies()
// 	json.NewEncoder(w).Encode(allMovies)
// }

// func updateOneMovie(movieId string) {
// 	id, _ := primitive.ObjectIDFromHex(movieId)
// 	filter := bson.M{"_id": id}
// 	update := bson.M{"$set": bson.M{"watched": true}}

// 	result, err := collection.UpdateOne(context.Background(), filter, update)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	fmt.Println("modified ", result)
// }

// func SaveURL(db *mongo.Client, dbName string, urlMap *models.URLMapping) error {
// 	// Get a handle for the 'urls' collection.
// 	collection := db.Database(dbName).Collection(urlCollection)

// 	// Create a context with a timeout for the database operation.
// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	// Insert the document into the collection.
// 	_, err := collection.InsertOne(ctx, urlMap)
// 	return err
// }
