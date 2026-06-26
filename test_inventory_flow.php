<?php

use App\Models\User;
use App\Modules\Procurement\Models\PurchaseRequest;
use App\Modules\Procurement\Models\PurchaseRequestItem;
use App\Modules\Procurement\Models\Material;
use App\Modules\Procurement\Models\Supplier;
use App\Modules\Procurement\Models\PurchaseOrder;
use App\Modules\Procurement\Services\PurchaseOrderService;
use App\Modules\Warehouse\Models\Warehouse;
use App\Modules\Warehouse\Services\InventoryService;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup Data
$admin = User::firstOrCreate(['email' => 'admin@alyasheiee.com'], ['name' => 'Admin User', 'password' => bcrypt('password')]);
Auth::login($admin);

$project = Project::firstOrCreate(['code' => 'INV-TEST'], ['name' => 'Inventory Flow Project']);
$supplier = Supplier::firstOrCreate(['name' => 'Al-Futtaim'], ['status' => 'active']);
$warehouse = Warehouse::firstOrCreate(['name' => 'Central Warehouse'], ['type' => 'central', 'project_id' => $project->id]);
$rebar = Material::firstOrCreate(['code' => 'RB-12'], ['name' => 'Steel Rebar 12mm', 'category' => 'Materials', 'unit' => 'ton']);

echo "1. Setup Finished.\n";

// 2. PR -> PO
$pr = PurchaseRequest::create([
    'project_id' => $project->id,
    'requester_id' => $admin->id,
    'status' => 'approved'
]);
PurchaseRequestItem::create(['purchase_request_id' => $pr->id, 'material_id' => $rebar->id, 'quantity' => 50]);

$poService = new PurchaseOrderService();
$po = $poService->convertRequestToOrder($pr, $supplier->id, [$rebar->id => 1200]);

echo "2. PO Issued (Number: {$po->po_number}).\n";

// 3. PO -> GRN (Receive 30 tons out of 50)
$invService = new InventoryService();
$grn = $invService->receiveMaterials($po, $warehouse->id, [
    ['material_id' => $rebar->id, 'quantity_received' => 30]
]);

echo "3. GRN Issued (ID: {$grn->id}, Received: 30 tons).\n";

// 4. Verify Stock
$currentStock = $invService->getStock($warehouse->id, $rebar->id);
echo "4. Current Stock in Warehouse: {$currentStock} Tons.\n";

if ($currentStock == 30) {
    echo "\nINVENTORY FLOW TEST PASSED!\n";
} else {
    echo "\nINVENTORY FLOW TEST FAILED: Stock discrepancy.\n";
    exit(1);
}
