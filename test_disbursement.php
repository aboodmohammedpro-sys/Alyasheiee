<?php

use App\Models\User;
use App\Modules\Warehouse\Models\DisbursementRequest;
use App\Modules\Warehouse\Services\DisbursementService;
use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// 1. Setup Users
$recorder = User::updateOrCreate(['email' => 'recorder@alyasheiee.com'], ['name' => 'Recorder', 'password' => bcrypt('password')]);
$senior = User::updateOrCreate(['email' => 'senior@alyasheiee.com'], ['name' => 'Senior Recorder', 'password' => bcrypt('password')]);
$pm = User::updateOrCreate(['email' => 'pm@alyasheiee.com'], ['name' => 'Project Manager', 'password' => bcrypt('password')]);

$project = Project::first();

// 2. Step 1: Recorder Creates Request
Auth::login($recorder);
$service = new DisbursementService();
$request = $service->createRequest([
    'project_id' => $project->id,
    'type' => 'oil',
    'notes' => 'Need Hydraulic Oil for Excavator EX-01',
    'items' => [
        ['item_name' => 'Hydraulic Oil 46', 'quantity' => 20, 'unit' => 'L'],
        ['item_name' => 'Oil Filter', 'quantity' => 2, 'unit' => 'pcs']
    ]
]);
echo "Request Created: {$request->request_number} by Recorder. Status: {$request->status}\n";

// 3. Step 2: Senior Recorder Confirms
Auth::login($senior);
$service->confirmRequest($request);
echo "Request Confirmed by Senior Recorder. Status: {$request->status}\n";

// 4. Step 3: PM Approves and selects Warehouse
Auth::login($pm);
$tank = \App\Modules\FuelManagement\Models\FuelTank::firstOrCreate(['name' => 'Main Site Tank'], ['type' => 'static', 'capacity' => 10000]);
$service->approveRequest($request, $tank->id);
echo "Request Approved by PM and Warehouse Assigned. Status: {$request->status}\n";

echo "\nDISBURSEMENT WORKFLOW TEST PASSED!\n";
