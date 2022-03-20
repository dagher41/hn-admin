import {useState, useEffect} from "react";
import { Admin, Resource } from 'react-admin';
import {WorkspaceShow, WorkspacesList} from "../components/workspaces/Workspaces";
import authProvider from "../lib/authProvider";
import LoginPage from '../components/auth/Login';
import {buildDataProvider} from '../lib/buildHNDataProvider'
import firebase from "firebase/compat/app";

let authUser;
const App = () => {
    const [dataProvider, setDataProvider] = useState(null);
    if (!authUser) {
      async function checkAuthUser() {
        try {
          authUser = await authProvider.getAuthUser()
          
          const idToken = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
          localStorage.setItem('idToken', idToken);
          
          authUser.auth.authStateSubscription.addObserver(_user => { 
            buildDataProvider(authProvider, setDataProvider);
          });
        } catch(error) { 
          /* call getAuthUser throws an undefined error when user is not logged */
          console.log('no logged in user: ', error);
          
          authProvider.logout();
          localStorage.removeItem('idToken');
          localStorage.removeItem('userUid');
          window.location.assign('#/login');
        }
      }
      checkAuthUser();
    }

    useEffect(async () => {
      buildDataProvider(authProvider, setDataProvider);
    }, []);

    if (!dataProvider) return (<p>Loading...</p>);
    
    return (
        <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={LoginPage}>
            <Resource name="workspaces" list={WorkspacesList} show={WorkspaceShow}/>
        </Admin>
    );
}

export default App;