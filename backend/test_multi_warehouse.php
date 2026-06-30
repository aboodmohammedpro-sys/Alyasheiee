<?php

use App\Models\User;
use App\Modules\Procurement\Models\Material;
use App\Modules\Warehouse\Models\Warehouse;
use App\Modules\Warehouse\Services\InventoryService;
use App\Modules\Warehouse\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. إعداد البيانات - بدون ربط بمشروع
$user = User::updateOrCreate(
    ['email' => 'storekeeper@alyasheiee.com'],
    ['name' => 'Store Keeper', 'password' => bcrypt('password')]
);
Auth::login($user);

// مستودع مركزي (لا يرتبط بمشروع واحد!)
$central = Warehouse::updateOrCreate(
    ['name' => 'Central Depot - HQ'],
    ['type' => 'central', 'is_active' => true]
);

// مستودع موقع (أيضاً مستقل)
$site = Warehouse::updateOrCreate(
    ['name' => 'Site Warehouse - Project Alpha'],
    ['type' => 'site', 'is_active' => true]
);

echo "1. Warehouses created (no project_id binding):\n";
echo "   Central: {$central->name} (ID: {$central->id})\n";
echo "   Site:    {$site->name} (ID: {$site->id})\n\n";

$material = Material::firstOrCreate(
    ['code' => 'CEM-OPC53'],
    ['name' => 'Cement OPC 53', 'category' => 'material', 'unit' => 'bag']
);

$inventoryService = new InventoryService();

// تصفير الأرصدة
\App\Modules\Warehouse\Models\InventoryStock::where('material_id', $material->id)
    ->whereIn('warehouse_id', [$central->id, $site->id])
    ->update(['quantity' => 0]);
StockMovement::whereIn('warehouse_id', [$central->id, $site->id])
    ->where('material_id', $material->id)
    ->delete();

// 2. شحن افتتاحي للمستودع المركزي (نمثل GRN بحركة مباشرة للاختبار)
$inventoryService->updateStock($central->id, $material->id, 500);
$inventoryService->logMovement(
    warehouseId: $central->id,
    materialId:  $material->id,
    type:        'receipt',
    quantity:    +500,
    referenceNo: 'MANUAL-INIT',
    notes:       'Initial stock for test',
);

$centralStock = $inventoryService->getStock($central->id, $material->id);
echo "2. Initial stock loaded into Central Depot: {$centralStock} bags (expected 500)\n\n";

// 3. إنشاء طلب تحويل من المركزي للموقع
$transfer = $inventoryService->createTransfer([
    'source_warehouse_id' => $central->id,
    'target_warehouse_id' => $site->id,
    'notes'               => 'Transfer for Project Alpha Q3 needs',
    'items'               => [
        ['material_id' => $material->id, 'quantity' => 200],
    ],
]);
echo "3. Transfer created: {$transfer->transfer_number}, Status: {$transfer->status}\n\n";

// 4. شحن التحويل (خصم من المركزي)
$transfer->load('items.material');
$transfer = $inventoryService->shipTransfer($transfer);

$centralAfterShip = $inventoryService->getStock($central->id, $material->id);
echo "4. Transfer shipped:\n";
echo "   Central stock after shipping: {$centralAfterShip} bags (expected: 300)\n";
echo "   Transfer status: {$transfer->status}\n\n";

// 5. استلام التحويل في الموقع
$transfer->load('items');
$transfer = $inventoryService->receiveTransfer($transfer);

$centralFinal = $inventoryService->getStock($central->id, $material->id);
$siteFinal    = $inventoryService->getStock($site->id, $material->id);
echo "5. Transfer received:\n";
echo "   Central stock final: {$centralFinal} bags (expected: 300)\n";
echo "   Site stock final:    {$siteFinal} bags (expected: 200)\n";
echo "   Transfer status: {$transfer->status}\n\n";

// 6. التحقق من دفتر الأستاذ
$movements = StockMovement::whereIn('warehouse_id', [$central->id, $site->id])
    ->where('material_id', $material->id)
    ->orderBy('created_at')
    ->get();

echo "6. Stock Movements Ledger ({$movements->count()} records):\n";
foreach ($movements as $mv) {
    $whName = $mv->warehouse_id === $central->id ? 'Central' : 'Site';
    $sign   = $mv->quantity > 0 ? '+' : '';
    echo "   [{$whName}] Type: {$mv->type}, Qty: {$sign}{$mv->quantity}, Ref: {$mv->reference_no}\n";
}

// التحقق النهائي
if ($centralFinal == 300 && $siteFinal == 200 && $movements->count() >= 3) {
    echo "\nMULTI-WAREHOUSE TRANSFER TEST PASSED SUCCESSFULLY!\n";
} else {
    echo "\nTEST FAILED: Unexpected values\n";
    exit(1);
}
