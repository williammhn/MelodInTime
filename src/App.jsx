import SearchBar from './SearchBar.jsx'
import NYT from './NYTapi.jsx'
import './App.css'


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
