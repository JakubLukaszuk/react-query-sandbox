import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { resolve } from 'path'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Post{
  id: string,
  title: string
}

const POSTS : Array<Post> =[
  {"id": "1", "title": "post 1"},
  {"id": "2", "title": "post 2"}
]

function Home() {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(2000).then(()=> [...POSTS])
  })

  const newPostMutation = useMutation({
    mutationFn: (title: string) => wait(1000).then(()=> {
      POSTS.push({id: crypto.randomUUID(), title})
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"])
    }
  })

  if(postsQuery.isLoading) return <div>Loading...</div>
  if(postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <>
      <main >
        {postsQuery.data.map(post=> (
          <div key={post.id}>{post.title}</div>
        ))}
        <section>
          <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("tytuł cośtam")}>
            Doadaj nowy post
          </button>
        </section>
      </main>

    </>
  )
}

function wait(duration: number){
  return new Promise(resolve => setTimeout(resolve, duration))
}

export default Home;
