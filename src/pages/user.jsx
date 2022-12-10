import { getSession, signOut } from 'next-auth/react'

//gets a prop from getSererSideProps

function User({ user }) {
  return (
    <div>
      <h1>User Session:</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => signOut({ redirect: '/signin' })}>Sign Out</button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: { user: session.user },
  }
}

export default User
