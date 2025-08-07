package handler

import (
	"encoding/json"
	"net/http"
	"todo-practice/model"
	"todo-practice/service"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddTodo(Client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody model.Todo

		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Error while decoding request body",
			})
			return
		}

		if requestBody.Title == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Title should not be empty",
			})
			return
		}

		err = service.AddTodo(requestBody, Client)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{
				"msg": "Internal server error",
			})
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Todo added successfully",
		})
	}
}

// func SetUpTodo(Client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		params := mux.Vars(r)
// 		id := params["id"]
// 		err := service.SetUpTodo(id, Client)
// 		if err != nil {

// 			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
// 			return
// 		}
// 		json.NewEncoder(w).Encode(map[string]string{
// 			"msg": "Set todo done!",
// 		})

//		}
//	}
func SetUpOrDeleteTodo(Client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get the ID from query param or path param
		params := mux.Vars(r)
		id := params["id"]

		switch r.Method {
		case http.MethodPut:
			// ✅ Logic to mark as done
			err := service.SetUpTodo(id, Client)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(map[string]string{
				"msg": "Todo marked as done!",
			})

		case http.MethodDelete:
			// ✅ Logic to delete the todo
			err := service.DeleteTodo(id, Client)
			if err != nil {
				http.Error(w, "Failed to delete", http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(map[string]string{
				"msg": "Todo deleted successfully!",
			})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func GetAllTodo(Client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		todos, err := service.GetAllTodo(Client)
		if err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string][]model.Todo{
			"todos": todos,
		})
	}
}
