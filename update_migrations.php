<?php
$dir = __DIR__ . "/database/migrations/";

$migrations = [
    "create_sleep_logs_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->date('date');
            \$table->integer('duration_minutes');
            \$table->integer('quality_score')->nullable();
            \$table->timestamps();
    ",
    "create_hydration_logs_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->date('date');
            \$table->integer('amount_ml');
            \$table->timestamps();
    ",
    "create_achievements_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->string('title');
            \$table->text('description')->nullable();
            \$table->string('badge_url')->nullable();
            \$table->timestamp('earned_at')->nullable();
            \$table->timestamps();
    ",
    "create_challenges_table.php" => "
            \$table->id();
            \$table->string('title');
            \$table->text('description');
            \$table->string('type'); 
            \$table->integer('goal_amount');
            \$table->integer('xp_reward');
            \$table->timestamps();
    ",
    "create_notifications_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->string('title');
            \$table->text('message');
            \$table->string('type'); 
            \$table->boolean('is_read')->default(false);
            \$table->timestamps();
    ",
    "create_social_posts_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->text('content');
            \$table->string('image_url')->nullable();
            \$table->timestamps();
    ",
    "create_comments_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->foreignId('social_post_id')->constrained()->onDelete('cascade');
            \$table->text('content');
            \$table->timestamps();
    ",
    "create_likes_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->foreignId('social_post_id')->constrained()->onDelete('cascade');
            \$table->timestamps();
            \$table->unique(['user_id', 'social_post_id']);
    ",
    "create_ai_reports_table.php" => "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->string('type'); 
            \$table->text('content');
            \$table->json('data_payload')->nullable();
            \$table->timestamps();
    ",
];

foreach (glob($dir . "*_create_*.php") as $file) {
    foreach ($migrations as $key => $content) {
        if (strpos($file, $key) !== false) {
            $fileContent = file_get_contents($file);
            $fileContent = preg_replace('/\$table->id\(\);.*\$table->timestamps\(\);/s', trim($content), $fileContent);
            file_put_contents($file, $fileContent);
            echo "Updated: " . basename($file) . "\n";
        }
    }
}
