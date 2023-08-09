<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \App\Models\Admin;
use Illuminate\Support\Str;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => "Hassan wael",
            'email' => "hassanwael@gmail.com",
            'phone_number' => "0799999999",
            'birthdate'=>fake()->dateTimeBetween('-30 years','-24 years'),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'user_image'=>'profilepic.png',
            'reffer_code'=>Str::random(6),
            'remember_token' => Str::random(10),
            'points'=>0,
            'api_token'=>Str::random(30),
            'all_visitors'=>0,
            'uniq_visitors'=>0,
            'is_admin'=>1
        ]);
        \App\Models\User::factory()->create([
            'name' => "Normal User",
            'email' => "Normal@gmail.com",
            'phone_number' => "079998888",
            'birthdate'=>fake()->dateTimeBetween('-30 years','-24 years'),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'user_image'=>'profilepic.png',
            'reffer_code'=>Str::random(6),
            'remember_token' => Str::random(10),
            'points'=>0,
            'api_token'=>Str::random(30),
            'all_visitors'=>0,
            'uniq_visitors'=>0,
            'is_admin'=>0
        ]);
        
    }
}
