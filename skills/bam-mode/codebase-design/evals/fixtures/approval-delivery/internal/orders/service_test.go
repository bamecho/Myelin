package orders

import (
	"context"
	"testing"
	"time"
)

type memoryStore struct {
	order Order
}

func (s *memoryStore) Get(context.Context, ID) (Order, error) { return s.order, nil }
func (s *memoryStore) Save(_ context.Context, order Order) error {
	s.order = order
	return nil
}

func TestApproveKeepsPublicContract(t *testing.T) {
	store := &memoryStore{order: Order{ID: "order-1", Status: Pending}}
	now := time.Date(2026, 8, 10, 12, 0, 0, 0, time.UTC)
	service := NewService(store, func() time.Time { return now })

	if err := service.Approve(context.Background(), "order-1"); err != nil {
		t.Fatal(err)
	}
	if store.order.Status != Approved || !store.order.ApprovedAt.Equal(now) {
		t.Fatalf("unexpected approved order: %#v", store.order)
	}
}
