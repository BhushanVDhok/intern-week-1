<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->integer('capacity')->default(100);
            $table->enum('status', ['Good', 'Needs Cleaning', 'Under Maintenance', 'Critical'])->default('Good');
            $table->decimal('cleanliness_score', 3, 1)->default(8.0);
            $table->decimal('odor_score', 3, 1)->default(2.0);
            $table->enum('waste_level', ['Low', 'Medium', 'High'])->default('Low');
            $table->integer('footfall')->default(0);
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
