
import { useQuery, useMutation } from '@tanstack/react-query';
// import { useTRPC } from '../trpc';


export const  App = () => {

  // const trpc = useTRPC();
  // const greetingQuery = useQuery(trpc.hello);

  return (
    <div>
      <button onClick={() => { console.log("hi!") }}>Ping</button>
    </div>
  );
}
