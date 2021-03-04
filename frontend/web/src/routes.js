import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";

import Feed from "./pages/Feed";
import New from "./pages/New";
//import Login from "./auth/login";

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       isAuthenticated() ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to={{ pathname: "/", state: { from: props.location } }} />
//       )
//     }
//   />
// );

const Routes = () => (
  <BrowserRouter>
    {/* <Route exact path="/" component={Login} /> */}
    <Route exact path="/" component={Feed} />
    <Route path="/new" component={New} />
  </BrowserRouter>
);

export default Routes;
