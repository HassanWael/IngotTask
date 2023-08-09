<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
class AdminController extends Controller
{
    // IGNORE ME I AM USELESS
    public function index()
    {
        $admins = Admin::all();
        return view('admin.index', ['admins' => $admins]);
    }

    public function create()
    {
        return view('admin.create');
    }

    public function store(Request $request)
    {
        $admin = new Admin;
        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->password = bcrypt($request->password);
        $admin->save();
        return redirect()->route('admin.index');
    }

    public function edit($id)
    {
        $admin = Admin::find($id);
        return view('admin.edit', ['admin' => $admin]);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::find($id);
        $admin->name = $request->name;
        $admin->email = $request->email;
        if ($request->password) {
            $admin->password = bcrypt($request->password);
        }
        $admin->save();
        return redirect()->route('admin.index');
    }

    public function destroy($id)
    {
        $admin = Admin::find($id);
        $admin->delete();
        return redirect()->route('admin.index');
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
    
        $user = Admin::where('email', $credentials['email'])->first();
    
        if ($user && Hash::check($credentials['password'], $user->password)) {
            $token = $user->createToken('Admin Access Token')->accessToken;
            
            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        }
    
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function logout(Request $request)
    {
        $request->user('admin')->token()->revoke();

        return response()->json(['message' => 'Successfully logged out']);
    }
}