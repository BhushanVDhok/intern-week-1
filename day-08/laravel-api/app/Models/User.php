<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'role'
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    /**
     * Inspections conducted by this user
     */
    public function inspections()
    {
        return $this->hasMany(Inspection::class, 'inspector_id');
    }

    /**
     * Complaints assigned to this user
     */
    public function assignedComplaints()
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }
}
