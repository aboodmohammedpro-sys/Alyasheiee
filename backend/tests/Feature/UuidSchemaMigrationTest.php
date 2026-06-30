<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class UuidSchemaMigrationTest extends TestCase
{
    public function test_users_and_project_audit_columns_use_uuid_foreign_keys(): void
    {
        Artisan::call('migrate:fresh', ['--seed' => false]);

        $this->assertSame('string', Schema::getColumnType('users', 'id'));
        $this->assertSame('string', Schema::getColumnType('projects', 'created_by'));
        $this->assertSame('string', Schema::getColumnType('projects', 'updated_by'));
        $this->assertSame('string', Schema::getColumnType('projects', 'deleted_by'));
    }
}
