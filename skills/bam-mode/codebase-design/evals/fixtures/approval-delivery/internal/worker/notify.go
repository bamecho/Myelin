package worker

import (
	"context"

	"example.com/approval-delivery/internal/orders"
)

type Store interface {
	ApprovedUnnotified(context.Context, int) ([]orders.Order, error)
	MarkNotified(context.Context, orders.ID) error
}

type Notifier interface {
	Send(context.Context, orders.ID) error
}

type Worker struct {
	store    Store
	notifier Notifier
}

func New(store Store, notifier Notifier) *Worker {
	return &Worker{store: store, notifier: notifier}
}

func (w *Worker) RunOnce(ctx context.Context, limit int) error {
	ordersToNotify, err := w.store.ApprovedUnnotified(ctx, limit)
	if err != nil {
		return err
	}
	for _, order := range ordersToNotify {
		if err := w.notifier.Send(ctx, order.ID); err != nil {
			return err
		}
		if err := w.store.MarkNotified(ctx, order.ID); err != nil {
			return err
		}
	}
	return nil
}
