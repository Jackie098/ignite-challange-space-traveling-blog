/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/button-has-type */
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { createClient } from '../prismicio';
import { addMaskPtBr } from '../utils/date';

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
  postsPagination: Post[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination }: HomeProps) {
  console.log('postsPagination', postsPagination);

  return (
    <div className={styles.container}>
      {postsPagination.map(item => (
        <div key={item.uid} className={styles.containerPost}>
          <h2>{item.data.title}</h2>
          <p>{item.data.subtitle}</p>
          <div className={styles.containerInfo}>
            <span>{item.first_publication_date}</span>

            <span>{item.data.author}</span>
          </div>
        </div>
      ))}

      {/* // eslint-disable-next-line react/button-has-type */}
      <button
        className={styles.btnLoadMore}
        onClick={() => {
          console.log('oi');
        }}
      >
        Carregar mais posts
      </button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // const prismic = getPrismicClient();
  const prismic = createClient();
  // TODO: Pagination
  const postsResponse = await prismic.getAllByType('posts', {
    // fetch: ['post.title', 'post.subtitle'],
    pageSize: 2,
  });

  const posts = postsResponse.map(post => {
    return {
      uid: post.uid,
      first_publication_date: addMaskPtBr(
        new Date(post.first_publication_date)
      ),
      data: {
        author: post.data.author,
        title: post.data.title,
        subtitle: post.data.subtitle,
      },
      // excerpt:
      //   post.data.content
      //     .find(content =>
      //       content.body.find(contentBody => contentBody.type === 'paragraph')
      //     )
      //     .body.find(contentBody => contentBody.type === 'paragraph')?.text ??
      //   '',
    };
  });

  return {
    props: {
      postsPagination: posts,
    },
  };
};
