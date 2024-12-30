import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { APP_ENV } from './constants/env.ts'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ToastContainer, Zoom } from 'react-toastify'
import ErrorHendler from './components/error_hendler/index.tsx'
import RedirectHendler from './components/redirect_hendler/index.tsx'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={APP_ENV.GOOGLE_CLIENT_ID} >
        <GoogleReCaptchaProvider reCaptchaKey={APP_ENV.RECAPTCHA_SITE_KEY}>
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
          <App />
        </GoogleReCaptchaProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </Provider>

)
