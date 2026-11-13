<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
        public function up(): void
{
    Schema::create('equipment', function (Blueprint $table) {
        $table->id();
        $table->string('reference')->unique();
        $table->string('name');
        $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
        $table->integer('quantity')->default(0);
        $table->string('location')->nullable();
        $table->enum('status', ['available', 'in_use', 'maintenance'])->default('available');
        $table->text('description')->nullable();
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
