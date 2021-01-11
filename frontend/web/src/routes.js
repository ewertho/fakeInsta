import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";

import Feed from "./pages/Feed";
import New from "./pages/New";
import Login from "./auth/login";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <PrivateRoute path="/feed" component={Feed} />
      <PrivateRoute path="/new" component={New} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
