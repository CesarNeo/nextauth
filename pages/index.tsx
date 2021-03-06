import { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'
import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { withSSRGuest } from '../utils/withSSRGuest'

const Home: NextPage = () => {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {}
  }
})
