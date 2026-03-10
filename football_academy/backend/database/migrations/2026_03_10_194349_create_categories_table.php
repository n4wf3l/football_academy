<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // U13, U14, U15, etc.
            $table->string('description')->nullable(); // 11-12 ans, etc.
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true); // soft toggle
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
