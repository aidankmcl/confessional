
import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '~/api';
import { Page } from '~/app/components';

export const Menu = () => {
  const api = useTRPC();
  const players = useQuery(api.getPlayers.queryOptions())
  return (
    <Page>
      <h1>{players.data?.map(name => name).join(", ") || ""}</h1>
    </Page>
  );
}
