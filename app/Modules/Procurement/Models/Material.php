<?php

namespace App\Modules\Procurement\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Material extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = ['code', 'name', 'category', 'unit', 'description', 'unit_price'];
}
