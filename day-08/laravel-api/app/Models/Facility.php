<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    protected $table = 'facilities';

    protected $fillable = [
        'name',
        'location',
        'capacity',
        'status',
        'cleanliness_score',
        'odor_score',
        'waste_level',
        'footfall'
    ];

    protected $casts = [
        'capacity' => 'integer',
        'cleanliness_score' => 'float',
        'odor_score' => 'float',
        'footfall' => 'integer',
    ];

    /**
     * A facility has many inspection records
     */
    public function inspections()
    {
        return $this->hasMany(Inspection::class, 'facility_id');
    }

    /**
     * A facility has many complaints
     */
    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'facility_id');
    }

    /**
     * Scope query to find facilities needing attention
     */
    public function scopeNeedsAttention($query)
    {
        return $query->where('cleanliness_score', '<', 5.0)
                     ->orWhereIn('status', ['Needs Cleaning', 'Critical']);
    }
}
