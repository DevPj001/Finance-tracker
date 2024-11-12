import {Signup} from './components/Signup';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import { Signin } from './components/Signin';
import ChangePassword from './components/ChangePassword';
import Sidebar from './components/Sidebar';
import FinanceApp from './components/FinanceApp';
import Analytics from './components/Analytics';
function App() {

  return (
    <BrowserRouter>
          <Routes>
            <Route path='/home' element={<FinanceApp/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Signin/>}/>
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/Sidebar" element={<Sidebar/>}/>
             <Route path="/Analytics" element={<Analytics/>}/>

            

          </Routes>
    </BrowserRouter>
  )
}

export default App;