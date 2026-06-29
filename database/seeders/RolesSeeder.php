<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. تعريف الصلاحيات (Permissions)
        $permissions = [
            'create_daily_log',
            'approve_daily_log',
            'create_disbursement_request',
            'approve_disbursement_request',
            'issue_materials',
            'manage_fuel',
            'view_financial_reports',
            'manage_projects',
            'manage_users'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. تعريف الأدوار (Roles) وربطها بالصلاحيات

        // Super Admin: كل شيء
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->syncPermissions(Permission::all());

        // مدير المشروع (PM)
        $pm = Role::firstOrCreate(['name' => 'project_manager']);
        $pm->syncPermissions([
            'create_daily_log',
            'approve_daily_log',
            'create_disbursement_request',
            'approve_disbursement_request',
            'view_financial_reports',
            'manage_projects'
        ]);

        // كبير المراقبين (Senior Recorder)
        $senior = Role::firstOrCreate(['name' => 'senior_recorder']);
        $senior->syncPermissions([
            'create_daily_log',
            'approve_daily_log',
            'create_disbursement_request'
        ]);

        // المراقب (Recorder)
        $recorder = Role::firstOrCreate(['name' => 'recorder']);
        $recorder->syncPermissions([
            'create_daily_log',
            'create_disbursement_request'
        ]);

        // أمين المستودع (Storekeeper)
        $storekeeper = Role::firstOrCreate(['name' => 'storekeeper']);
        $storekeeper->syncPermissions([
            'issue_materials'
        ]);

        // موزع الوقود (Fuel Dispatcher)
        $fuelDispatcher = Role::firstOrCreate(['name' => 'fuel_dispatcher']);
        $fuelDispatcher->syncPermissions([
            'manage_fuel'
        ]);
    }
}
