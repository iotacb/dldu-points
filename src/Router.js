import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Display from "./pages/Display"

function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<Home/>} />
					<Route path="register" element={<Register/>} />
					<Route path="dashboard" element={<Dashboard/>} />
					<Route path="dashboard/:uid" element={<Dashboard/>} />
					<Route path="display/:uid" element={<Display/>} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default Router;
