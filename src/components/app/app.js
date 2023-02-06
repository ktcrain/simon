import "./app.scss";
import Board from "../board";
import { BoardContextProvider } from "../board/hooks";

function App() {
  return (
    <div className="App">
      <header className="App-header">[header]</header>
      <main className="App-main">
        <BoardContextProvider>
          <Board />
        </BoardContextProvider>
      </main>
      <footer className="App-footer">[footer]</footer>
    </div>
  );
}

export default App;
