import Router from "./Router";

import { FirebaseProvider } from "./context/FirebaseContext";

function App() {
	return (
		<FirebaseProvider>
			<Router />
		</FirebaseProvider>
	);
}

export default App;
