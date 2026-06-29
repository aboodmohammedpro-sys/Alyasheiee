<?php

use App\Models\User;
use App\Modules\FuelManagement\Models\FuelTank;
use App\Modules\FuelManagement\Services\FuelService;
use App\Modules\ResourceAllocation\Models\Equipment;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup
$admin = User::firstOrCreate(['email' => 'admin@alyasheiee.com'], ['name' => 'Admin']);
Auth::login($admin);

$project = Project::firstOrCreate(['code' => 'FUEL-TEST'], ['name' => 'Fuel Efficiency Project']);
$tank = FuelTank::firstOrCreate(['name' => 'Main Tank'], ['current_balance' => 1000, 'capacity' => 5000]);
$excavator = Equipment::firstOrCreate(['code' => 'EXC-01'], [
    'name' => 'Caterpillar 320', 
    'type' => 'excavator',
    'standard_consumption_rate' => 20.00, // 20L per hour
    'fuel_tracking_type' => 'hours',
    'fuel_tolerance_percentage' => 10.00, // 10% tolerance (Max 22L/hr)
    'last_meter_reading' => 1000
]);

$fuelService = new FuelService();

echo "1. Setup Finished. Excavator @ 1000 hours. Std Rate: 20L/hr.\n";

// Case A: Normal Consumption
// Worked 5 hours (1000 -> 1005). Consumed 95 Liters.
// Rate = 95/5 = 19L/hr (Normal)
echo "\nTesting Normal Case: 5 hours, 95 Liters...\n";
$tx1 = $fuelService->dispenseFuel([
    'from_tank_id' => $tank->id,
    'equipment_id' => $excavator->id,
    'project_id' => $project->id,
    'quantity' => 95,
    'odometer_reading' => 1005,
]);
echo "Transaction 1 Status: {$tx1->status} (Expected: normal)\n";

// Case B: High Consumption (Potential Theft/Leak)
// Worked 2 hours (1005 -> 1007). Consumed 100 Liters!
// Rate = 100/2 = 50L/hr (Anomaly!)
echo "\nTesting Anomaly Case: 2 hours, 100 Liters...\n";
$tx2 = $fuelService->dispenseFuel([
    'from_tank_id' => $tank->id,
    'equipment_id' => $excavator->id,
    'project_id' => $project->id,
    'quantity' => 100,
    'odometer_reading' => 1007,
]);
echo "Transaction 2 Status: {$tx2->status} (Expected: anomaly)\n";

if ($tx1->status == 'normal' && $tx2->status == 'anomaly') {
    echo "\nFUEL EFFICIENCY TEST PASSED!\n";
} else {
    echo "\nFUEL EFFICIENCY TEST FAILED!\n";
    exit(1);
}
