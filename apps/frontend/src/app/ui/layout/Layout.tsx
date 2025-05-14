import { ReactNode, FC, PropsWithChildren } from "react";

import styles from "./Layout.module.css";

type Props = PropsWithChildren<{
  sidebar?: ReactNode
}>

export const Layout: FC<Props> = ({ sidebar, children }) => {
  return (
    <div className={styles.wrapper}>
      {sidebar && <aside className={styles.aside}>
        {sidebar}
      </aside>}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
