/* eslint-disable react/button-has-type */
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5].map(item => (
        <div className={styles.containerPost}>
          <h2>Como utilizar Hooks</h2>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.containerInfo}>
            <span>15 Mar 2021</span>

            <span>Joseph Oliveira</span>
          </div>
        </div>
      ))}

      {/* // eslint-disable-next-line react/button-has-type */}
      <button className={styles.btnLoadMore} onClick={() => {}}>
        Carregar mais posts
      </button>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
