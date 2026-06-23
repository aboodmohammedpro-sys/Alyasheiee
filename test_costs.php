<?php

use App\Models\User;
use App\Modules\CostControl\Models\ProjectBudget;
use App\Modules\CostControl\Models\CostLog;
use App\Modules\DailyOperations\Models\DailyLog;
use App\Modules\DailyOperations\Services\DailyLogService;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\ResourceAllocation\Models\Employee;
use App\Modules\ResourceAllocation\Models\Equipment;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup Financial Data
$pm = User::updateOrCreate(['email' => 'pm@alyasheiee.com'], ['name' => 'Project Manager', 'password' => bcrypt('password')]);
Auth::login($pm);

$project = Project::firstOrCreate(['code' => 'COST-001'], ['name' => 'Financial Project', 'status' => 'active']);

// Setup Budgets
ProjectBudget::updateOrCreate(['project_id' => $project->id, 'category' => 'labor'], ['estimated_amount' => 10000]);
ProjectBudget::updateOrCreate(['project_id' => $project->id, 'category' => 'equipment'], ['estimated_amount' => 20000]);

// Setup Resources with Rates
$worker = Employee::updateOrCreate(['code' => 'W001'], [
    'name' => 'Skill Labor 1',
    'hourly_rate' => 25.00, // 25 per hour
    'status' => 'active',
    'position' => 'Labor',
    'department' => 'Field'
]);

$bulldozer = Equipment::updateOrCreate(['code' => 'D9-FIN'], [
    'name' => 'Finance Bulldozer',
    'hourly_rate' => 150.00, // 150 per hour
    'status' => 'available',
    'type' => 'heavy'
]);

// 2. Logic Flow: Create and Approve Daily Log
try {
    DailyLog::where('project_id', $project->id)->where('date', now()->toDateString())->forceDelete();
    CostLog::where('project_id', $project->id)->delete();
    ProjectBudget::where('project_id', $project->id)->update(['actual_spent' => 0]);
    
    $service = new DailyLogService();
    $log = $service->createDailyLog([
        'project_id' => $project->id,
        'date' => now()->toDateString(),
        'labor_attendance' => [
            ['employee_id' => $worker->id, 'hours' => 8, 'work_status' => 'present']
        ],
        'equipment_usage' => [
            ['equipment_id' => $bulldozer->id, 'work_hours' => 5, 'start_meter' => 1000, 'end_meter' => 1010]
        ]
    ]);

    echo "Daily Log Created. Status: {$log->status}\n";

    // Approve the log
    $service->approveLog($log, $pm->id);
    echo "Daily Log Approved.\n";

    // 3. Verify Costs
    $laborCost = CostLog::where('project_id', $project->id)->where('category', 'labor')->sum('amount');
    $eqCost = CostLog::where('project_id', $project->id)->where('category', 'equipment')->sum('amount');

    echo "Expected Labor Cost: " . (8 * 25) . ", Actual: $laborCost\n";
    echo "Expected Equipment Cost: " . (5 * 150) . ", Actual: $eqCost\n";

    $budget = ProjectBudget::where('project_id', $project->id)->where('category', 'labor')->first();
    echo "Actual Spent in Budget (Labor): {$budget->actual_spent}\n";

    if ($laborCost == 200 && $eqCost == 750) {
        echo "\nCOST CONTROL TEST PASSED!\n";
    } else {
        echo "\nCOST CONTROL TEST FAILED: Discrepancy in calculations.\n";
        exit(1);
    }

} catch (\Exception $e) {
    echo "COST TEST ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
