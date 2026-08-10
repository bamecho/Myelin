package orders

import (
	"context"
	"time"
)

type Store interface {
	Get(context.Context, ID) (Order, error)
	Save(context.Context, Order) error
}

type Service struct {
	store Store
	now   func() time.Time
}

func NewService(store Store, now func() time.Time) *Service {
	return &Service{store: store, now: now}
}

func (s *Service) Approve(ctx context.Context, id ID) error {
	order, err := s.store.Get(ctx, id)
	if err != nil {
		return err
	}
	order, err = order.Approve(s.now())
	if err != nil {
		return err
	}
	return s.store.Save(ctx, order)
}
