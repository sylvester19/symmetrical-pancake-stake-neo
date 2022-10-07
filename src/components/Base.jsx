import React, { Component } from "react";
import { Router, Switch, Route, Redirect, BrowserRouter, Routes } from "react-router-dom";
import Earn from "./Earn";

const $ = window.$;

const AppRoute = ({
  component: Component,
  layout: Layout,
  screenProps: ScreenProps,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <Layout screenProps={ScreenProps} {...props}>
        <Component {...props} />
      </Layout>
    )}
    isAuthed
  />
);

class Base extends Component {
  render() {
    
    return (
      <>
          <BrowserRouter>
            <Routes>
              <AppRoute
                path={"/earn"}
                component={Earn}
                exact
                // layout={OnBoardingLayout}
              />
            </Routes>
          </BrowserRouter>
      </>
    );
  }
}

export default Base;