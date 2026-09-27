<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';

    protected $fillable = [
        'name',
        'code',
        'budget',
        'head_user_id'
    ];

    protected $casts = [
        'budget' => 'float',
        'head_user_id' => 'integer'
    ];

    /**
     * Department has many employees
     */
    public function employees()
    {
        return $this->hasMany(Employee::class, 'department_id');
    }

    /**
     * Department head user
     */
    public function head()
    {
        return $this->belongsTo(User::class, 'head_user_id');
    }
}
