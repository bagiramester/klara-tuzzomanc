import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { Adatkezeles, Impresszum } from "@/pages/Legal";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/impresszum" component={Impresszum} />
        <Route path="/adatkezeles" component={Adatkezeles} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
