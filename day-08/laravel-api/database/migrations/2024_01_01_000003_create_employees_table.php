<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('position');
            $table->decimal('salary', 10, 2);
            $table->date('join_date');
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->timestamps();

            $table->index('department_id');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
