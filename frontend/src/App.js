import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Domains from "./pages/Domains";
import DomainForm from "./components/DomainForm";
import DomainDetails from "./pages/DomainDetails";
import KPIForm from "./components/KPIForm";
import UseCaseForm from "./components/UseCaseForm";
import CapabilityForm from "./components/CapabilityForm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/domains" component={Domains} />
            <Route exact path="/domains/new" component={DomainForm} />
            <Route exact path="/domains/:id" component={DomainDetails} />
            <Route path="/kpis" component={KPIForm} />
            <Route path="/use-cases" component={UseCaseForm} />
            <Route path="/capabilities" component={CapabilityForm} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
