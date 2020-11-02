import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, user, ...rest }) => {

  return (

    <Route {...rest} render={
        props => {

          console.log(rest);
          console.log(props);
          console.log(user);

          if (user) {
            return <Component {...rest} {...props} />
          } else {
            return <Redirect to={
                {
                    pathname: "/unauthorized",
                    state: {
                      from: props.location
                    }
                }
            } />
          }
        }
    } />
  )
}

export default ProtectedRoute;