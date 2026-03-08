<?php

namespace Database\Seeders;

use App\Models\ContactClub;
use App\Models\Player;
use App\Models\Staff;
use App\Models\Partner;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@football-academy.com',
        ]);

        // Staff
        Staff::create(['name' => 'Coach Ibrahim', 'role' => 'Entraineur principal', 'qualification' => 'Licence CAF A']);
        Staff::create(['name' => 'Coach Moussa', 'role' => 'Entraineur adjoint', 'qualification' => 'Licence CAF B']);
        Staff::create(['name' => 'Dr. Konate', 'role' => 'Medecin sportif', 'qualification' => 'Medecine du sport']);
        Staff::create(['name' => 'Ousmane Diallo', 'role' => 'Preparateur physique', 'qualification' => 'BEES 2']);

        // Players
        $players = [
            ['first_name' => 'Amadou', 'last_name' => 'Diallo', 'date_of_birth' => '2008-03-15', 'position' => 'Attaquant', 'preferred_foot' => 'right', 'height' => 178, 'weight' => 70, 'nationality' => 'Senegal', 'category' => 'U17', 'goals' => 15, 'assists' => 8, 'matches_played' => 22, 'is_featured' => true],
            ['first_name' => 'Moussa', 'last_name' => 'Keita', 'date_of_birth' => '2008-07-22', 'position' => 'Milieu', 'preferred_foot' => 'left', 'height' => 175, 'weight' => 68, 'nationality' => 'Mali', 'category' => 'U17', 'goals' => 6, 'assists' => 12, 'matches_played' => 20, 'is_featured' => true],
            ['first_name' => 'Ibrahim', 'last_name' => 'Traore', 'date_of_birth' => '2007-01-10', 'position' => 'Defenseur', 'preferred_foot' => 'right', 'height' => 182, 'weight' => 74, 'nationality' => 'Cote d\'Ivoire', 'category' => 'U19', 'goals' => 2, 'assists' => 5, 'matches_played' => 25, 'is_featured' => true],
            ['first_name' => 'Sekou', 'last_name' => 'Camara', 'date_of_birth' => '2009-11-05', 'position' => 'Gardien', 'preferred_foot' => 'right', 'height' => 185, 'weight' => 78, 'nationality' => 'Guinee', 'category' => 'U17', 'goals' => 0, 'assists' => 0, 'matches_played' => 18, 'is_featured' => true],
            ['first_name' => 'Ousmane', 'last_name' => 'Sow', 'date_of_birth' => '2007-05-30', 'position' => 'Attaquant', 'preferred_foot' => 'right', 'height' => 176, 'weight' => 71, 'nationality' => 'Senegal', 'category' => 'U19', 'goals' => 20, 'assists' => 6, 'matches_played' => 24, 'is_featured' => true],
            ['first_name' => 'Lamine', 'last_name' => 'Toure', 'date_of_birth' => '2008-09-18', 'position' => 'Milieu', 'preferred_foot' => 'right', 'height' => 172, 'weight' => 66, 'nationality' => 'Senegal', 'category' => 'U17', 'goals' => 4, 'assists' => 10, 'matches_played' => 21, 'is_featured' => true],
            ['first_name' => 'Cheick', 'last_name' => 'Ouedraogo', 'date_of_birth' => '2010-02-14', 'position' => 'Defenseur', 'preferred_foot' => 'left', 'height' => 168, 'weight' => 60, 'nationality' => 'Burkina Faso', 'category' => 'U15', 'goals' => 1, 'assists' => 3, 'matches_played' => 15, 'is_featured' => false],
            ['first_name' => 'Abdoulaye', 'last_name' => 'Cisse', 'date_of_birth' => '2010-06-25', 'position' => 'Milieu', 'preferred_foot' => 'right', 'height' => 165, 'weight' => 58, 'nationality' => 'Senegal', 'category' => 'U15', 'goals' => 7, 'assists' => 5, 'matches_played' => 16, 'is_featured' => false],
        ];

        foreach ($players as $player) {
            Player::create($player);
        }

        // Partners
        Partner::create(['name' => 'RSC Anderlecht', 'type' => 'Club partenaire', 'description_fr' => 'Partenariat de scouting et formation.']);
        Partner::create(['name' => 'PSV Eindhoven', 'type' => 'Club partenaire', 'description_fr' => 'Collaboration pour le developpement des talents.']);
        Partner::create(['name' => 'KRC Genk', 'type' => 'Club partenaire', 'description_fr' => 'Programme d\'echange et de detection.']);

        // Tournaments
        Tournament::create(['name' => 'Tournoi International U17', 'category' => 'U17', 'start_date' => '2026-05-15', 'end_date' => '2026-05-18', 'location' => 'Dakar, Senegal', 'description_fr' => 'Tournoi international avec des equipes d\'Afrique et d\'Europe.', 'status' => 'upcoming']);
        Tournament::create(['name' => 'Journee de Detection U19', 'category' => 'U19', 'start_date' => '2026-04-10', 'end_date' => '2026-04-10', 'location' => 'Centre de Formation', 'description_fr' => 'Journee ouverte aux scouts europeens.', 'status' => 'upcoming']);
        Tournament::create(['name' => 'Stage International', 'category' => 'U17/U19', 'start_date' => '2026-07-01', 'end_date' => '2026-07-15', 'location' => 'Bruxelles, Belgique', 'description_fr' => 'Stage de deux semaines en Belgique avec matchs amicaux.', 'status' => 'upcoming']);

        // Contact Clubs
        ContactClub::create(['club_name' => 'RSC Anderlecht', 'country' => 'Belgique', 'contact_role' => 'Directeur du recrutement', 'status' => 'in_discussion']);
        ContactClub::create(['club_name' => 'PSV Eindhoven', 'country' => 'Pays-Bas', 'contact_role' => 'Scout Afrique', 'status' => 'contacted']);
        ContactClub::create(['club_name' => 'Borussia Monchengladbach', 'country' => 'Allemagne', 'contact_role' => 'Directeur centre de formation', 'status' => 'contacted']);
        ContactClub::create(['club_name' => 'KRC Genk', 'country' => 'Belgique', 'contact_role' => 'Directeur du recrutement', 'status' => 'in_discussion']);
    }
}
