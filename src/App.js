import Router from "./Router";

import { FirebaseProvider } from "./context/FirebaseContext";
import { UserProvider } from "./context/UserContext";

function App() {
	return (
		<FirebaseProvider>
			<UserProvider>
				<Router />
			</UserProvider>
		</FirebaseProvider>
	);
}

export default App;
