/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';

import { RichText } from 'prismic-dom';
import Head from 'next/head';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default function Post({ post }: PostProps) {
  console.log('post', post);
  // console.log(post.data.content[0].body);
  // const amountWords = post.data.content.reduce();

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      <div className={styles.bannerContainer}>
        <img
          className={styles.banner}
          src={post.data.banner.url}
          alt="Banner do texto"
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={styles.contentContainer}>
          <header className={styles.header}>
            <h1>{post.data.title}</h1>
            <div className={styles.headerInformations}>
              <span>{post.first_publication_date}</span>
              <span>{post.data.author}</span>
              <span>Tempo de leitura</span>
            </div>
          </header>

          <main className={styles.content}>
            {post.data.content.map(item => (
              <div key={Math.random()}>
                <h3 className={styles.blockTitle}>{item.heading}</h3>
                <div
                  className={styles.blockContent}
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.getByType('posts');

  // return {
  //   paths: [
  //     { params: { slug: 'criando-um-app-cra-do-zero1' } },
  //     { params: { slug: 'oi-oi-oi1' } },
  //   ],
  //   fallback: 'blocking',
  // };

  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', slug as string);

  console.log(response.data.content[0].body);

  return {
    props: {
      post: {
        uid: response.uid,
        first_publication_date: format(
          new Date(response.first_publication_date),
          'dd MMM Y',
          {
            locale: ptBR,
          }
        ),
        data: {
          author: response.data.author,
          banner: {
            url: response.data.banner.url,
          },
          content: response.data.content.map(item => {
            return {
              heading: item.header,
              body: RichText.asHtml(item.body),
            };
          }),
          title: response.data.title,
        },
      },
    },
  };
};
