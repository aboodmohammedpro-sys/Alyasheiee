# 09. API Integration Plan

This document details the strategies, patterns, and validation workflows required to integrate the Next.js 15 frontend with the **Laravel REST API** backend.

---

## 1. Network Client (Axios/Fetch Setup)

We utilize an Axios instance configured with request and response interceptors to handle session validation, tokens, and unified error parsing.

```typescript
// lib/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.erp-system.local/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Necessary to send secure httpOnly session cookies
});

// Request Interceptor: Attach CSRF Token for state mutations
api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method || '')) {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }
  }
  return config;
}, (error) => Promise.reject(error));
```

---

## 2. Global TanStack Query Configuration
We wrap our API calls in TanStack Query to manage lifecycle caching, asynchronous synchronization, and UI hydration.

```typescript
// lib/react-query/provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection
      refetchOnWindowFocus: false, // Prevent aggressive network requests on page change
      retry: (failureCount, error: any) => {
        // Do not retry on 4xx authorization or input validation errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) return false;
        return failureCount < 3;
      },
    },
  },
});
```

---

## 3. Query Key Factory Pattern
To manage cached assets predictably, we establish a Query Key Factory. This prevents cache invalidation mismatches.

```typescript
// lib/react-query/query-keys.ts
export const keys = {
  all: ['erp'] as const,
  
  projects: () => [...keys.all, 'projects'] as const,
  project: (id: string) => [...keys.projects(), id] as const,
  projectPhases: (id: string) => [...keys.project(id), 'phases'] as const,
  
  inventory: () => [...keys.all, 'inventory'] as const,
  warehouseItems: (warehouseId: string) => [...keys.inventory(), 'warehouse', warehouseId] as const,
  
  fuelLogs: () => [...keys.all, 'fuel-logs'] as const,
};
```

---

## 4. Laravel Validation Error Transformer
Laravel returns a specific validation payload on HTTP status `422 Unprocessable Content`:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "item_code": ["The item code has already been taken."],
    "quantity": ["The quantity must be at least 1."]
  }
}
```

We map this JSON error structure directly to our React Hook Form validation states:

```typescript
// utils/form-errors.ts
import { UseFormSetError, FieldValues } from 'react-hook-form';

export function handleLaravelValidationErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>
) {
  const validationErrors = error?.response?.data?.errors;
  if (validationErrors) {
    Object.keys(validationErrors).forEach((key) => {
      setError(key as any, {
        type: 'server',
        message: validationErrors[key][0], // Pick first error message
      });
    });
  }
}
```

---

## 5. Optimistic UI Updates Example
For fast-paced changes (e.g., ticking off an item on a warehouse checklist), we modify the cache locally before the backend responds, reverting the state only if the request fails.

```typescript
export function useToggleReceiptItem(receiptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => api.patch(`/receipts/${receiptId}/items/${itemId}/toggle`),
    onMutate: async (itemId) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['receipt', receiptId] });

      // Snapshot the previous value
      const previousReceiptData = queryClient.getQueryData(['receipt', receiptId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['receipt', receiptId], (old: any) => {
        return {
          ...old,
          items: old.items.map((item: any) => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      });

      // Return context with snapshotted value
      return { previousReceiptData };
    },
    onError: (err, itemId, context) => {
      // Revert cache if mutation fails
      queryClient.setQueryData(['receipt', receiptId], context?.previousReceiptData);
    },
    onSettled: () => {
      // Always refetch after success or error to sync database state
      queryClient.invalidateQueries({ queryKey: ['receipt', receiptId] });
    },
  });
}
```
