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
        Schema::create('contact_clubs', function (Blueprint $table) {
            $table->id();
            $table->string('club_name');
            $table->string('country');
            $table->string('contact_name')->nullable();
            $table->string('contact_role')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['prospect', 'contacted', 'in_discussion', 'partnership'])->default('prospect');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_clubs');
    }
};
