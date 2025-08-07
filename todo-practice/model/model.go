package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Todo struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`                // bson:"_id,omitempty"?	_id: This tells the MongoDB driver to map this ID struct field to the _id field in the database document.
	Title       string             `json:"title" bson:"title" validate:"required"` // this validation is added by an external library
	Description string             `json:"description" bson:"description"`
	Status      bool               `json:"status" bson:"status"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}
