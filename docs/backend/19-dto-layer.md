# 19. Data Transfer Objects (DTO)

## Why DTOs?
Passing associative arrays between Controllers and Services is error-prone. DTOs provide type safety and structured data.

## Implementation (Laravel 11/12 specific)
We use PHP 8 readonly properties for DTOs.

```php
readonly class CreateProjectDTO {
    public function __construct(
        public string $name,
        public string $code,
        public ProjectStatus $status,
        public DateTime $startDate,
        public string $createdBy
    ) {}

    public static function fromRequest(ProjectRequest $request): self {
        return new self(
            name: $request->validated('name'),
            ...
        );
    }
}
```

## Benefits
- Clear contract between Controller and Service.
- No more `$data['nmae']` typos.
- IDE Autocomplete.
