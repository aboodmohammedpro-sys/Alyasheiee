<?php

use App\Models\User;
use App\Modules\FuelManagement\Models\FuelTank;
use App\Modules\FuelManagement\Services\FuelService;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\ResourceAllocation\Models\Equipment;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup Data
$dispatcher = User::firstOrCreate(['email' => 'dispatcher@alyasheiee.com'], [
    'name' => 'Fuel Dispatcher',
    'password' => bcrypt('password'),
]);

Auth::login($dispatcher);

$project = Project::first() ?: Project::create([
    'name' => 'Test Project',
    'code' => 'PRJ-FUEL-01',
    'status' => 'active'
]);

$equipment = Equipment::first() ?: Equipment::create([
    'name' => 'Bulldozer D9',
    'code' => 'BD-001',
    'type' => 'heavy',
    'status' => 'available'
]);

// 2. Fuel Flow
try {
    $service = new FuelService();

    // Create Tank
    $tank = FuelTank::create([
        'name' => 'Site Tank A',
        'type' => 'static',
        'capacity' => 5000,
        'current_balance' => 0,
        'project_id' => $project->id
    ]);
    echo "Tank Created: {$tank->name} (Balance: {$tank->current_balance})\n";

    // Receive Fuel
    $service->receiveFuel($tank, 1000, "Initial site supply");
    $tank->refresh();
    echo "Fuel Received: 1000L. New Balance: {$tank->current_balance}L\n";

    // Dispense Fuel
    $service->dispenseFuel([
        'from_tank_id' => $tank->id,
        'equipment_id' => $equipment->id,
        'project_id' => $project->id,
        'quantity' => 150,
        'odometer_reading' => 12500
    ]);
    $tank->refresh();
    echo "Fuel Dispensed to Equipment: 150L. Remaining Balance: {$tank->current_balance}L\n";

    echo "\nFUEL TEST PASSED SUCCESSFULLY!\n";

} catch (\Exception $e) {
    echo "FUEL TEST FAILED: " . $e->getMessage() . "\n";
    exit(1);
}
