
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

import { useTRPC } from '~/api';

export const Menu = () => {
  const api = useTRPC();
  const players = useQuery(api.getPlayers.queryOptions())
  return (
    <div>
      <h1>{players.data?.map(name => name).join(", ") || ""}</h1>
      <Link to="/game">Play!</Link>
    </div>
  );
}
