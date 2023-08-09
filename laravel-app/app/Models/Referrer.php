<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referrer extends Model
{
    protected $table = 'referral';
    protected $fillable = [
        'user_referrer_id',
        'user_id'
    ];
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }
    public function children(){
        return $this->hasMany(Referrer::class,'user_referrer_id','user_id');
    }
}
