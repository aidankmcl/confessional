
import { FC, PropsWithChildren } from "react";

import { Layout } from "~/app/ui";
import { Sidebar } from "~/app/components/Sidebar";


export const Page: FC<PropsWithChildren> = (props) => {
  return <Layout sidebar={<Sidebar />}>
    {props.children}
  </Layout>;
}
