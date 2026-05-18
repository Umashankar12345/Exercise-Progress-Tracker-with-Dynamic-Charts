<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        $exercises = [
            // --- CHEST ---
            [
                'name' => 'Bench Press',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Intermediate',
                'equipment' => 'Barbell',
                'description' => 'A classic upper body compound movement targeting the pectoral muscles.',
                'youtube_url' => 'https://www.youtube.com/embed/rT7DgCr-3pg',
                'instructions' => "1. Lie flat on the bench, feet flat on the floor.\n2. Grip the barbell slightly wider than shoulder width.\n3. Lower the barbell slowly to your mid-chest.\n4. Push the barbell back up explosively, locking out your elbows."
            ],
            [
                'name' => 'Incline Dumbbell Press',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Intermediate',
                'equipment' => 'Dumbbell',
                'description' => 'Targeting the upper portion of the pectorals using dumbbells.',
                'youtube_url' => 'https://www.youtube.com/embed/0G2_XTkeyDM',
                'instructions' => "1. Set the incline bench to a 30-45 degree angle.\n2. Lie back holding dumbbells at your chest.\n3. Press the dumbbells straight up above your chest.\n4. Lower them slowly to the starting position."
            ],
            [
                'name' => 'Push-ups',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'The ultimate calisthenic chest exercise.',
                'youtube_url' => 'https://www.youtube.com/embed/IODxDxX7oi4',
                'instructions' => "1. Place hands shoulder-width apart in a plank position.\n2. Lower your chest to the floor keeping your core tight.\n3. Push back up to the starting position."
            ],
            [
                'name' => 'Cable Crossover',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Intermediate',
                'equipment' => 'Cable',
                'description' => 'Isolating the chest with constant cable tension.',
                'youtube_url' => 'https://www.youtube.com/embed/W556U3UpBf4',
                'instructions' => "1. Set pulleys to the high position.\n2. Step forward and grip the handles.\n3. Bring hands down and forward in a wide sweeping arc.\n4. Return under control to the start."
            ],
            [
                'name' => 'Decline Bench Press',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Advanced',
                'equipment' => 'Barbell',
                'description' => 'Targeting the lower fibers of the chest.',
                'youtube_url' => 'https://www.youtube.com/embed/LfyQBUKR8SE',
                'instructions' => "1. Secure legs in the decline bench and lie back.\n2. Grip barbell wider than shoulders.\n3. Lower bar slowly to lower chest.\n4. Push bar straight up."
            ],
            [
                'name' => 'Chest Dips',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Advanced',
                'equipment' => 'Bodyweight',
                'description' => 'Using parallel bars to build the lower chest and triceps.',
                'youtube_url' => 'https://www.youtube.com/embed/2z8JmcrW-As',
                'instructions' => "1. Grab parallel bars and lift body.\n2. Lean slightly forward to emphasize the chest.\n3. Lower body by bending elbows until shoulders are below elbows.\n4. Push back up."
            ],
            [
                'name' => 'Dumbbell Flyes',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'A chest-expanding isolation movement.',
                'youtube_url' => 'https://www.youtube.com/embed/eozdVDA78K0',
                'instructions' => "1. Lie flat on a bench holding dumbbells above chest.\n2. Lower weights out to the sides in a wide arc with slight elbow bend.\n3. Squeeze pectorals to bring them back up."
            ],
            [
                'name' => 'Pec Dec Fly',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Beginner',
                'equipment' => 'Machine',
                'description' => 'Machine chest fly to isolate inner chest muscles.',
                'youtube_url' => 'https://www.youtube.com/embed/4yW4Jp_Z3tM',
                'instructions' => "1. Sit in machine with back flat.\n2. Grip handles at chest height.\n3. Squeeze hands together in front of you.\n4. Return slowly."
            ],
            [
                'name' => 'Incline Bench Press',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Intermediate',
                'equipment' => 'Barbell',
                'description' => 'Barbell variation targeting upper chest hypertrophy.',
                'youtube_url' => 'https://www.youtube.com/embed/DbFgADa2PL8',
                'instructions' => "1. Set bench to 30-degree incline.\n2. Unrack barbell over chest.\n3. Lower slowly to upper chest.\n4. Press back up."
            ],
            [
                'name' => 'Dumbbell Pull-Over',
                'muscle_group' => 'Chest',
                'category' => 'chest',
                'difficulty' => 'Intermediate',
                'equipment' => 'Dumbbell',
                'description' => 'Expanding chest cage while strengthening lats.',
                'youtube_url' => 'https://www.youtube.com/embed/FK4rHfW1rQo',
                'instructions' => "1. Lie across bench with upper back on padding.\n2. Hold one dumbbell with both hands above chest.\n3. Lower dumbbell backward behind your head.\n4. Pull dumbbell back to vertical position."
            ],

            // --- BACK ---
            [
                'name' => 'Pull-ups',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Intermediate',
                'equipment' => 'Bodyweight',
                'description' => 'The golden standard of back training.',
                'youtube_url' => 'https://www.youtube.com/embed/HRV5YKKaeLA',
                'instructions' => "1. Hang from bar with palms facing away.\n2. Pull shoulder blades down and back.\n3. Pull chest up to the bar.\n4. Lower with control."
            ],
            [
                'name' => 'Barbell Row',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Intermediate',
                'equipment' => 'Barbell',
                'description' => 'A compound horizontal pulling movement for back thickness.',
                'youtube_url' => 'https://www.youtube.com/embed/I-R2fMhOluE',
                'instructions' => "1. Hinge at hips with back straight.\n2. Pull barbell toward your lower abdomen.\n3. Squeeze shoulder blades at top.\n4. Lower bar slowly."
            ],
            [
                'name' => 'Lat Pulldown',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Beginner',
                'equipment' => 'Cable',
                'description' => 'Cable isolation movement targeting latissimus dorsi width.',
                'youtube_url' => 'https://www.youtube.com/embed/CAwf7n6Luuc',
                'instructions' => "1. Sit in machine, thighs locked in.\n2. Pull bar down to upper chest.\n3. Keep back straight and squeeze lats.\n4. Return bar slowly."
            ],
            [
                'name' => 'Seated Cable Row',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Beginner',
                'equipment' => 'Cable',
                'description' => 'Maintains constant muscle tension for mid-back thickness.',
                'youtube_url' => 'https://www.youtube.com/embed/GZBz_FLxp9U',
                'instructions' => "1. Feet on platform, knees bent.\n2. Pull handle to chest while pulling shoulders back.\n3. Squeeze mid-back.\n4. Extend arms slowly."
            ],
            [
                'name' => 'Deadlift',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Advanced',
                'equipment' => 'Barbell',
                'description' => 'King of posterior chain strength movements.',
                'youtube_url' => 'https://www.youtube.com/embed/op9kVnSso6Q',
                'instructions' => "1. Stand with feet mid-bar.\n2. Bend at knees and hinge hips, flat back.\n3. Pull bar straight up, driving through hips.\n4. Stand tall, locking hips."
            ],
            [
                'name' => 'T-Bar Row',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Intermediate',
                'equipment' => 'Barbell',
                'description' => 'Traditional back builder utilizing a landmine setup.',
                'youtube_url' => 'https://www.youtube.com/embed/j3Igk5nyZE4',
                'instructions' => "1. Stand over bar, hinge forward.\n2. Pull weight toward chest, elbows close.\n3. Squeeze lats.\n4. Lower weight under control."
            ],
            [
                'name' => 'Dumbbell Row',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Single-arm back builder improving symmetry.',
                'youtube_url' => 'https://www.youtube.com/embed/pYcpY20QaFM',
                'instructions' => "1. One knee and hand on bench.\n2. Hold dumbbell, pull elbow toward hip.\n3. Squeeze lat muscle at peak.\n4. Lower weight under control."
            ],
            [
                'name' => 'Face Pulls',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Beginner',
                'equipment' => 'Cable',
                'description' => 'Implements upper back and rear delts posture conditioning.',
                'youtube_url' => 'https://www.youtube.com/embed/V8dZ3F65660',
                'instructions' => "1. Cable at face height.\n2. Pull rope toward face, thumbs pointing backward.\n3. Squeeze shoulder blades.\n4. Extend under control."
            ],
            [
                'name' => 'HyperExtensions',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Strengthening the lower back erectors.',
                'youtube_url' => 'https://www.youtube.com/embed/5_Ej-L1j38s',
                'instructions' => "1. Place thighs on hyperextension pad.\n2. Lower torso down at hips.\n3. Squeeze back and hamstrings to return to horizontal."
            ],
            [
                'name' => 'Chin-ups',
                'muscle_group' => 'Back',
                'category' => 'back',
                'difficulty' => 'Intermediate',
                'equipment' => 'Bodyweight',
                'description' => 'Underhand grip back pull-up targeting lats and biceps.',
                'youtube_url' => 'https://www.youtube.com/embed/mRznU6pzez0',
                'instructions' => "1. Hang from bar with palms facing you.\n2. Pull chest up to the bar.\n3. Squeeze arms and lats.\n4. Lower under control."
            ],

            // --- LEGS ---
            [
                'name' => 'Barbell Squat',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Advanced',
                'equipment' => 'Barbell',
                'description' => 'The absolute king of lower body development.',
                'youtube_url' => 'https://www.youtube.com/embed/yM-c840ZgAM',
                'instructions' => "1. Rest barbell on upper back.\n2. Squat down by sitting back at hips, keeping chest up.\n3. Go below parallel.\n4. Drive straight back up through heels."
            ],
            [
                'name' => 'Leg Press',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Machine',
                'description' => 'High intensity leg training with spine loaded safety.',
                'youtube_url' => 'https://www.youtube.com/embed/IZxyjWwJYl8',
                'instructions' => "1. Place feet hip-width apart on plate.\n2. Release safety catch, lower platform slowly.\n3. Drive platform up, do not lock out knees."
            ],
            [
                'name' => 'Romanian Deadlift',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Intermediate',
                'equipment' => 'Barbell',
                'description' => 'Targets hamstring and glute development.',
                'youtube_url' => 'https://www.youtube.com/embed/JCXUYuzw0yU',
                'instructions' => "1. Hinge hips back, keeping knees slightly bent.\n2. Slide bar down thighs, keeping back flat.\n3. Stop at mid-shin when hamstrings are stretched.\n4. Drive hips forward."
            ],
            [
                'name' => 'Leg Extensions',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Machine',
                'description' => 'Quadriceps isolation movement.',
                'youtube_url' => 'https://www.youtube.com/embed/YyvSfV9yFyc',
                'instructions' => "1. Align knees with machine pivot.\n2. Extend legs straight out.\n3. Squeeze quads at top.\n4. Lower under control."
            ],
            [
                'name' => 'Leg Curls',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Machine',
                'description' => 'Hamstring isolation builder.',
                'youtube_url' => 'https://www.youtube.com/embed/1Tq3QdYUuHs',
                'instructions' => "1. Lie flat on machine pad.\n2. Pull pad to glutes by curling knees.\n3. Squeeze hamstrings.\n4. Return under control."
            ],
            [
                'name' => 'Calf Raises',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Machine',
                'description' => 'Gastrocnemius calf builder.',
                'youtube_url' => 'https://www.youtube.com/embed/YMmgq7G1c_s',
                'instructions' => "1. Position shoulders under pads, balls of feet on block.\n2. Lower heels down to stretch.\n3. Drive calves straight up, squeeze."
            ],
            [
                'name' => 'Walking Lunges',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Unilateral leg building and core stabilization.',
                'youtube_url' => 'https://www.youtube.com/embed/D7KaRcUTQeE',
                'instructions' => "1. Step forward with dumbbells at sides.\n2. Lower rear knee to near touch to ground.\n3. Step forward through to complete next step."
            ],
            [
                'name' => 'Bulgarian Split Squat',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Advanced',
                'equipment' => 'Dumbbell',
                'description' => 'Unilateral strength builder, high glute and quad activation.',
                'youtube_url' => 'https://www.youtube.com/embed/2C-uNgKwPLE',
                'instructions' => "1. Elevate rear foot on a bench.\n2. Hold dumbbells, step forward.\n3. Drop hips straight down.\n4. Drive up through front foot."
            ],
            [
                'name' => 'Goblet Squat',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'A simple, squat-depth friendly leg builder.',
                'youtube_url' => 'https://www.youtube.com/embed/MeIi3P1sHy8',
                'instructions' => "1. Hold dumbbell vertically at chest.\n2. Drop hips down to squat level.\n3. Push straight up."
            ],
            [
                'name' => 'Glute Bridges',
                'muscle_group' => 'Legs',
                'category' => 'legs',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Targets posterior chain glute development.',
                'youtube_url' => 'https://www.youtube.com/embed/wPM8coz61A8',
                'instructions' => "1. Lie flat on back, knees bent.\n2. Drive hips up towards ceiling, squeezing glutes.\n3. Lower down under control."
            ],

            // --- ARMS / SHOULDERS ---
            [
                'name' => 'Overhead Press',
                'muscle_group' => 'Shoulders',
                'category' => 'arms',
                'difficulty' => 'Intermediate',
                'equipment' => 'Barbell',
                'description' => 'Pillar shoulder builder building anterior deltoid strength.',
                'youtube_url' => 'https://www.youtube.com/embed/2yjwXTZQDDI',
                'instructions' => "1. Barbell at collarbone height.\n2. Press bar straight overhead.\n3. Shrug shoulders at top.\n4. Lower bar to start."
            ],
            [
                'name' => 'Lateral Raises',
                'muscle_group' => 'Shoulders',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Targets lateral deltoids for shoulder width.',
                'youtube_url' => 'https://www.youtube.com/embed/3VcKaX_yggU',
                'instructions' => "1. Hold dumbbells at sides.\n2. Lift weights out to sides in sweeping arc.\n3. Stop at shoulder height.\n4. Lower under control."
            ],
            [
                'name' => 'Front Raises',
                'muscle_group' => 'Shoulders',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Isolates anterior deltoids.',
                'youtube_url' => 'https://www.youtube.com/embed/-t7fuZ0KhDA',
                'instructions' => "1. Hold dumbbells in front of thighs.\n2. Lift one dumbbell straight in front to shoulder height.\n3. Lower, repeat other side."
            ],
            [
                'name' => 'Bicep Curls',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Standard bicep builder.',
                'youtube_url' => 'https://www.youtube.com/embed/ykJgrb560_Q',
                'instructions' => "1. Stand holding dumbbells, palms forward.\n2. Curl weights up towards shoulders.\n3. Squeeze biceps.\n4. Lower under control."
            ],
            [
                'name' => 'Tricep Pushdown',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Cable',
                'description' => 'Constant tension triceps isolation.',
                'youtube_url' => 'https://www.youtube.com/embed/2-LAMcpzODU',
                'instructions' => "1. Grab rope at high cable station.\n2. Tuck elbows at sides.\n3. Press rope straight down, flares at bottom.\n4. Return under control."
            ],
            [
                'name' => 'Hammer Curls',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Builds brachialis and forearm thickness.',
                'youtube_url' => 'https://www.youtube.com/embed/zC3nLlEvin4',
                'instructions' => "1. Stand holding dumbbells with neutral grip (palms in).\n2. Curl weights up, keeping elbows tucked.\n3. Lower with control."
            ],
            [
                'name' => 'Skull Crushers',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Intermediate',
                'equipment' => 'EZ Bar',
                'description' => 'Traditional tricep long head developer.',
                'youtube_url' => 'https://www.youtube.com/embed/d_KZxkY_0cM',
                'instructions' => "1. Lie flat on bench holding EZ bar.\n2. Bend at elbows to lower bar towards forehead.\n3. Press back to starting position."
            ],
            [
                'name' => 'Concentration Curls',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Isolates bicep peak.',
                'youtube_url' => 'https://www.youtube.com/embed/Jvj2wV021sU',
                'instructions' => "1. Sit on bench, elbow against inner thigh.\n2. Curl dumbbell up toward face.\n3. Squeeze bicep.\n4. Lower slowly."
            ],
            [
                'name' => 'Overhead Tricep Extension',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Dumbbell',
                'description' => 'Targets long head of triceps from overhead positions.',
                'youtube_url' => 'https://www.youtube.com/embed/nRiJVZD5y08',
                'instructions' => "1. Sit and hold dumbbell with both hands overhead.\n2. Lower weight behind head by bending elbows.\n3. Press back overhead."
            ],
            [
                'name' => 'Barbell Bicep Curl',
                'muscle_group' => 'Arms',
                'category' => 'arms',
                'difficulty' => 'Beginner',
                'equipment' => 'Barbell',
                'description' => 'Heavy bicep hypertrophy builder.',
                'youtube_url' => 'https://www.youtube.com/embed/QZEqB6wUPxQ',
                'instructions' => "1. Stand holding barbell at thighs, palms forward.\n2. Curl bar up to shoulders.\n3. Squeeze biceps.\n4. Lower bar slowly."
            ],

            // --- CORE ---
            [
                'name' => 'Crunches',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Standard upper ab developer.',
                'youtube_url' => 'https://www.youtube.com/embed/Xyd_fa5zoEU',
                'instructions' => "1. Lie flat on back, knees bent.\n2. Crunch chest up towards knees by curling shoulders.\n3. Lower with control."
            ],
            [
                'name' => 'Plank',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Isometric core stabilizer.',
                'youtube_url' => 'https://www.youtube.com/embed/pSHjTRCQxIw',
                'instructions' => "1. Prop body up on forearms and toes.\n2. Keep body straight from head to heel.\n3. Hold position, squeezing core."
            ],
            [
                'name' => 'Russian Twists',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Targets obliques and rotational strength.',
                'youtube_url' => 'https://www.youtube.com/embed/NeAtimSCxsY',
                'instructions' => "1. Sit with knees bent, torso leaning slightly back.\n2. Elevate feet, twist torso from side to side.\n3. Touch hands to ground on each side."
            ],
            [
                'name' => 'Leg Raises',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Targets lower abs.',
                'youtube_url' => 'https://www.youtube.com/embed/l4kQd9eWclE',
                'instructions' => "1. Lie on back, hands under hips.\n2. Lift legs straight up to 90 degrees.\n3. Lower legs slowly to near ground."
            ],
            [
                'name' => 'Ab Wheel Rollout',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Advanced',
                'equipment' => 'Ab Wheel',
                'description' => 'Heavy eccentric core building.',
                'youtube_url' => 'https://www.youtube.com/embed/rqiDar-y55g',
                'instructions' => "1. Kneel on floor, grip ab wheel handles.\n2. Roll wheel forward, extending body.\n3. Squeeze core to pull wheel back."
            ],
            [
                'name' => 'Hanging Knee Raise',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Intermediate',
                'equipment' => 'Bodyweight',
                'description' => 'Lower ab developer from a hanging position.',
                'youtube_url' => 'https://www.youtube.com/embed/fA54tO6G_70',
                'instructions' => "1. Hang from pull-up bar.\n2. Raise knees up toward chest.\n3. Lower knees under control."
            ],
            [
                'name' => 'Bicycle Crunches',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Highly active core rotational developer.',
                'youtube_url' => 'https://www.youtube.com/embed/IwyvZ9bJ474',
                'instructions' => "1. Lie on back, hands behind head.\n2. Alternately bring elbow to opposite knee while cycling legs.\n3. Keep core engaged."
            ],
            [
                'name' => 'Mountain Climbers',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Cardio core stability builder.',
                'youtube_url' => 'https://www.youtube.com/embed/zT-9L37GywM',
                'instructions' => "1. Start in plank position.\n2. Drive knees forward alternately to chest rapidly.\n3. Maintain flat back."
            ],
            [
                'name' => 'Woodchopper',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Intermediate',
                'equipment' => 'Cable',
                'description' => 'Rotational oblique conditioning.',
                'youtube_url' => 'https://www.youtube.com/embed/pA6a17bKzMw',
                'instructions' => "1. Cable set to high position, stand sideways.\n2. Pull handle diagonally down and across body.\n3. Return under control."
            ],
            [
                'name' => 'Flutter Kicks',
                'muscle_group' => 'Core',
                'category' => 'core',
                'difficulty' => 'Beginner',
                'equipment' => 'Bodyweight',
                'description' => 'Endurance builder for lower ab and hip flexors.',
                'youtube_url' => 'https://www.youtube.com/embed/kK53T71C56c',
                'instructions' => "1. Lie on back, hands under glutes.\n2. Raise heels slightly off floor.\n3. Flutter legs rapidly up and down."
            ],
        ];

        foreach ($exercises as $exercise) {
            Exercise::updateOrCreate(
                ['name' => $exercise['name']],
                $exercise
            );
        }
    }
}
