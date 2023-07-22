/* eslint-disable no-param-reassign */
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
      header: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

// CHECKPOINT: https://efficient-sloth-d85.notion.site/Desafio-01-Criando-um-projeto-do-zero-b1a3645d286b4eec93f5f1f5476d0ff7#7b3d1b08107d4b6faa40037715db1b15:~:text=Por%20fim%2C%20nos%20casos%20que%20cairem%20no%20fallback%2C%20%C3%A9%20obrigat%C3%B3rio%20que%20voc%C3%AA%20renderize%20pelo%20menos%20um%20texto%20na%20tela%20dizendo%20Carregando...%20para%20que%20o%20teste%20consiga%20verificar%20esses%20casos%20corretamente.

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default function Post({ post }: PostProps) {
  // console.log('post', post);

  if (!post || !post?.data) {
    return 'Loading...';
  }

  const contentToHtml = post.data.content.map(item => {
    return {
      header: item.header,
      body: RichText.asHtml(item.body),
    };
  });

  const amountWords = post.data.content.reduce((acc, current, idx) => {
    acc += current.header.split(' ').length;

    // console.log(`header words ${idx}`, current.header.split(' '));
    // console.log(`body words${idx}`, current.body.split(' '));

    acc += current.body.reduce(
      (accBody, currentBody) => accBody + currentBody.text.split(' ').length,
      0
    );

    return acc;
  }, 0);

  const timeToRead = Math.floor(amountWords / 200);

  // console.log('amountWords', amountWords);

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
              <span>{timeToRead} min</span>
            </div>
          </header>

          <main className={styles.content}>
            {contentToHtml.map(item => (
              <div key={Math.random()}>
                <h3 className={styles.blockTitle}>{item.header}</h3>
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
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', slug as string);

  // console.log(response.data.content[0].body);

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
          content: response.data.content,
          title: response.data.title,
        },
      },
    },
  };
};
