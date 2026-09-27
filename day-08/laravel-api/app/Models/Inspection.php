<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inspection extends Model
{
    use HasFactory;

    protected $table = 'inspections';

    protected $fillable = [
        'facility_id',
        'inspector_id',
        'cleanliness_score',
        'odor_score',
        'waste_level',
        'water_available',
        'notes',
        'inspection_date'
    ];

    protected $casts = [
        'facility_id' => 'integer',
        'inspector_id' => 'integer',
        'cleanliness_score' => 'integer',
        'odor_score' => 'integer',
        'water_available' => 'boolean',
        'inspection_date' => 'date',
    ];

    /**
     * An inspection belongs to a facility
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }

    /**
     * An inspection is conducted by an inspector (User)
     */
    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }
}
