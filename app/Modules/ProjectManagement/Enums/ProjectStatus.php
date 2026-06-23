<?php

namespace App\Modules\ProjectManagement\Enums;

enum ProjectStatus: string
{
    case PLANNING = 'planning';
    case ACTIVE = 'active';
    case ON_HOLD = 'on_hold';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::PLANNING => 'قيد التخطيط',
            self::ACTIVE => 'نشط',
            self::ON_HOLD => 'متوقف مؤقتاً',
            self::COMPLETED => 'مكتمل',
            self::CANCELLED => 'ملغي',
        };
    }
}
