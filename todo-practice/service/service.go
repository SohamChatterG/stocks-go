package service

import (
	"time"
	"todo-practice/model"
	"todo-practice/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddTodo(data model.Todo, Client *mongo.Client) error {
	currentTime := time.Now()
	// formattedCurrentTime := currentTime.Format("02-01-06 03:04:05")

	data.CreatedAt = currentTime
	data.UpdatedAt = currentTime

	err := repository.AddTodo(data, Client)

	return err

}

func SetUpTodo(id string, Client *mongo.Client) error {
	// search the item exists

	// exists
	ObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	err = repository.SetUpTodo(ObjectID, Client)
	return err

}
func DeleteTodo(id string, Client *mongo.Client) error {
	ObjectId, _ := primitive.ObjectIDFromHex(id)
	err := repository.DeleteTodo(ObjectId, Client)
	return err
}
func GetAllTodo(Client *mongo.Client) ([]model.Todo, error) {
	todos, err := repository.GetAllTodos(Client)
	if err != nil {
		return nil, err
	}
	return todos, nil
}
