<?php

use App\Models\User;
use App\Modules\Warehouse\Models\DisbursementRequest;
use App\Modules\Warehouse\Services\DisbursementService;
use App\Modules\Warehouse\Services\InventoryService;
use App\Modules\Warehouse\Models\Warehouse;
use App\Modules\Procurement\Models\Material;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup Data
$recorder = User::updateOrCreate(['email' => 'recorder@alyasheiee.com'], ['name' => 'Recorder', 'password' => bcrypt('password')]);
$senior = User::updateOrCreate(['email' => 'senior@alyasheiee.com'], ['name' => 'Senior Recorder', 'password' => bcrypt('password')]);
$pm = User::updateOrCreate(['email' => 'pm@alyasheiee.com'], ['name' => 'Project Manager', 'password' => bcrypt('password')]);

$project = Project::firstOrCreate(['code' => 'DISB-PROJ'], ['name' => 'Disbursement Test Project']);
$warehouse = Warehouse::firstOrCreate(['name' => 'Site Store Alpha'], ['type' => 'site', 'project_id' => $project->id]);

// إنشاء مواد للمحاكاة وتعيين أسعار الوحدة لها
$oil = Material::firstOrCreate(['code' => 'OIL-HM46'], ['name' => 'Hydraulic Oil 46', 'category' => 'oil', 'unit' => 'L']);
$oil->update(['unit_price' => 15.00]); // 15 للتر

$filter = Material::firstOrCreate(['code' => 'FLT-O1'], ['name' => 'Oil Filter', 'category' => 'spare_part', 'unit' => 'pcs']);
$filter->update(['unit_price' => 45.00]); // 45 للقطعة

// تصفير الأرصدة أولاً للتأكد من خلوها من أي تراكم مسبق
\App\Modules\Warehouse\Models\InventoryStock::where('warehouse_id', $warehouse->id)
    ->whereIn('material_id', [$oil->id, $filter->id])
    ->update(['quantity' => 0]);

// تهيئة وتصفير الميزانيات المالية للتجربة
\App\Modules\CostControl\Models\ProjectBudget::updateOrCreate(['project_id' => $project->id, 'category' => 'oil'], ['estimated_amount' => 5000]);
\App\Modules\CostControl\Models\ProjectBudget::updateOrCreate(['project_id' => $project->id, 'category' => 'spare_part'], ['estimated_amount' => 5000]);
\App\Modules\CostControl\Models\ProjectBudget::where('project_id', $project->id)->update(['actual_spent' => 0]);

// تنظيف سجلات التكاليف القديمة للمشروع
\App\Modules\CostControl\Models\CostLog::where('project_id', $project->id)->delete();

// شحن أرصدة افتتاحية في المستودع
$inventoryService = new InventoryService();
$inventoryService->updateStock($warehouse->id, $oil->id, 100); // 100 لتر زيت
$inventoryService->updateStock($warehouse->id, $filter->id, 10); // 10 فلاتر

echo "1. Baseline Setup Completed. Stock: Oil = 100L, Filter = 10pcs.\n";

// 2. Step 1: Recorder Creates Request
Auth::login($recorder);
$disbService = new DisbursementService();
$request = $disbService->createRequest([
    'project_id' => $project->id,
    'type' => 'oil',
    'notes' => 'Need oil and filter for routine maintenance.',
    'items' => [
        ['material_id' => $oil->id, 'item_name' => $oil->name, 'quantity' => 20, 'unit' => $oil->unit],
        ['material_id' => $filter->id, 'item_name' => $filter->name, 'quantity' => 2, 'unit' => $filter->unit]
    ]
]);

echo "2. Request Created: {$request->request_number} by Recorder. Status: {$request->status}\n";

// 3. Step 2: Senior Recorder Confirms
Auth::login($senior);
$disbService->confirmRequest($request);
echo "3. Request Confirmed by Senior. Status: {$request->status}\n";

// 4. Step 3: PM Approves and assigns Warehouse
Auth::login($pm);
$disbService->approveRequest($request, $warehouse->id);
echo "4. Request Approved by PM. Assigned Warehouse: {$warehouse->name}. Status: {$request->status}\n";

// 5. Step 4: Warehouse Keeper Issues Items
$disbService->issueRequest($request);
echo "5. Request Issued by Warehouse Keeper. Status: {$request->status}\n";

// 6. Verify Stock levels
$finalOilStock = $inventoryService->getStock($warehouse->id, $oil->id);
$finalFilterStock = $inventoryService->getStock($warehouse->id, $filter->id);

echo "\nVerification of Remaining Stock:\n";
echo "Hydraulic Oil: {$finalOilStock} L (Expected: 80 L)\n";
echo "Oil Filter: {$finalFilterStock} pcs (Expected: 8 pcs)\n";

// 7. Verify Financial Cost Logs & Budget updates
$oilCost = \App\Modules\CostControl\Models\CostLog::where('project_id', $project->id)
    ->where('source_type', 'disbursement_request')
    ->where('category', 'oil')
    ->sum('amount');

$filterCost = \App\Modules\CostControl\Models\CostLog::where('project_id', $project->id)
    ->where('source_type', 'disbursement_request')
    ->where('category', 'spare_part')
    ->sum('amount');

echo "\nVerification of Cost Logs:\n";
echo "Hydraulic Oil Cost: {$oilCost} (Expected: 300)\n";
echo "Oil Filter Cost: {$filterCost} (Expected: 90)\n";

$oilBudget = \App\Modules\CostControl\Models\ProjectBudget::where('project_id', $project->id)->where('category', 'oil')->first();
$filterBudget = \App\Modules\CostControl\Models\ProjectBudget::where('project_id', $project->id)->where('category', 'spare_part')->first();

echo "\nVerification of Budget Spent update:\n";
echo "Oil Budget Spent: {$oilBudget->actual_spent} (Expected: 300.00)\n";
echo "Filter Budget Spent: {$filterBudget->actual_spent} (Expected: 90.00)\n";

if ($finalOilStock == 80 && $finalFilterStock == 8 && $oilCost == 300 && $filterCost == 90 && $oilBudget->actual_spent == 300 && $filterBudget->actual_spent == 90) {
    echo "\nDISBURSEMENT INTEGRATION TEST PASSED SUCCESSFULLY!\n";
} else {
    echo "\nDISBURSEMENT INTEGRATION TEST FAILED: Stock/Cost mismatch!\n";
    exit(1);
}
