import { HTMLLayout } from '../components/layout/html-layout'

const Test = () => {
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

Test.Layout = HTMLLayout

Test.Title = 'HTML page'
Test.Tags = ['html', 'example']

export default Test