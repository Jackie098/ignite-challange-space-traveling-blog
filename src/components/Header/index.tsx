import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const { asPath } = useRouter();

  // console.log(asPath);

  const headerClass = asPath.includes('post')
    ? styles.headerContainerInPost
    : styles.headerContainer;

  // console.log(styles.headerContainer);

  return (
    <header className={headerClass}>
      <Link href="/">
        <img src="/images/logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
