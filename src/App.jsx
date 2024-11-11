import SearchBar from './SearchBar.jsx'
import NYT from './NYTapi.jsx'
import './App.css'

// Exemple call : https://api.nytimes.com/svc/archive/v1/2024/1.json?api-key=F5QaAZeSsncE5ix4h6ZTy66HApHlAzAs


function App() {

  const printDate = (date) => {
    console.log("Working. Date is :", date);
  }



  return (
    <>
    <div>
      <SearchBar props={printDate}/>
      <NYT/>
    </div>
    </>
  )
}

export default App
