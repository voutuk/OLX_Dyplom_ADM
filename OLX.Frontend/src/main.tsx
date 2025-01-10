import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/index.ts'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { APP_ENV } from './constants/env.ts'
import { ToastContainer, Zoom } from 'react-toastify'

import SignalRListener from './components/hendlers/signal_listener/index.tsx'
import RedirectHendler from './components/hendlers/redirect_hendler/index.tsx'
import ErrorHendler from './components/hendlers/error_hendler/index.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={APP_ENV.GOOGLE_CLIENT_ID} >
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom} />
        <RedirectHendler />
        <ErrorHendler />
        <SignalRListener/>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </Provider>

)
