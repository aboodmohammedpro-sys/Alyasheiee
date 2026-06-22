# 18. Repository Layer

## Purpose
The Repository pattern abstracts the data persistence layer. This ensures that the Service doesn't care if data comes from Eloquent, a cache, or an external API.

## Mandatory Methods per Repository
- `findById(string $uuid): ?Model`
- `allActive(): Collection`
- `create(array $data): Model`
- `update(string $uuid, array $data): Model`
- `delete(string $uuid): bool`

## Repository Best Practices
- **No Business Logic**: Repositories should only do `where`, `join`, and `order`.
- **Query Scopes**: Repositories are the ideal place to apply logic like `whereModule(x)->active()`.
- **Pagination**: Handle API pagination parameters here.
