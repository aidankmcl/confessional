import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../../../backend/src';

export { AppRouter };
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
