# 36. CI/CD Strategy (GitHub Actions)

## Continuous Integration (CI)
Every push to `develop` or `feature/*` branches will trigger the following checks:
1. **Linting**: PSR-12 compliance check using PHP_CodeSniffer.
2. **Static Analysis**: PHPStan at level 5+ to catch potential bugs.
3. **Unit & Feature Tests**: Running `php artisan test` with a PostgreSQL service container.
4. **Security Audit**: Running `composer audit` to check for vulnerable dependencies.

## Continuous Deployment (CD)
Automated deployment to staging/production on merge to `main`:
1. **Build**: Install production dependencies, compile assets.
2. **Migrations**: Run `php artisan migrate --force`.
3. **Optimizations**: `config:cache`, `route:cache`, `view:cache`.
4. **Zero-downtime**: Using Laravel Envoy or GitHub Actions with symlink switching.

## Workflow File Structure
The integration logic is defined in `.github/workflows/main.yml`.

## Secret Management
Critical keys must be stored in GitHub Secrets:
- `DB_PASSWORD`
- `APP_KEY`
- `SSH_PRIVATE_KEY` (for deployment)
- `STRIPE_SECRET` (if applicable)
