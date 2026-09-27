<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')->constrained('facilities')->cascadeOnDelete();
            $table->foreignId('inspector_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedTinyInteger('cleanliness_score');
            $table->unsignedTinyInteger('odor_score');
            $table->enum('waste_level', ['Low', 'Medium', 'High']);
            $table->boolean('water_available')->default(true);
            $table->text('notes')->nullable();
            $table->date('inspection_date');
            $table->timestamps();

            $table->index('facility_id');
            $table->index('inspection_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
