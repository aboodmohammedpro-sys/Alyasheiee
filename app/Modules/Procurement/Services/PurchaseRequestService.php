<?php

namespace App\Modules\Procurement\Services;

use App\Modules\Procurement\Models\PurchaseRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PurchaseRequestService
{
    public function createRequest(array $data): PurchaseRequest
    {
        return DB::transaction(function () use ($data) {
            $request = PurchaseRequest::create([
                'project_id' => $data['project_id'],
                'requester_id' => Auth::id(),
                'required_date' => $data['required_date'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'draft'
            ]);

            foreach ($data['items'] as $item) {
                $request->items()->create([
                    'material_id' => $item['material_id'],
                    'quantity' => $item['quantity'],
                    'estimated_unit_price' => $item['estimated_unit_price'] ?? 0
                ]);
            }

            return $request->load('items.material');
        });
    }

    public function updateStatus(PurchaseRequest $request, string $status): bool
    {
        $validStatuses = ['draft', 'submitted', 'approved', 'rejected', 'ordered'];
        if (!in_array($status, $validStatuses)) {
            throw new \InvalidArgumentException("Invalid status provided.");
        }

        return $request->update(['status' => $status]);
    }
}
