<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = 'Alyasheiee@2026';

        $users = [
            [
                'name' => 'المدير العام للنظام (Super Admin)',
                'email' => 'admin@alyasheiee.com',
                'role' => 'super_admin'
            ],
            [
                'name' => 'عبد الله محمد (مدير مشاريع)',
                'email' => 'pm@alyasheiee.com',
                'role' => 'project_manager'
            ],
            [
                'name' => 'أحمد العتيبي (كبير المراقبين)',
                'email' => 'senior@alyasheiee.com',
                'role' => 'senior_recorder'
            ],
            [
                'name' => 'خالد الحربي (مراقب ميداني)',
                'email' => 'recorder@alyasheiee.com',
                'role' => 'recorder'
            ],
            [
                'name' => 'ياسر الحربي (أمين مستودع)',
                'email' => 'storekeeper@alyasheiee.com',
                'role' => 'storekeeper'
            ],
            [
                'name' => 'سلطان سعد (موزع وقود)',
                'email' => 'fuel@alyasheiee.com',
                'role' => 'fuel_dispatcher'
            ],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($password),
                ]
            );

            // إعطاء الدور للمستخدم
            $user->syncRoles([$userData['role']]);
        }
    }
}
