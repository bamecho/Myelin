package httpapi

import (
	"context"

	"example.com/approval-delivery/internal/orders"
)

type Approver interface {
	Approve(context.Context, orders.ID) error
}

type ApproveHandler struct {
	approver Approver
}

func NewApproveHandler(approver Approver) *ApproveHandler {
	return &ApproveHandler{approver: approver}
}

func (h *ApproveHandler) Handle(ctx context.Context, id string) error {
	return h.approver.Approve(ctx, orders.ID(id))
}
