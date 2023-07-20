import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header() {
  const { asPath } = useRouter();

  // console.log(asPath);

  const headerClass = asPath.includes('post')
    ? styles.headerContainerInPost
    : styles.headerContainer;

  // console.log(styles.headerContainer);

  return (
    <header className={headerClass}>
      <img src="/images/logo.svg" alt="logo" />
    </header>
  );
}
