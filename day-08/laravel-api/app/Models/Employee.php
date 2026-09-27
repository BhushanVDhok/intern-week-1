<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'department_id',
        'name',
        'email',
        'position',
        'salary',
        'join_date',
        'status'
    ];

    protected $casts = [
        'department_id' => 'integer',
        'salary' => 'float',
        'join_date' => 'date',
    ];

    /**
     * Employee belongs to a department
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
