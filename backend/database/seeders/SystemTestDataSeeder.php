<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\ResourceAllocation\Models\Equipment;
use App\Modules\ResourceAllocation\Models\Employee;
use App\Modules\Procurement\Models\Material;
use App\Modules\Warehouse\Models\Warehouse;
use App\Modules\Warehouse\Models\InventoryStock;
use App\Modules\FuelManagement\Models\FuelTank;
use App\Modules\CostControl\Models\ProjectBudget;

class SystemTestDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء المستخدمين (أدوار مختلفة للطبقة الأمامية)

        $admin = User::firstOrCreate(
            ['email' => 'admin@erp.com'],
            ['name' => 'المدير العام', 'password' => Hash::make('password')]
        );
        $admin->assignRole('super_admin');

        $pm = User::firstOrCreate(
            ['email' => 'pm@erp.com'],
            ['name' => 'مدير مشروع طريق مكة', 'password' => Hash::make('password')]
        );
        $pm->assignRole('project_manager');

        $recorder = User::firstOrCreate(
            ['email' => 'recorder@erp.com'],
            ['name' => 'عادل - مراقب ميداني', 'password' => Hash::make('password')]
        );
        $recorder->assignRole('recorder');

        $storekeeper = User::firstOrCreate(
            ['email' => 'store@erp.com'],
            ['name' => 'رائد - أمين مستودع', 'password' => Hash::make('password')]
        );
        $storekeeper->assignRole('storekeeper');

        $fuelDispatcher = User::firstOrCreate(
            ['email' => 'fuel@erp.com'],
            ['name' => 'محمد - موزع وقود', 'password' => Hash::make('password')]
        );
        $fuelDispatcher->assignRole('fuel_dispatcher');

        // 2. إنشاء المشاريع

        $project1 = Project::firstOrCreate(
            ['code' => 'PRJ-MKK-01'],
            [
                'name' => 'مشروع تطوير طريق مكة',
                'client_name' => 'وزارة النقل',
                'location' => 'مكة المكرمة',
                'start_date' => now()->subMonths(2),
                'expected_end_date' => now()->addMonths(10),
                'estimated_budget' => 15000000,
                'status' => 'active',
            ]
        );

        // الميزانية التقديرية للمشروع (Cost Control)
        $categories = ['labor' => 3000000, 'material' => 7000000, 'equipment' => 4000000, 'fuel' => 500000, 'misc' => 500000];
        foreach ($categories as $cat => $amount) {
            ProjectBudget::firstOrCreate([
                'project_id' => $project1->id,
                'category' => $cat
            ], [
                'estimated_amount' => $amount,
                'actual_spent' => 0
            ]);
        }

        // 3. إنشاء المعدات
        $excavator = Equipment::firstOrCreate(
            ['code' => 'EXC-001'],
            [
                'name' => 'حفار كاتربيلر 320',
                'brand' => 'CAT 320',
                'type' => 'excavator',
                'hourly_rate' => 150,
                'standard_consumption_rate' => 20,
                'status' => 'working'
            ]
        );

        $truck = Equipment::firstOrCreate(
            ['code' => 'TRK-001'],
            [
                'name' => 'شاحنة مرسيدس أكتروس',
                'brand' => 'Actros',
                'type' => 'dump_truck',
                'hourly_rate' => 120,
                'standard_consumption_rate' => 35,
                'status' => 'working'
            ]
        );

        // 4. إنشاء الموظفين والمشغلين السائقين
        $operator = Employee::firstOrCreate(
            ['code' => 'EMP-001'],
            ['name' => 'سالم الدوسري (سائق)', 'position' => 'operator', 'hourly_rate' => 25, 'status' => 'active']
        );

        $labor = Employee::firstOrCreate(
            ['code' => 'EMP-002'],
            ['name' => 'عامل بناء', 'position' => 'laborer', 'hourly_rate' => 15, 'status' => 'active']
        );

        // 5. إنشاء مستودع وخزان وقود موقعي
        $warehouse = Warehouse::firstOrCreate(
            ['name' => 'مستودع مشروع مكة الرئيسي'],
            ['type' => 'site', 'location' => 'موقع المشروع']
        );

        $tank = FuelTank::firstOrCreate(
            ['name' => 'خزان المشروع المتحرك 1'],
            ['type' => 'mobile', 'capacity' => 10000, 'current_balance' => 8500]
        );

        // 6. إنشاء أصناف المواد (Materials)
        $cement = Material::firstOrCreate(
            ['code' => 'MAT-CEMENT'],
            ['name' => 'أسمنت بورتلاندي', 'category' => 'raw_materials', 'unit' => 'كيس']
        );

        $steel = Material::firstOrCreate(
            ['code' => 'MAT-STEEL'],
            ['name' => 'حديد تسليح 16مم', 'category' => 'raw_materials', 'unit' => 'طن']
        );

        $oil = Material::firstOrCreate(
            ['code' => 'MAT-OIL20W50'],
            ['name' => 'زيت محركات 20W50', 'category' => 'spare_parts', 'unit' => 'لتر']
        );

        // أرصدة مخزون بدائية
        InventoryStock::firstOrCreate(
            ['warehouse_id' => $warehouse->id, 'material_id' => $cement->id],
            ['quantity' => 500]
        );
        InventoryStock::firstOrCreate(
            ['warehouse_id' => $warehouse->id, 'material_id' => $steel->id],
            ['quantity' => 150]
        );
        InventoryStock::firstOrCreate(
            ['warehouse_id' => $warehouse->id, 'material_id' => $oil->id],
            ['quantity' => 1000]
        );
    }
}
