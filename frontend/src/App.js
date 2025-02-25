import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Domains from "./pages/Domains";
import DomainDetails from "./pages/DomainDetails";
import KPIs from "./pages/KPIs";
import UseCases from "./pages/UseCases";
import Capabilities from "./pages/Capabilities";
import Applications from "./pages/Applications";
import BusinessRules from "./pages/BusinessRules";
import DataElements from "./pages/DataElements";
import TechnicalComponents from "./pages/TechnicalComponents";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/domains" component={Domains} />
          <Route path="/domains/:id" component={DomainDetails} />
          <Route path="/domains/:domainId/kpis" component={KPIs} />
          <Route path="/domains/:domainId/kpis/:kpiId/edit" component={KPIs} />
          <Route path="/domains/:domainId/useCases" component={UseCases} />
          <Route
            path="/domains/:domainId/useCases/:useCaseId/edit"
            component={UseCases}
          />
          <Route
            path="/domains/:domainId/capabilities"
            component={Capabilities}
          />
          <Route
            path="/domains/:domainId/capabilities/:capabilityId/edit"
            component={Capabilities}
          />
          <Route
            path="/domains/:domainId/applications"
            component={Applications}
          />
          <Route
            path="/domains/:domainId/applications/:applicationId/edit"
            component={Applications}
          />
          <Route
            path="/domains/:domainId/businessRules"
            component={BusinessRules}
          />
          <Route
            path="/domains/:domainId/businessRules/:ruleId/edit"
            component={BusinessRules}
          />
          <Route
            path="/domains/:domainId/dataElements"
            component={DataElements}
          />
          <Route
            path="/domains/:domainId/dataElements/:dataElementId/edit"
            component={DataElements}
          />
          <Route
            path="/domains/:domainId/technicalComponents"
            component={TechnicalComponents}
          />
          <Route
            path="/domains/:domainId/technicalComponents/:componentId/edit"
            component={TechnicalComponents}
          />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
