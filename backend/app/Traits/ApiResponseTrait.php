<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    /**
     * رد النجاح الموحد
     */
    protected function successResponse($data, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'meta'    => [
                'timestamp' => now()->toIso8601String(),
            ]
        ], $code);
    }

    /**
     * رد الخطأ الموحد
     */
    protected function errorResponse(string $message, int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
            'code'    => $this->getErrorCode($code),
        ], $code);
    }

    /**
     * رد الصفحات (Pagination)
     */
    protected function paginatedResponse($resource): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $resource->items(),
            'links'   => [
                'first' => $resource->url(1),
                'last'  => $resource->url($resource->lastPage()),
                'prev'  => $resource->previousPageUrl(),
                'next'  => $resource->nextPageUrl(),
            ],
            'meta'    => [
                'current_page' => $resource->currentPage(),
                'last_page'    => $resource->lastPage(),
                'per_page'     => $resource->perPage(),
                'total'        => $resource->total(),
            ]
        ]);
    }

    private function getErrorCode(int $code): string
    {
        return match ($code) {
            401 => 'UNAUTHORIZED',
            403 => 'FORBIDDEN',
            404 => 'NOT_FOUND',
            422 => 'VALIDATION_ERROR',
            500 => 'SERVER_ERROR',
            default => 'GENERAL_ERROR',
        };
    }
}
