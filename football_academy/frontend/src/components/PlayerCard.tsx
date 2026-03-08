import { Link } from 'react-router-dom';
import type { Player } from '../types';

interface Props {
  player: Player;
}

export default function PlayerCard({ player }: Props) {
  const age = new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();

  return (
    <Link
      to={`/players/${player.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-3/4 bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
        {player.photo ? (
          <img
            src={player.photo}
            alt={`${player.first_name} ${player.last_name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-24 h-24 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-accent text-black px-3 py-1 rounded-full text-xs font-bold">
          {player.position}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">
          {player.first_name} {player.last_name}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>{age} ans</span>
          <span>{player.category}</span>
          <span>Pied {player.preferred_foot === 'right' ? 'droit' : 'gauche'}</span>
        </div>
        {player.matches_played > 0 && (
          <div className="flex gap-4 mt-3 text-sm">
            <div className="text-center">
              <div className="font-bold text-primary">{player.matches_played}</div>
              <div className="text-gray-400 text-xs">Matchs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary">{player.goals}</div>
              <div className="text-gray-400 text-xs">Buts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary">{player.assists}</div>
              <div className="text-gray-400 text-xs">Passes D.</div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
