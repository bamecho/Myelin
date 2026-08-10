package orders

import (
	"errors"
	"time"
)

type ID string

type Status string

const (
	Pending  Status = "pending"
	Approved Status = "approved"
)

type Order struct {
	ID         ID
	Status     Status
	ApprovedAt time.Time
}

func (o Order) Approve(now time.Time) (Order, error) {
	if o.Status != Pending {
		return Order{}, errors.New("order is not pending")
	}
	o.Status = Approved
	o.ApprovedAt = now
	return o, nil
}
