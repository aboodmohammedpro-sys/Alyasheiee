<?php

namespace App\Modules\ProjectManagement\DTOs;

use App\Modules\ProjectManagement\Enums\ProjectStatus;

readonly class ProjectDTO
{
    public function __construct(
        public string $name,
        public string $code,
        public ?string $client_name = null,
        public ?string $location = null,
        public ?string $start_date = null,
        public ?string $expected_end_date = null,
        public float $estimated_budget = 0,
        public ProjectStatus $status = ProjectStatus::PLANNING,
        public ?string $description = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name: $data['name'],
            code: $data['code'],
            client_name: $data['client_name'] ?? null,
            location: $data['location'] ?? null,
            start_date: $data['start_date'] ?? null,
            expected_end_date: $data['expected_end_date'] ?? null,
            estimated_budget: (float) ($data['estimated_budget'] ?? 0),
            status: ProjectStatus::from($data['status'] ?? 'planning'),
            description: $data['description'] ?? null
        );
    }
}
