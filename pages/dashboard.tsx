import { NextPage } from 'next'
import { useEffect } from 'react'
import { Can } from '../components/Can'
import { useAuth } from '../contexts/AuthContext'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export const Dashboard: NextPage = () => {
  const { user, signOut } = useAuth()

  useEffect(() => {
    api
      .get('me')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button type="button" onClick={signOut}>
        Sign out
      </button>

      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
  )
}

export default Dashboard

export const getServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupAPIClient(ctx)

  const response = await apiClient.get('/me')

  console.log(response.data)

  return {
    props: {}
  }
})
