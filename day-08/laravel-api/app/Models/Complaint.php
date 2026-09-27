<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $table = 'complaints';

    protected $fillable = [
        'facility_id',
        'complaint_title',
        'description',
        'priority',
        'status',
        'assigned_to'
    ];

    protected $casts = [
        'facility_id' => 'integer',
        'assigned_to' => 'integer',
    ];

    /**
     * A complaint belongs to a facility
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }

    /**
     * A complaint can be assigned to a user/staff
     */
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
