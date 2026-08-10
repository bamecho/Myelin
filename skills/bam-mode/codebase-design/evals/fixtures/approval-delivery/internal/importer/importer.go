package importer

import (
	"context"

	"example.com/approval-delivery/internal/orders"
)

type Approver interface {
	Approve(context.Context, orders.ID) error
}

type Importer struct {
	approver Approver
}

func New(approver Approver) *Importer {
	return &Importer{approver: approver}
}

func (i *Importer) ApproveAll(ctx context.Context, ids []orders.ID) error {
	for _, id := range ids {
		if err := i.approver.Approve(ctx, id); err != nil {
			return err
		}
	}
	return nil
}
