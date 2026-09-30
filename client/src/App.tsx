import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
