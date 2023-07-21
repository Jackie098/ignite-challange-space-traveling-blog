/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/button-has-type */
import { GetStaticProps } from 'next';

import { useState } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { createClient } from '../prismicio';
import { addMaskPtBr } from '../utils/date';
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
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page: string;
  prev_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// type Pagination = {
//   previousPage: string | null;
//   nextPage: string | null;
// };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination }: HomeProps) {
  const router = useRouter();

  const [posts, setPosts] = useState(postsPagination);

  // console.log(posts);

  if (posts === undefined || posts.results?.length === 0) {
    return 'Loading...';
  }

  // console.log(postsPagination);
  async function handlePagination(nextPage: string) {
    const response = await fetch(nextPage);
    const data: PostPagination = await response.json();

    // console.log('pagination', data);
    const postsNextPage = data.results.map(post => {
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
      };
    });

    setPosts({
      ...posts,
      page: data.page,
      prev_page: data.prev_page,
      next_page: data.next_page,
      results: [...posts.results, ...postsNextPage],
    });
  }

  return (
    <div className={styles.container}>
      {posts.results.map(item => (
        <Link key={item.uid} href={`/post/${item.uid}`}>
          <button key={item.uid} className={styles.containerPost}>
            <h2>{item.data.title}</h2>
            <p>{item.data.subtitle}</p>
            <div className={styles.containerInfo}>
              <span>{item.first_publication_date}</span>

              <span>{item.data.author}</span>
            </div>
          </button>
        </Link>
      ))}

      {(posts.results.length < postsPagination.total_results_size ||
        postsPagination.page === postsPagination.total_pages) && (
        <button
          className={styles.btnLoadMore}
          onClick={() => {
            handlePagination(posts.next_page);
          }}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // const prismic = getPrismicClient();
  const prismic = createClient();
  const postsResponse = await prismic.getByType('posts', {
    // fetch: ['post.title', 'post.subtitle'],
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
    page: 1,
    pageSize: 2,
  });

  // console.log(postsResponse);

  const posts = postsResponse.results.map(post => {
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
      postsPagination: {
        ...postsResponse,
        results: posts,
      },
    },
  };
};
