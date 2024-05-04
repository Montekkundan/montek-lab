import { HTMLLayout } from '../components/layout/html-layout'

const JustATest = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <p>Hello World!</p>
    </div>
  )
}

JustATest.Layout = HTMLLayout

JustATest.Title = 'HTML page'
JustATest.Tags = ['html', 'example']

export default JustATest