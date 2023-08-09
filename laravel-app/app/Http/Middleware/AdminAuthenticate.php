<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate;

class AdminAuthenticate extends Authenticate
{
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('admin.login');
        }
    }

    protected function authenticate($request, array $guards)
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if ($guard == 'admin' && $this->auth->guard($guard)->check()) {
                return $this->auth->shouldUse($guard);
            }
        }

        throw new AuthenticationException(
            'Unauthenticated.', $guards, $this->redirectTo($request)
        );
    }
}