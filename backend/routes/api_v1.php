<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes - Architecture Standard (Modular Monolith)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. Authentication (Public)
    Route::post('auth/login', [\App\Modules\Auth\Controllers\AuthController::class, 'login']);

    // --- PROTECTED ROUTES ---
    Route::middleware('auth:sanctum')->group(function () {
        
        Route::post('auth/logout', [\App\Modules\Auth\Controllers\AuthController::class, 'logout']);

        // 2. Projects (Web: Admin/Create, Mobile: View)
        Route::get('projects', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'index']); 
        Route::post('projects', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'store']); 
        Route::get('projects/{project}', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'show']); 

        // 3. Resources (Shared Resources)
        Route::get('resources/employees', [\App\Modules\ResourceAllocation\Controllers\ResourceController::class, 'getEmployees']);
        Route::get('resources/equipment', [\App\Modules\ResourceAllocation\Controllers\ResourceController::class, 'getEquipment']);

        // 4. Daily Operations (Mobile: Execution, Web: Review)
        Route::prefix('daily-operations')->group(function () {
            Route::get('logs', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'index']); 
            Route::post('logs', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'store']); 
            Route::get('logs/{dailyLog}', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'show']);
            Route::post('logs/{dailyLog}/submit', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'submit']); 
            Route::post('logs/{dailyLog}/approve', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'approve']); 
        });

        // 5. Warehouse & Fuel Management
        Route::prefix('warehouse')->group(function () {
            // Fuel Tanks & Transactions
            Route::get('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'getTanks']);
            Route::post('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'storeTank']);
            Route::get('fuel/transactions', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'transactions']);
            Route::post('dispense', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'dispense']); // Fuel Dispatcher
            
            // Warehouses listing
            Route::get('warehouses', [\App\Modules\Warehouse\Controllers\WarehouseController::class, 'index']);
            Route::get('warehouses/{warehouse}', [\App\Modules\Warehouse\Controllers\WarehouseController::class, 'show']);
            Route::get('warehouses/{warehouse}/stock', [\App\Modules\Warehouse\Controllers\WarehouseController::class, 'stock']);

            // Disbursement Flow
            Route::get('disbursement', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'index']);
            Route::post('disbursement', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'store']); // Recorder/Storekeeper
            Route::get('disbursement/{disbursementRequest}', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'show']);
            Route::post('disbursement/{disbursementRequest}/confirm', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'confirm']);
            Route::post('disbursement/{disbursementRequest}/approve', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'approve']); // PM Only
            Route::post('disbursement/{disbursementRequest}/issue', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'issue']); // Store Keeper

            // GRN (Goods Received Note)
            Route::post('grn', [\App\Modules\Warehouse\Controllers\GrnController::class, 'store']); // Store Keeper

            // Inventory Transfers (Multi-Warehouse)
            Route::post('transfers', [\App\Modules\Warehouse\Controllers\TransferController::class, 'store']);
            Route::post('transfers/{inventoryTransfer}/ship', [\App\Modules\Warehouse\Controllers\TransferController::class, 'ship']);
            Route::post('transfers/{inventoryTransfer}/receive', [\App\Modules\Warehouse\Controllers\TransferController::class, 'receive']);
        });

        // 6. Procurement (Web Management)
        Route::prefix('procurement')->group(function () {
            // Materials
            Route::get('materials', [\App\Modules\Procurement\Controllers\MaterialController::class, 'index']);
            Route::post('materials', [\App\Modules\Procurement\Controllers\MaterialController::class, 'store']);
            Route::get('materials/{material}', [\App\Modules\Procurement\Controllers\MaterialController::class, 'show']);

            // Suppliers
            Route::get('suppliers', [\App\Modules\Procurement\Controllers\SupplierController::class, 'index']);
            Route::post('suppliers', [\App\Modules\Procurement\Controllers\SupplierController::class, 'store']);
            Route::get('suppliers/{supplier}', [\App\Modules\Procurement\Controllers\SupplierController::class, 'show']);

            // Purchase Requests
            Route::get('purchase-requests', [\App\Modules\Procurement\Controllers\PurchaseRequestController::class, 'index']);
            Route::post('purchase-requests', [\App\Modules\Procurement\Controllers\PurchaseRequestController::class, 'store']);
            Route::get('purchase-requests/{purchaseRequest}', [\App\Modules\Procurement\Controllers\PurchaseRequestController::class, 'show']);
            Route::patch('purchase-requests/{purchaseRequest}/status', [\App\Modules\Procurement\Controllers\PurchaseRequestController::class, 'updateStatus']);

            // Purchase Orders
            Route::get('purchase-orders', [\App\Modules\Procurement\Controllers\PurchaseOrderController::class, 'index']);
            Route::post('purchase-orders/convert', [\App\Modules\Procurement\Controllers\PurchaseOrderController::class, 'convert']);
            Route::get('purchase-orders/{purchaseOrder}', [\App\Modules\Procurement\Controllers\PurchaseOrderController::class, 'show']);
        });

        // 7. Reports & Financial Dashboard (Web Only)
        Route::get('reports/project-dashboard/{project}', [\App\Modules\CostControl\Controllers\ReportController::class, 'projectDashboard']);
    });
});
