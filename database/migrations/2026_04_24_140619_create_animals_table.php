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
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->string('ear_tag');
            $table->string('cattle_name')->nullable();
            $table->string('cattle_brand_name')->nullable();
            $table->string('electronic_id')->nullable();
            $table->string('ear_tag_color')->nullable();
            $table->enum('status', ['active', 'dead', 'sold', 'reference'])->default('active');
            $table->enum('type', ['bull', 'cow', 'calf', 'replacement_heifer', 'steer']);
            
            $table->foreignId('breed_id')->constrained('breeds');
            $table->foreignId('location_id')->constrained('locations');
            $table->foreignId('group_id')->nullable()->constrained('groups');
            
            $table->date('birth_date')->nullable();
            $table->decimal('birth_weight', 8, 2)->nullable();
            $table->enum('conception', ['natural', 'ai', 'ivf'])->nullable();
            
            $table->foreignId('sire_id')->nullable()->constrained('animals');
            $table->foreignId('dam_id')->nullable()->constrained('animals');
            
            $table->date('weaning_date')->nullable();
            $table->decimal('weaning_weight', 8, 2)->nullable();
            $table->date('yearling_date')->nullable();
            $table->decimal('yearling_weight', 8, 2)->nullable();
            
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
