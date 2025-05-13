
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../../api';

export const Home = () => {
  const trpc = useTRPC(); // use `import { trpc } from './utils/trpc'` if you're using the singleton pattern
  const userQuery = useQuery(trpc.getUserById.queryOptions("1747163439309"));
  const userCreator = useMutation(trpc.createUser.mutationOptions());

  return (
    <div>
      <p>{userQuery.data?.name || ""}</p>
      <button onClick={() => userCreator.mutate({ name: 'Frodo' })}>
        Create Frodo
      </button>
    </div>
  );
}
