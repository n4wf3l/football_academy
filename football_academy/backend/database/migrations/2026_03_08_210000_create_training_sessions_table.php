<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('training_sessions', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('day_of_week'); // 0=Lundi ... 6=Dimanche
            $table->string('start_time', 5); // "07:00"
            $table->string('end_time', 5); // "08:30"
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('category')->nullable(); // U13, U15, U17, U19, Tous
            $table->string('location')->nullable();
            $table->string('coach')->nullable();
            $table->string('color', 20)->default('green'); // green, blue, orange, purple, red, gray
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_sessions');
    }
};
