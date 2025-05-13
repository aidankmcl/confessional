
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '~/api';

export const Home = () => {
  const trpc = useTRPC();

  const pingQuery = useQuery(trpc.ping.queryOptions());
  const userCreator = useMutation(trpc.createUser.mutationOptions());

  return (
    <div>
      <p>{pingQuery.data || ""}</p>
      <button onClick={() => userCreator.mutate({ name: 'Frodo' })}>
        Create Frodo
      </button>
    </div>
  );
}
