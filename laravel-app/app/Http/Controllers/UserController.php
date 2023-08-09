<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Referrer;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{


    /**
     * Handles the sign-up request.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return \Illuminate\Http\Response - The response object.
     */
    public function signUp(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'email' => 'email|required|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-zA-Z])(?=.*\d).+$/',
            'phone_number' => 'required|unique:users|min:10|max:16',
            'birthdate' => 'date_format:Y-m-d',
            'user_image' => 'image',
            'refferer' => 'sometimes'
        ]);

        // Generate a unique 8-character string for the referral code
        $unique_id = Str::random(6);
        $api_token = Str::random(60);

        // Check if the generated string already exists in the database
        while (User::where('reffer_code', $unique_id)->exists()) {
            $unique_id = Str::random(6);
        }

        // Handle the user image if provided
        if ($request->hasfile('user_image')) {
            $avatarName = time() . '.' . $request->user_image->getClientOriginalExtension();
            $request->user_image->move(public_path('images'), $avatarName);
        }

        // Hash the password and assign the user image, referral code, and API token
        $validatedData['password'] = bcrypt($request->password);
        $validatedData['user_image'] = $avatarName;
        $validatedData['reffer_code'] = $unique_id;
        $validatedData['api_token'] = $api_token;
        $validatedData['uniq_visitors'] = 0;
        $validatedData['all_visitors'] = 0;

        // Create the user in the database
        $user = User::create($validatedData);

        // Generate an access token for the user
        $accessToken = $user->createToken('authToken')->accessToken;

        // Check if a referrer is provided
        if (isset($validatedData['refferer'])) {
            // Find the referrer user based on the referral code
            $reffer_user = User::where('reffer_code', $validatedData['refferer'])->first();

            if ($reffer_user) {
                // Create a referrer record
                Referrer::create([
                    'user_referrer_id' => $reffer_user->id,
                    'user_id' => $user->id
                ]);

                // Calculate points to add based on the number of referred clients
                $clientsCount = Referrer::where('user_referrer_id', $reffer_user->id)->count();
                $pointsToAdd = 5; // Default number of points to add to the user

                if ($clientsCount >= 6 && $clientsCount <= 10) {
                    $pointsToAdd = 7;
                } elseif ($clientsCount >= 11) {
                    $pointsToAdd = 10;
                }

                // Update the referrer user's points
                $reffer_user->points += $pointsToAdd;
                $reffer_user->save();
            }
        }

        // Return the response with the created user and access token
        return response(['user' => $user, 'access_token' => $accessToken]);
    }

    /**
     * Handles the sign-in request.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return \Illuminate\Http\Response - The response object.
     */
    public function signIn(Request $request)
    {
        // Validate the incoming login data
        $loginData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8'
        ]);

        // Attempt to authenticate the user with the provided credentials
        if (!auth()->attempt($loginData)) {
            return response(['message' => 'Invalid login credentials']);
        }

        // Generate an access token for the authenticated user
        $accessToken = auth()->user()->createToken('authToken')->accessToken;

        // Return the response with the authenticated user and access token
        return response(['user' => auth()->user(), 'access_token' => $accessToken]);
    }

    /**
     * Retrieves user referrers based on the email.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return User|null - The user object with referrers.
     */
    public function get_user_referrers(Request $request)
    {
        // Validate the incoming request data
        $validatorData = $request->validate([
            'email' => 'required|email'
        ]);

        // Find the user based on the email
        $user = User::where('email', $validatorData['email'])->first();

        // Load the user's children and their referrers
        $user = User::with('children.refer')->find(1);

        return $user;
    }

    /**
     * Retrieves user information.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return User|null - The user object with related data.
     */
    public function getUser(Request $request)
    {
        // Validate the incoming request data
        $validData = $request->validate([
            'user_id' => 'numeric|sometimes',
            'layers' => 'numeric|sometimes'
        ]);

        $user_id = $request->user()->id;

        // Check if the request is made by an admin and a specific user ID is provided
        if ($request->user()->is_admin && isset($validData['user_id'])) {
            $user_id = $validData['user_id'];
        }

        // Set the default number of layers if not provided
        if (!isset($validData['layers'])) {
            $validData['layers'] = 2;
        }

        $layers = $validData['layers'];
        $str = [];

        // Build the eager loading relationships based on the number of layers
        for ($i = 0; $i < $layers; $i++) {
            $str[] = 'children';
        }

        $eagers_arr = [implode('.', $str)];

        for ($i = 0; $i < $layers; $i++) {
            $temp_str = 'children';
            for ($j = 0; $j < $i; $j++) {
                $temp_str .= '.children';
            }
            $temp_str .= '.user';
            $eagers_arr[] = $temp_str;
        }

        // Check if the user data is cached
        if (Cache::has("get_user_" . $user_id)) {
            return Cache::get("get_user_" . $user_id);
        }

        // Retrieve the user data with the eager loading relationships
        $user_bean = User::with($eagers_arr)->find($user_id);

        // Cache the user data
        Cache::put("get_user_" . $user_id, $user_bean);

        return $user_bean;
    }

    /**
     * Retrieves all users with their children.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return \Illuminate\Database\Eloquent\Collection - The collection of users with children.
     */
    public function index(Request $request)
    {
        // Retrieve all users with their children
        $users = User::with('children.children')->get();

        return $users;
    }

    /**
     * Adds visitors to a user's profile and tracks unique visitors.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return \Illuminate\Http\Response - The response object.
     */
    public function add_visitors(Request $request)
    {
        // Validate the incoming request data
        $validatorData = $request->validate([
            'code' => 'required'
        ]);

        $code = $validatorData['code'];

        // Find the user based on the referral code
        $user_bean = User::where('reffer_code', $code)->first();

        // Increment the total views count
        $user_bean->increment('all_visitors');

        // Track unique visitors
        $visitorKey = 'visitor_' . $user_bean->id;
        if (!$request->cookie($visitorKey)) {
            $user_bean->increment('uniq_visitors');
            $response = response($user_bean)->withCookie(cookie()->forever($visitorKey, true));
        } else {
            $response = $user_bean;
        }

        return $response;
    }

    /**
     * Retrieves the referral chart data.
     *
     * @param \Illuminate\Http\Request $request - The request object.
     * @return \Illuminate\Database\Eloquent\Collection - The collection of referral chart data.
     * @throws Exception - If the user is not an admin.
     */
    public function getRefferChart(Request $request)
    {
        // Check if the user is an admin
        if ($request->user()->is_admin != 1) {
            throw new Exception("Error Processing Request", 500);
        }

        // Retrieve the referral chart data
        $referrers = Referrer::groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d')"))
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m-%d') as day_date, COUNT(*) as total")
            ->get();

        return $referrers;
    }
}