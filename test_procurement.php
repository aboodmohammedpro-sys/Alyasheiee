<?php

use App\Models\User;
use App\Modules\Procurement\Models\PurchaseRequest;
use App\Modules\Procurement\Models\PurchaseRequestItem;
use App\Modules\Procurement\Models\Material;
use App\Modules\Procurement\Models\Supplier;
use App\Modules\Procurement\Models\PurchaseOrder;
use App\Modules\Procurement\Services\PurchaseOrderService;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup Data
$admin = User::firstOrCreate(['email' => 'admin@alyasheiee.com'], ['name' => 'Admin User', 'password' => bcrypt('password')]);
Auth::login($admin);

$project = Project::firstOrCreate(['code' => 'PRO-TEST'], ['name' => 'Procurement Test Project']);
$supplier = Supplier::firstOrCreate(['name' => 'Bin Ladin Group'], ['phone' => '123456', 'status' => 'active']);
$cement = Material::firstOrCreate(['code' => 'CM-01'], ['name' => 'Cement (Bag)', 'category' => 'Materials', 'unit' => 'bag']);

echo "1. Data Setup Finished.\n";

// 2. Create Purchase Request
$pr = PurchaseRequest::create([
    'project_id' => $project->id,
    'requester_id' => $admin->id,
    'status' => 'approved', // Bypass approval for test
    'required_date' => now()->addDays(7)
]);

PurchaseRequestItem::create([
    'purchase_request_id' => $pr->id,
    'material_id' => $cement->id,
    'quantity' => 100, // 100 bags
    'estimated_unit_price' => 20
]);

echo "2. Purchase Request Created & Approved (ID: {$pr->id}).\n";

// 3. Convert to PO
try {
    $poService = new PurchaseOrderService();
    $pricing = [
        $cement->id => 18.50 // Special price from supplier
    ];

    $po = $poService->convertRequestToOrder($pr, $supplier->id, $pricing);

    echo "3. Purchase Order Issued (ID: {$po->id}, Number: {$po->po_number}).\n";
    echo "   PO Total Amount: {$po->total_amount} (Expected: 1850)\n";

    if ($po->total_amount == 1850 && $pr->fresh()->status == 'ordered') {
        echo "\nPROCUREMENT PO TEST PASSED!\n";
    } else {
        echo "\nPROCUREMENT PO TEST FAILED: Verification discrepancy.\n";
        exit(1);
    }
} catch (\Exception $e) {
    echo "PROCUREMENT TEST ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
