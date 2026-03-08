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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->string('position');
            $table->string('preferred_foot')->default('right');
            $table->integer('height')->nullable();
            $table->integer('weight')->nullable();
            $table->string('nationality')->nullable();
            $table->string('category');
            $table->integer('goals')->default(0);
            $table->integer('assists')->default(0);
            $table->integer('matches_played')->default(0);
            $table->text('bio_fr')->nullable();
            $table->text('bio_en')->nullable();
            $table->string('photo')->nullable();
            $table->string('highlight_video')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
