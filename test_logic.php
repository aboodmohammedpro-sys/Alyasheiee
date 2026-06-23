<?php

use App\Models\User;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\ResourceAllocation\Models\Employee;
use App\Modules\ResourceAllocation\Models\ProjectAssignment;
use App\Modules\DailyOperations\Models\DailyLog;
use Illuminate\Support\Facades\Hash;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // 1. Create Recorder
    $recorder = User::updateOrCreate(
        ['email' => 'recorder@alyasheiee.com'],
        ['name' => 'Ahmed Mohamed', 'password' => Hash::make('password')]
    );
    echo "Recorder Created: " . $recorder->id . "\n";

    // 2. Create Project
    $project = Project::updateOrCreate(
        ['code' => 'PRJ-2026-001'],
        ['name' => 'Construction of Alyasheiee HQ', 'status' => 'active']
    );
    echo "Project Created: " . $project->id . "\n";

    // 3. Assign Recorder to Project
    ProjectAssignment::updateOrCreate(
        [
            'project_id' => $project->id, 
            'assignable_id' => $recorder->id, 
            'assignable_type' => User::class
        ],
        ['start_date' => now(), 'status' => 'active']
    );
    echo "Assignment Created\n";

    // 4. Create Employee
    $employee = Employee::updateOrCreate(
        ['code' => 'EMP-001'],
        ['name' => 'Worker Ali', 'position' => 'Laborer', 'status' => 'active']
    );
    echo "Employee Created: " . $employee->id . "\n";

    // 5. Create Daily Log via Controller/Action simulation
    Auth::login($recorder);
    $service = app(\App\Modules\DailyOperations\Services\DailyLogService::class);
    $logData = [
        'project_id' => $project->id,
        'date' => now()->toDateString(),
        'general_notes' => 'Test Log from script',
        'labor_attendance' => [
            [
                'employee_id' => $employee->id,
                'hours' => 8.5,
                'status' => 'present'
            ]
        ]
    ];

    $log = $service->createDailyLog($logData);
    echo "Daily Log Created Successfully: " . $log->id . "\n";
    echo "Log Status: " . $log->status . "\n";

} catch (\Exception $e) {
    echo "TEST FAILED: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
