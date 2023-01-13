import ReactDOM from 'react-dom'

import ContactsProvider from './providers/ContactsProvider'
import App from './App'

ReactDOM.render(
  <ContactsProvider>
    <App />
  </ContactsProvider>,
  document.getElementById('root')
)
